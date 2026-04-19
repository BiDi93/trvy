<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\FreelancerPublicResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class FreelancerController extends Controller
{
    public function show(User $user): JsonResponse
    {
        if ($user->role !== 'freelancer' || !$user->is_active) {
            return response()->json(['message' => 'Freelancer not found.'], 404);
        }

        $user->load([
            'freelancerProfile',
            'services' => fn($q) => $q->active()->with('category'),
        ]);

        return response()->json(new FreelancerPublicResource($user));
    }
}
