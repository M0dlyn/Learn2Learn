<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\NoteController;

Route::middleware('auth:sanctum')->group(function () {
    // Custom Note Routes
    Route::get('/notes/tags/{tag}', [NoteController::class, 'getByTag'])->name('notes.getByTag');
    Route::get('/notes/newest', [NoteController::class, 'newest'])->name('notes.newest');
    Route::get('/notes/oldest', [NoteController::class, 'oldest'])->name('notes.oldest');

    // Standard API Resource Routes for Notes
    // index: GET /notes
    // store: POST /notes
    // show: GET /notes/{note}
    // update: PUT/PATCH /notes/{note}
    // destroy: DELETE /notes/{note}
    Route::apiResource('notes', NoteController::class);

    // You might want to add other API routes here, for example, for the authenticated user:
    // Route::get('/user', function (Request $request) {
    //     return $request->user();
    // });
});
