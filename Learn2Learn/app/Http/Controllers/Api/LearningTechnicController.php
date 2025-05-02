<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LearningTechnic;
use App\Http\Resources\LearningTechnicResource;
use Illuminate\Http\Request;

class LearningTechnicController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Return a collection of resources
        return LearningTechnicResource::collection(LearningTechnic::paginate(15)); // Added pagination
    }

    /**
     * Store a newly created resource in storage.
     * (Keep default or implement if needed later)
     */
    public function store(Request $request)
    {
        // Default implementation - requires validation and data handling
        return response()->json(['message' => 'Store method not implemented.'], 501);
    }

    /**
     * Display the specified resource.
     */
    public function show(LearningTechnic $learningTechnic)
    {
        // Return a single resource
        return new LearningTechnicResource($learningTechnic);
    }

    /**
     * Update the specified resource in storage.
     * (Keep default or implement if needed later)
     */
    public function update(Request $request, LearningTechnic $learningTechnic)
    {
        // Default implementation - requires validation and data handling
         return response()->json(['message' => 'Update method not implemented.'], 501);
    }

    /**
     * Remove the specified resource from storage.
     * (Keep default or implement if needed later)
     */
    public function destroy(LearningTechnic $learningTechnic)
    {
        // Default implementation - requires authorization logic
         return response()->json(['message' => 'Destroy method not implemented.'], 501);
    }
}
