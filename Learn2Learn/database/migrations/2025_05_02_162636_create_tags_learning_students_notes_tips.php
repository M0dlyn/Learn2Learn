<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * This creates all tables for the L2L project in the correct order to respect dependencies.
     */
    public function up(): void
    {
        // 1. Create tags table
        Schema::create('tags', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->timestamps();
        });

        // 2. Create learning_technics table
        Schema::create('learning_technics', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('short_desc');
            $table->text('detailed_desc');
            $table->timestamps();
        });

        // 3. Create students table
        Schema::create('students', function (Blueprint $table) {
            $table->id();
            $table->string('username')->unique();
            $table->string('name'); // Added for Laravel compatibility
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable(); // For email verification
            $table->string('password');
            $table->rememberToken(); // For "remember me" functionality
            $table->timestamps();
        });

        // 4. Create notes table (depends on students and learning_technics)
        Schema::create('notes', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('content');
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('learning_technic_id');
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('students')->onDelete('cascade');
            $table->foreign('learning_technic_id')->references('id')->on('learning_technics')->onDelete('cascade');
        });

        // 5. Create tag_notes table (depends on tags and notes)
        Schema::create('tag_notes', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('tag_id');
            $table->unsignedBigInteger('note_id');
            $table->timestamps();

            $table->foreign('tag_id')->references('id')->on('tags')->onDelete('cascade');
            $table->foreign('note_id')->references('id')->on('notes')->onDelete('cascade');
            
            // Ensure no duplicate tag-note combinations
            $table->unique(['tag_id', 'note_id']);
        });

        // 6. Create tips table
        Schema::create('tips', function (Blueprint $table) {
            $table->id();
            $table->text('tip');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     * Drop tables in reverse order to respect foreign key constraints.
     */
    public function down(): void
    {
        Schema::dropIfExists('tag_notes');
        Schema::dropIfExists('tips');
        Schema::dropIfExists('notes');
        Schema::dropIfExists('students');
        Schema::dropIfExists('learning_technics');
        Schema::dropIfExists('tags');
    }
};
