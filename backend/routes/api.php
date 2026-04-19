<?php

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\FreelancerController;
use App\Http\Controllers\Api\V1\ServiceController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {

    // Public auth routes
    Route::prefix('auth')->group(function () {
        Route::post('register', [AuthController::class, 'register']);
        Route::post('login',    [AuthController::class, 'login']);
        Route::post('otp/send',   [AuthController::class, 'sendOtp']);
        Route::post('otp/verify', [AuthController::class, 'verifyOtp']);
    });

    // Public search & discovery
    Route::get('categories',          [ServiceController::class, 'categories']);
    Route::get('services',            [ServiceController::class, 'index']);
    Route::get('services/{service}',  [ServiceController::class, 'show']);
    Route::get('freelancers/{user}',  [FreelancerController::class, 'show']);

    // Protected routes
    Route::middleware('auth:sanctum')->group(function () {
        Route::prefix('auth')->group(function () {
            Route::post('logout', [AuthController::class, 'logout']);
            Route::get('me',     [AuthController::class, 'me']);
            Route::post('me',    [AuthController::class, 'update']); // multipart/form-data
        });
    });

});
