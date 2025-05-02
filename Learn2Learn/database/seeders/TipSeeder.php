<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Tip;

class TipSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tips = [
            ['tip' => 'Break your study into chunks.'],
            ['tip' => 'Review often, even if briefly.'],
            ['tip' => 'Test yourself regularly.'],
            ['tip' => 'Find a quiet study space.'],
            ['tip' => 'Stay hydrated and nourished.'],
        ];

        // Insert the tips into the database
        foreach ($tips as $tip) {
            Tip::create($tip);
        }
    }
}
