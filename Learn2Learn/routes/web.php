<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\TipController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';

// Update existing /tips route to get all tips
Route::get('/tips', [TipController::class, 'index'])->name('tips.index');

// Add new route for a random tip
Route::get('/tips/random', [TipController::class, 'random'])->name('tips.random');
