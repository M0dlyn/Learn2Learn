<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\NoteController;
use App\Http\Controllers\Api\TagController;
use App\Http\Controllers\Api\LearningTechnicController;
use App\Http\Controllers\Api\NoteRatingController;
use App\Http\Controllers\Api\LearningTechniqueController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|*/

Route::middleware('auth:sanctum')->group(function () {
    // Custom Note Routes
    Route::get('/notes/tag/{tag}', [NoteController::class, 'getByTag'])->name('notes.getByTag');
    Route::get('/notes/tags/{tag}', [NoteController::class, 'getByTag'])->name('notes.getByTag');
    Route::get('/notes/newest', [NoteController::class, 'newest'])->name('notes.newest');
    Route::get('/notes/oldest', [NoteController::class, 'oldest'])->name('notes.oldest');
    
    // AI note rating
    Route::post('/notes/{note}/rate', [NoteRatingController::class, 'rate'])->name('notes.rate');

    // Standard API Resource Routes for Notes
    // index: GET /notes
    // store: POST /notes
    // show: GET /notes/{note}
    // update: PUT/PATCH /notes/{note}
    // destroy: DELETE /notes/{note}
    Route::apiResource('notes', NoteController::class);
    
    // Custom Tag Routes
    Route::get('/tags/popular', [TagController::class, 'popular'])->name('tags.popular');
    Route::get('/tags/unused', [TagController::class, 'unused'])->name('tags.unused');
    
    // Standard API Resource Routes for Tags
    Route::apiResource('tags', TagController::class);

    // Learning Technic Routes (Read-only for now)
    Route::apiResource('learning-technics', LearningTechnicController::class)->only([
        'index', 'show'
    ]);

    // Route for fetching learning techniques
    Route::get('/learning-techniques', [LearningTechniqueController::class, 'index']);

    // You might want to add other API routes here, for example, for the authenticated user:
    // Route::get('/user', function (Request $request) {
    //     return $request->user();
    // });
});
