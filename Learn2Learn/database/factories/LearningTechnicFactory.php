<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\LearningTechnic>
 */
class LearningTechnicFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->words(3, true),
            'short_desc' => $this->faker->sentence(10), // Generate a short sentence
            'detailed_desc' => $this->faker->paragraph(3), // Generate a few paragraphs
        ];
    }
}
