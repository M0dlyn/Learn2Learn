<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Note;
use App\Services\GeminiAIService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NoteRatingController extends Controller
{
    protected $geminiService;

    /**
     * Constructor to inject dependencies
     */
    public function __construct(GeminiAIService $geminiService)
    {
        $this->geminiService = $geminiService;
    }

    /**
     * Rate a note using Gemini AI
     *
     * @param Request $request
     * @param Note $note
     * @return \Illuminate\Http\JsonResponse
     */
    public function rate(Request $request, Note $note)
    {
        // Authorization check - ensure user owns the note or has permission
        if ($note->user_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        // Use the GeminiAIService to rate the note
        $ratingResult = $this->geminiService->rateNote($note);

        if (!$ratingResult['success']) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get AI rating',
                'error' => $ratingResult['error'] ?? 'Unknown error'
            ], 500);
        }

        return response()->json([
            'success' => true,
            'rating' => $ratingResult['rating'],
            'feedback' => $ratingResult['feedback']
        ]);
    }
}
