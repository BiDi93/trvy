<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    use \Illuminate\Database\Eloquent\SoftDeletes;

    protected $fillable = [
        'user_id', 'category_id', 'title', 'description',
        'min_price', 'price_type', 'images', 'is_active',
    ];

    protected function casts(): array
    {
        return [
            'images'    => 'array',
            'is_active' => 'boolean',
            'min_price' => 'float',
        ];
    }

    public function freelancer()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function category()
    {
        return $this->belongsTo(ServiceCategory::class, 'category_id');
    }

    // Scope: only active services from active freelancers
    public function scopeActive($query)
    {
        return $query->where('is_active', true)
            ->whereHas('freelancer', fn($q) => $q->where('is_active', true));
    }

    public function scopeSearch($query, ?string $term)
    {
        if (!$term) return $query;
        return $query->where(function ($q) use ($term) {
            $q->where('title', 'like', "%{$term}%")
              ->orWhere('description', 'like', "%{$term}%");
        });
    }

    public function scopeByCategory($query, ?string $slug)
    {
        if (!$slug) return $query;
        return $query->whereHas('category', fn($q) => $q->where('slug', $slug));
    }

    public function scopeByLocation($query, ?string $location)
    {
        if (!$location) return $query;
        return $query->whereHas('freelancer.freelancerProfile',
            fn($q) => $q->where('location', 'like', "%{$location}%")
        );
    }

    public function scopeByPriceRange($query, ?float $min, ?float $max)
    {
        if ($min) $query->where('min_price', '>=', $min);
        if ($max) $query->where('min_price', '<=', $max);
        return $query;
    }
}
