<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'            => $this->id,
            'name'          => $this->name,
            'email'         => $this->email,
            'phone'         => $this->phone,
            'role'          => $this->role,
            'avatar_url'    => $this->avatar_url,
            'kyc_status'    => $this->kyc_status,
            'is_active'     => $this->is_active,
            'email_verified'=> !is_null($this->email_verified_at),
            'created_at'    => $this->created_at?->toDateTimeString(),
            'profile'       => $this->when(
                $this->isFreelancer() && $this->relationLoaded('freelancerProfile'),
                fn() => [
                    'bio'          => $this->freelancerProfile?->bio,
                    'location'     => $this->freelancerProfile?->location,
                    'hourly_rate'  => $this->freelancerProfile?->hourly_rate,
                    'availability' => $this->freelancerProfile?->availability,
                    'rating_avg'   => $this->freelancerProfile?->rating_avg,
                    'total_jobs'   => $this->freelancerProfile?->total_jobs,
                    'certificates' => $this->freelancerProfile?->certificates ?? [],
                ]
            ),
        ];
    }
}
