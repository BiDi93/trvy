<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ServiceResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $freelancer = $this->freelancer;
        $profile    = $freelancer?->freelancerProfile;

        return [
            'id'          => $this->id,
            'title'       => $this->title,
            'description' => $this->description,
            'min_price'   => $this->min_price,
            'price_type'  => $this->price_type,
            'images'      => collect($this->images ?? [])->map(function ($path) {
                // Public frontend assets (seeded) vs user-uploaded storage files
                if (str_starts_with($path, 'images_services/')) {
                    return config('app.frontend_url') . '/' . $path;
                }
                return asset('storage/' . $path);
            })->values(),
            'category'    => [
                'id'   => $this->category?->id,
                'name' => $this->category?->name,
                'slug' => $this->category?->slug,
                'icon' => $this->category?->icon,
            ],
            'freelancer'  => [
                'id'         => $freelancer?->id,
                'name'       => $freelancer?->name,
                'avatar_url' => $freelancer?->avatar_url,
                'location'   => $profile?->location,
                'rating_avg' => $profile?->rating_avg ?? 0,
                'total_jobs' => $profile?->total_jobs ?? 0,
                'kyc_status' => $freelancer?->kyc_status,
            ],
        ];
    }
}
