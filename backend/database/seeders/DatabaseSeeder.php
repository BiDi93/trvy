<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(RoleSeeder::class);
        $this->call(CategorySeeder::class);
        $this->call(SampleFreelancerSeeder::class);

        // Admin seed user for local dev
        $admin = User::firstOrCreate(
            ['email' => 'admin@trvy.local'],
            [
                'name'     => 'trvy Admin',
                'password' => bcrypt('password'),
                'role'     => 'admin',
                'is_active'=> true,
            ]
        );
        $admin->assignRole('admin');
    }
}
