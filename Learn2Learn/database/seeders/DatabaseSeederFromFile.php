<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Schema;

class DatabaseSeederFromFile extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Disable foreign key checks
        DB::statement('PRAGMA foreign_keys = OFF');
        
        // Tables to truncate - add all tables from your SQL file in the correct order
        $tables = [
            'tips', 
            'tag_notes', 
            'tags', 
            'notes', 
            'learning_technics'
        ];
        
        // Truncate tables
        foreach ($tables as $table) {
            if (Schema::hasTable($table)) {
                DB::table($table)->truncate();
                $this->command->info("Table {$table} truncated");
            }
        }
        
        // Path to the SQL file
        $sqlFilePath = database_path('seeders/mock_data.sql');

        // Check if the file exists
        if (File::exists($sqlFilePath)) {
            // Load the SQL file content
            $sql = File::get($sqlFilePath);

            // Execute the SQL statements
            DB::unprepared($sql);

            $this->command->info('Database seeded with data from mock_data.sql');
        } else {
            $this->command->error('SQL file not found: ' . $sqlFilePath);
        }
        
        // Re-enable foreign key checks
        DB::statement('PRAGMA foreign_keys = ON');
    }
}