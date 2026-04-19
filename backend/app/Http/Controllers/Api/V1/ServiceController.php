<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\ServiceCategoryResource;
use App\Http\Resources\ServiceResource;
use App\Models\Service;
use App\Models\ServiceCategory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    public function categories(): JsonResponse
    {
        $categories = ServiceCategory::where('is_active', true)->orderBy('name')->get();
        return response()->json(ServiceCategoryResource::collection($categories));
    }

    public function index(Request $request): JsonResponse
    {
        $query = Service::active()
            ->with(['freelancer.freelancerProfile', 'category'])
            ->search($request->q)
            ->byCategory($request->category)
            ->byLocation($request->location)
            ->byPriceRange($request->min_price, $request->max_price);

        match ($request->sort) {
            'price_asc'  => $query->orderBy('min_price', 'asc'),
            'price_desc' => $query->orderBy('min_price', 'desc'),
            'rating'     => $query->orderByDesc(
                \App\Models\FreelancerProfile::select('rating_avg')
                    ->whereColumn('user_id', 'services.user_id')
                    ->limit(1)
            ),
            default      => $query->latest(),
        };

        $services = $query->paginate(12);

        return response()->json([
            'data'       => ServiceResource::collection($services),
            'pagination' => [
                'total'        => $services->total(),
                'per_page'     => $services->perPage(),
                'current_page' => $services->currentPage(),
                'last_page'    => $services->lastPage(),
            ],
        ]);
    }

    public function show(Service $service): JsonResponse
    {
        $service->load(['freelancer.freelancerProfile', 'category']);
        return response()->json(new ServiceResource($service));
    }
}
