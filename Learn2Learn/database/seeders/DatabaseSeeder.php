<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Database\Seeders\TipSeeder; // Add TipSeeder import
use Database\Seeders\LearningTechnicSeeder; // <-- Import the new seeder

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        // User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);

        $this->call([
            TipSeeder::class, // Add TipSeeder here
            LearningTechnicSeeder::class, // <-- Add the call here
            // Add other seeders if needed
        ]);
    }
}
