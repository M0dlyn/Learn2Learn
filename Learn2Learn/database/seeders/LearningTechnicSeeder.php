<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\LearningTechnic; // Import the model
use Illuminate\Support\Facades\DB; // Import DB facade for insert
use Carbon\Carbon; // Import Carbon for timestamps

class LearningTechnicSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Optional: Clear the table before seeding
        // DB::table('learning_technics')->truncate();

        $now = Carbon::now();

        $techniques = [
            [
                'name' => 'Pomodoro Technique',
                'short_desc' => 'Work for 25 minutes, then take a 5-minute break. After 4 cycles, take a longer break.',
                'detailed_desc' => 'Work for 25 minutes, then take a 5-minute break. After 4 cycles, take a longer break. This helps improve focus and manage mental fatigue.',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'Spaced Repetition',
                'short_desc' => 'Review information at increasing intervals to improve long-term retention.',
                'detailed_desc' => 'Review information at increasing intervals (e.g., 1 day, 3 days, 1 week) to combat the forgetting curve and enhance long-term memory.',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'Feynman Technique',
                'short_desc' => 'Explain a concept in simple terms to identify gaps in your understanding.',
                'detailed_desc' => 'Explain a concept in the simplest terms possible, as if teaching it to someone else. This process reveals gaps in your own understanding.',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'Active Recall',
                'short_desc' => 'Test yourself on material instead of passively reviewing it.',
                'detailed_desc' => 'Actively retrieve information from memory (e.g., using flashcards, practice questions) instead of passively re-reading or highlighting.',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'Mind Mapping',
                'short_desc' => 'Create visual diagrams to connect related concepts and ideas.',
                'detailed_desc' => 'Start with a central topic and branch out with related ideas, keywords, and concepts to create a visual overview that aids understanding and recall.',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'Cornell Method',
                'short_desc' => 'Divide your page into sections for notes, cues, and summary.',
                'detailed_desc' => 'Structure note-taking by dividing a page into main notes, cues/questions, and a summary section to facilitate organized review and recall.',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            // Add more techniques if needed
        ];

        // Insert the data into the table
        DB::table('learning_technics')->insert($techniques);

        // Alternatively, using Eloquent's create (handles timestamps automatically but slower for bulk)
        // foreach ($techniques as $techniqueData) {
        //     LearningTechnic::create($techniqueData);
        // }
    }
}
