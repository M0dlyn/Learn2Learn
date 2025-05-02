<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Tip;

class TipController extends Controller
{
    /**
     * Display a listing of all tips.
     */
    public function index()
    {
        $tips = Tip::all();
        return response()->json($tips);
    }

    /**
     * Display a single random tip.
     */
    public function random()
    {
        // Fetch a single random tip from the database
        $tip = Tip::inRandomOrder()->first();

        // Return the tip as JSON, or handle case where no tips exist
        return response()->json($tip ?? ['tip' => 'No tips available yet!']);
    }
}
