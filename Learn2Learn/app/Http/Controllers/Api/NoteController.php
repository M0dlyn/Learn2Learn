<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Note;
use App\Models\Tag;
use App\Http\Requests\StoreNoteRequest;
use App\Http\Requests\UpdateNoteRequest;
use App\Http\Resources\NoteResource;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;

class NoteController extends Controller
{
    use AuthorizesRequests;

    /**
     * Constructor to apply middleware.
     * Optional: Apply policy middleware here instead of in each method.
     */
    // public function __construct()
    // {
    //     $this->authorizeResource(Note::class, 'note');
    // }

    /**
     * Display a listing of the resource for the authenticated user.
     */
    public function index(Request $request)
    {
        $this->authorize('viewAny', Note::class); // Policy check

        $notes = $request->user()->notes()->with('tags')->latest()->paginate(15); // Eager load tags

        return NoteResource::collection($notes);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreNoteRequest $request)
    {
        // Authorization is implicitly handled by StoreNoteRequest and create policy
        // No need for $this->authorize('create', Note::class); if policy is simple true

        $validated = $request->validated();

        $note = $request->user()->notes()->create([
            'title' => $validated['title'],
            'content' => $validated['content'],
            'learning_technic_id' => $validated['learning_technic_id'],
        ]);

        // Sync tags if they are provided
        if (isset($validated['tags'])) {
            $note->tags()->sync($validated['tags']);
        }

        $note->load('tags'); // Load tags for the response

        return new NoteResource($note);
    }

    /**
     * Display the specified resource.
     */
    public function show(Note $note)
    {
        $this->authorize('view', $note); // Policy check

        $note->load('tags'); // Load tags for the response

        return new NoteResource($note);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateNoteRequest $request, Note $note)
    {
        $this->authorize('update', $note); // Policy check

        $validated = $request->validated();

        $note->update($validated);

        // Sync tags if they are provided in the update request
        if ($request->has('tags')) {
             // Use has() to check presence, even if empty array
            $note->tags()->sync($validated['tags'] ?? []); // Sync, defaulting to empty if null
        }

        $note->load('tags'); // Load tags for the response

        return new NoteResource($note);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Note $note)
    {
        $this->authorize('delete', $note); // Policy check

        $note->delete();

        return response()->noContent(); // Standard 204 No Content response
    }

    // --- Custom Methods ---

    /**
     * Get notes associated with a specific tag for the authenticated user.
     */
    public function getByTag(Request $request, Tag $tag) // Use route model binding for Tag
    {
        // Authorization check: Ensure user can view notes (similar to index)
        $this->authorize('viewAny', Note::class);

        // Fetch notes for the authenticated user that have the given tag
        $notes = $request->user()
                        ->notes() // Get user's notes
                        ->whereHas('tags', function ($query) use ($tag) {
                            $query->where('tags.id', $tag->id); // Filter by the specific tag ID
                        })
                        ->with('tags') // Eager load tags for the response
                        ->latest() // Order by newest
                        ->paginate(15); // Paginate results

        return NoteResource::collection($notes);
    }

    /**
     * Get the newest notes for the authenticated user.
     */
    public function newest(Request $request)
    {
        $this->authorize('viewAny', Note::class); // Users can view lists

        $notes = $request->user()->notes()->with('tags')->latest()->paginate(15);

        return NoteResource::collection($notes);
    }

    /**
     * Get the oldest notes for the authenticated user.
     */
    public function oldest(Request $request)
    {
        $this->authorize('viewAny', Note::class); // Users can view lists

        $notes = $request->user()->notes()->with('tags')->oldest()->paginate(15);

        return NoteResource::collection($notes);
    }
}
