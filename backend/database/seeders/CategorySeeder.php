<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            ['name' => 'Plumbing',     'slug' => 'plumbing',     'icon' => '🔧'],
            ['name' => 'Electrical',   'slug' => 'electrical',   'icon' => '💡'],
            ['name' => 'Air-Cond',     'slug' => 'air-cond',     'icon' => '❄️'],
            ['name' => 'IT Support',   'slug' => 'it-support',   'icon' => '💻'],
            ['name' => 'Solar',        'slug' => 'solar',        'icon' => '☀️'],
            ['name' => 'Cleaning',     'slug' => 'cleaning',     'icon' => '🧹'],
            ['name' => 'Renovation',   'slug' => 'renovation',   'icon' => '🏠'],
            ['name' => 'Landscaping',  'slug' => 'landscaping',  'icon' => '🌿'],
        ];

        foreach ($categories as $cat) {
            \App\Models\ServiceCategory::firstOrCreate(['slug' => $cat['slug']], $cat);
        }
    }
}
