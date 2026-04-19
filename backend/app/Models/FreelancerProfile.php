<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FreelancerProfile extends Model
{
    protected $fillable = [
        'user_id',
        'bio',
        'location',
        'hourly_rate',
        'availability',
        'certificates',
    ];

    protected function casts(): array
    {
        return [
            'availability' => 'boolean',
            'certificates' => 'array',
            'rating_avg'   => 'float',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
