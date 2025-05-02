<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tag;
use App\Http\Requests\StoreTagRequest;
use App\Http\Requests\UpdateTagRequest;
use App\Http\Resources\TagResource;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class TagController extends Controller
{
    use AuthorizesRequests;

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // Get all tags, possibly with notes count
        $tags = Tag::withCount('notes')->paginate(15);
        
        return TagResource::collection($tags);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTagRequest $request)
    {
        $validated = $request->validated();
        
        $tag = Tag::create([
            'name' => $validated['name'],
        ]);
        
        return new TagResource($tag);
    }

    /**
     * Display the specified resource.
     */
    public function show(Tag $tag)
    {
        // Load related notes if needed
        $tag->loadCount('notes');
        
        return new TagResource($tag);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTagRequest $request, Tag $tag)
    {
        $validated = $request->validated();
        
        $tag->update([
            'name' => $validated['name'],
        ]);
        
        return new TagResource($tag);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Tag $tag)
    {
        // Check if the tag has related notes before deletion
        if ($tag->notes()->count() > 0) {
            // Option 1: Return an error (uncomment if you want this behavior)
            // return response()->json(['error' => 'Cannot delete tag that is associated with notes'], 422);
            
            // Option 2: Detach all relationships and then delete
            $tag->notes()->detach();
        }
        
        $tag->delete();
        
        return response()->noContent(); // Standard 204 No Content response
    }
    
    /**
     * Get tags with most notes
     */
    public function popular(Request $request)
    {
        $tags = Tag::withCount('notes')
                   ->orderBy('notes_count', 'desc')
                   ->paginate(15);
                   
        return TagResource::collection($tags);
    }
    
    /**
     * Get unused tags (tags with no notes)
     */
    public function unused(Request $request)
    {
        $tags = Tag::doesntHave('notes')
                   ->paginate(15);
                   
        return TagResource::collection($tags);
    }
}