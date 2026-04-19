<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Requests\Auth\UpdateProfileRequest;
use App\Http\Resources\UserResource;
use App\Models\FreelancerProfile;
use App\Models\User;
use App\Services\FileUploadService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(RegisterRequest $request): JsonResponse
    {
        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'phone'    => $request->phone,
            'password' => $request->password,
            'role'     => $request->role,
        ]);

        $user->assignRole($request->role);

        if ($user->isFreelancer()) {
            FreelancerProfile::create([
                'user_id'     => $user->id,
                'bio'         => $request->bio,
                'location'    => $request->location,
                'hourly_rate' => $request->hourly_rate,
            ]);
            $user->load('freelancerProfile');
        }

        $token = $user->createToken('auth_token', [$request->role])->plainTextToken;

        logger("New registration: {$user->email} [{$user->role}]");

        return response()->json([
            'message' => 'Registration successful.',
            'token'   => $token,
            'user'    => new UserResource($user->fresh(['freelancerProfile'])),
        ], 201);
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        if (!$user->is_active) {
            return response()->json(['message' => 'Your account has been deactivated.'], 403);
        }

        // revoke old tokens for this device name, then issue fresh
        $user->tokens()->where('name', 'auth_token')->delete();
        $token = $user->createToken('auth_token', [$user->role])->plainTextToken;

        if ($user->isFreelancer()) {
            $user->load('freelancerProfile');
        }

        return response()->json([
            'token' => $token,
            'user'  => new UserResource($user),
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out successfully.']);
    }

    public function me(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user->isFreelancer()) {
            $user->load('freelancerProfile');
        }

        return response()->json(new UserResource($user));
    }

    public function update(UpdateProfileRequest $request, FileUploadService $uploader): JsonResponse
    {
        $user = $request->user();

        $data = $request->only(['name', 'phone']);

        if ($request->hasFile('avatar')) {
            $uploader->delete($user->avatar);
            $data['avatar'] = $uploader->upload($request->file('avatar'), 'avatars');
        }

        if ($request->hasFile('kyc_document')) {
            $uploader->delete($user->kyc_document);
            $data['kyc_document'] = $uploader->upload($request->file('kyc_document'), 'kyc');
            $data['kyc_status']   = 'pending';
        }

        $user->update($data);

        if ($user->isFreelancer()) {
            $profileData = $request->only(['bio', 'location', 'hourly_rate', 'availability']);
            $profileData = array_filter($profileData, fn($v) => !is_null($v));

            $user->freelancerProfile()->updateOrCreate(
                ['user_id' => $user->id],
                $profileData
            );
            $user->load('freelancerProfile');
        }

        return response()->json(new UserResource($user));
    }

    public function sendOtp(Request $request): JsonResponse
    {
        $request->validate(['phone' => ['required', 'string', 'max:20']]);

        $otp = rand(100000, 999999);
        cache()->put('otp_' . $request->phone, $otp, now()->addMinutes(5));

        // Local: log OTP instead of sending SMS
        logger("OTP for {$request->phone}: {$otp}");

        return response()->json(['message' => 'OTP sent. Check laravel.log for local dev.']);
    }

    public function verifyOtp(Request $request): JsonResponse
    {
        $request->validate([
            'phone' => ['required', 'string'],
            'otp'   => ['required', 'digits:6'],
        ]);

        $cached = cache()->get('otp_' . $request->phone);

        if (!$cached || (string) $cached !== (string) $request->otp) {
            return response()->json(['message' => 'Invalid or expired OTP.'], 422);
        }

        cache()->forget('otp_' . $request->phone);

        $user = User::where('phone', $request->phone)->first();

        if (!$user) {
            return response()->json(['message' => 'No account found for this phone number.'], 404);
        }

        $user->tokens()->where('name', 'auth_token')->delete();
        $token = $user->createToken('auth_token', [$user->role])->plainTextToken;

        if ($user->isFreelancer()) {
            $user->load('freelancerProfile');
        }

        return response()->json([
            'token' => $token,
            'user'  => new UserResource($user),
        ]);
    }
}
