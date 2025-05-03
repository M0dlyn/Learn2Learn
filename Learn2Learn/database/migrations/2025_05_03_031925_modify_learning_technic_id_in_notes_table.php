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
            // Make the existing column nullable
            $table->unsignedBigInteger('learning_technic_id')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('notes', function (Blueprint $table) {
            // Revert the column back to not nullable
            // Note: Ensure there are no null values before rolling back in a production environment
            $table->unsignedBigInteger('learning_technic_id')->nullable(false)->change();
        });
    }
};
