<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('notes', function (Blueprint $table) {
            // Drop the existing foreign key constraint
            $table->dropForeign(['user_id']);
            
            // Add the new foreign key constraint referencing users table
            $table->foreign('user_id')
                  ->references('id')
                  ->on('users')
                  ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('notes', function (Blueprint $table) {
            // Drop the users foreign key constraint
            $table->dropForeign(['user_id']);
            
            // Restore the original students foreign key constraint
            $table->foreign('user_id')
                  ->references('id')
                  ->on('students')
                  ->onDelete('cascade');
        });
    }
}; 