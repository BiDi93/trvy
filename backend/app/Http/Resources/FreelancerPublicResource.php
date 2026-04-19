<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FreelancerPublicResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $profile = $this->freelancerProfile;

        return [
            'id'         => $this->id,
            'name'       => $this->name,
            'avatar_url' => $this->avatar_url,
            'kyc_status' => $this->kyc_status,
            'profile'    => [
                'bio'          => $profile?->bio,
                'location'     => $profile?->location,
                'hourly_rate'  => $profile?->hourly_rate,
                'availability' => $profile?->availability,
                'rating_avg'   => $profile?->rating_avg ?? 0,
                'total_jobs'   => $profile?->total_jobs ?? 0,
                'certificates' => $profile?->certificates ?? [],
            ],
            'services'   => ServiceResource::collection(
                $this->whenLoaded('services')
            ),
        ];
    }
}
