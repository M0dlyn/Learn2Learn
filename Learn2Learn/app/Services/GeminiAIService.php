<?php

namespace App\Services;

use App\Models\Note;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;

class GeminiAIService
{
    protected $apiKey;
    protected $apiEndpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
    
    public function __construct()
    {
        $this->apiKey = config('services.gemini.api_key');
    }
    
    /**
     * Rate a note using Google's Gemini AI
     * 
     * @param Note $note The note to be rated
     * @return array Response with rating and feedback
     */
    public function rateNote(Note $note)
    {
        try {
            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
                'x-goog-api-key' => $this->apiKey
            ])->post($this->apiEndpoint, [
                'contents' => [
                    'parts' => [
                        [
                            'text' => "Please analyze and rate this study note from 1-10 based on clarity, accuracy, and effectiveness for learning. Also provide brief feedback on how to improve it.\n\nTitle: {$note->title}\nContent: {$note->content}"
                        ]
                    ]
                ],
                'generationConfig' => [
                    'temperature' => 0.4,
                    'topK' => 32,
                    'topP' => 1,
                    'maxOutputTokens' => 1024,
                ]
            ]);
            
            if ($response->successful()) {
                return $this->parseRatingFromResponse($response->json());
            } else {
                Log::error('Gemini API Error: ' . $response->body());
                return [
                    'success' => false,
                    'error' => 'API request failed with status: ' . $response->status()
                ];
            }
            
        } catch (\Exception $e) {
            Log::error('Gemini API Error: ' . $e->getMessage());
            return [
                'success' => false,
                'error' => 'Failed to get AI rating: ' . $e->getMessage()
            ];
        }
    }
    
    /**
     * Extract useful information from Gemini API response
     * 
     * @param array $result The API response
     * @return array Processed rating and feedback
     */
    protected function parseRatingFromResponse($result)
    {
        // Extract the rating and feedback from the Gemini response
        if (isset($result['candidates'][0]['content']['parts'][0]['text'])) {
            $responseText = $result['candidates'][0]['content']['parts'][0]['text'];
            
            // Try to extract numerical rating (1-10) from the response
            preg_match('/(\d+(\.\d+)?)\s*\/\s*10|Rating\s*:\s*(\d+(\.\d+)?)|Score\s*:\s*(\d+(\.\d+)?)/i', $responseText, $matches);
            
            $rating = null;
            if (!empty($matches)) {
                // Take the first captured number
                $rating = isset($matches[1]) ? (float)$matches[1] : 
                         (isset($matches[3]) ? (float)$matches[3] : 
                          (isset($matches[5]) ? (float)$matches[5] : null));
            }
            
            return [
                'success' => true,
                'rating' => $rating,
                'feedback' => $responseText
            ];
        }
        
        return [
            'success' => false,
            'error' => 'Unexpected API response format'
        ];
    }
}