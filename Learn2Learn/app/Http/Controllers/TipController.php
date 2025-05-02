<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class TipController extends Controller
{
    public function index()
    {
        return response()->json([
            ['id' => 1, 'content' => 'Break your study into chunks.'],
            ['id' => 2, 'content' => 'Review often, even if briefly.'],
        ]);
    }
}

