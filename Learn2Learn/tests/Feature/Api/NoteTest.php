<?php

namespace Tests\Feature\Api;

use App\Models\LearningTechnic;
use App\Models\Note;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum; // Import Sanctum
use Tests\TestCase;

class NoteTest extends TestCase
{
    use RefreshDatabase; // Reset database for each test

    /**
     * Test creating a note successfully.
     */
    public function test_authenticated_user_can_create_note(): void // Using traditional PHPUnit style test methods
    {
        // Arrange: Create necessary data
        $user = User::factory()->create();
        $learningTechnic = LearningTechnic::factory()->create();
        $tags = Tag::factory()->count(3)->create();

        // Prepare data for the request
        $noteData = [
            'title' => 'My Test Note Title',
            'content' => 'This is the content of the test note.',
            'learning_technic_id' => $learningTechnic->id,
            'tags' => $tags->pluck('id')->toArray(), // Send tag IDs
        ];

        // Act: Authenticate user and send POST request
        Sanctum::actingAs($user); // Authenticate the user for API requests
        $response = $this->postJson('/api/notes', $noteData); // Use postJson for API tests

        // Assert: Check the response and database state
        $response->assertStatus(201); // Check for 'Created' status

        // Check if the note exists in the database
        $this->assertDatabaseHas('notes', [
            'user_id' => $user->id,
            'title' => $noteData['title'],
            'content' => $noteData['content'],
            'learning_technic_id' => $learningTechnic->id,
        ]);

        // Find the created note to check tags
        $createdNote = Note::where('title', $noteData['title'])->first();
        $this->assertNotNull($createdNote);

        // Check if the correct tags are attached
        $this->assertCount(3, $createdNote->tags);
        $attachedTagIds = $createdNote->tags->pluck('id')->sort()->values();
        $expectedTagIds = $tags->pluck('id')->sort()->values();
        $this->assertEquals($expectedTagIds, $attachedTagIds);

        // Optionally check the response structure (matches NoteResource)
        $response->assertJsonStructure([
            'data' => [
                'id',
                'title',
                'content',
                'learning_technic_id',
                'created_at',
                'updated_at',
                'tags' // Check if tags are included
            ]
        ]);
         $response->assertJsonFragment(['title' => $noteData['title']]);
    }

    /**
     * Test listing notes for an authenticated user.
     */
    public function test_authenticated_user_can_list_notes(): void
    {
        // Arrange: Create a user and some notes for them
        $user = User::factory()->create();
        $learningTechnic = LearningTechnic::factory()->create(); // Need this for notes
        $notes = Note::factory()->count(3)->create([
            'user_id' => $user->id,
            'learning_technic_id' => $learningTechnic->id,
        ]);

        // Act: Authenticate and make the request
        Sanctum::actingAs($user);
        $response = $this->getJson('/api/notes');

        // Assert: Check the response status and structure
        $response->assertStatus(200);
        $response->assertJsonCount(3, 'data'); // Check we got 3 notes back in the 'data' array

        // Optionally, check the structure of the first note
        $response->assertJsonStructure([
            'data' => [
                '*' => [ // '*' means check each item in the array
                    'id',
                    'title',
                    'content',
                    'created_at',
                    'updated_at',
                    'tags' // Assuming NoteResource includes tags
                ]
            ],
            // Include checks for pagination links/meta if your endpoint uses pagination
            'links',
            'meta',
        ]);

        // Check if the returned notes actually belong to the user
        $returned_note_ids = collect($response->json('data'))->pluck('id');
        $notes->each(function ($note) use ($returned_note_ids) {
            expect($returned_note_ids)->toContain($note->id);
        });
    }

    /**
     * Test viewing a note for an authenticated user.
     */
    public function test_authenticated_user_can_view_note(): void
    {
        // Arrange: Create a user, their note, and another user's note
        $user = User::factory()->create();
        $learningTechnic = LearningTechnic::factory()->create();
        $note = Note::factory()->create([
            'user_id' => $user->id,
            'learning_technic_id' => $learningTechnic->id,
        ]);
        $otherUser = User::factory()->create();
        Note::factory()->create([ // Note belonging to someone else
            'user_id' => $otherUser->id,
            'learning_technic_id' => $learningTechnic->id,
        ]);

        // Act: Authenticate and request the user's specific note
        Sanctum::actingAs($user);
        $response = $this->getJson("/api/notes/{$note->id}");

        // Assert: Check the response status and data
        $response->assertStatus(200);
        $response->assertJsonStructure([
            'data' => [
                'id',
                'title',
                'content',
                'created_at',
                'updated_at',
                'tags'
            ]
        ]);
        // Verify it's the correct note
        $response->assertJson([
            'data' => [
                'id' => $note->id,
                'title' => $note->title,
                'content' => $note->content,
            ]
        ]);
    }

    /**
     * Test an authenticated user cannot view another user's note.
     */
    public function test_authenticated_user_cannot_view_another_user_note(): void
    {
        // Arrange: Create two users and a note for the second user
        $user = User::factory()->create();
        $otherUser = User::factory()->create();
        $learningTechnic = LearningTechnic::factory()->create();
        $otherUsersNote = Note::factory()->create([
            'user_id' => $otherUser->id,
            'learning_technic_id' => $learningTechnic->id,
        ]);

        // Act: Authenticate as the first user and try to request the second user's note
        Sanctum::actingAs($user);
        $response = $this->getJson("/api/notes/{$otherUsersNote->id}");

        // Assert: Check for forbidden status
        $response->assertStatus(403); // Or 404 if policy returns false before model binding
    }

    /**
     * Test authenticated user can update their note.
     */
    public function test_authenticated_user_can_update_note(): void
    {
        // Arrange: Create a user and their note
        $user = User::factory()->create();
        $learningTechnic = LearningTechnic::factory()->create();
        $note = Note::factory()->create([
            'user_id' => $user->id,
            'learning_technic_id' => $learningTechnic->id,
        ]);
        $updatedData = [
            'title' => 'Updated Note Title',
            'content' => 'Updated note content.',
            'learning_technic_id' => $learningTechnic->id, // Keep or update technic
            // Tags could be added here if updating tags is supported
        ];

        // Act: Authenticate and send PUT request
        Sanctum::actingAs($user);
        $response = $this->putJson("/api/notes/{$note->id}", $updatedData);

        // Assert: Check response and database
        $response->assertStatus(200); // Successful update often returns 200 OK
        $response->assertJsonFragment([
            'id' => $note->id,
            'title' => $updatedData['title'],
            'content' => $updatedData['content'],
        ]);
        $this->assertDatabaseHas('notes', [
            'id' => $note->id,
            'title' => $updatedData['title'],
            'content' => $updatedData['content'],
        ]);
    }

    /**
     * Test authenticated user cannot update another user's note.
     */
    public function test_authenticated_user_cannot_update_another_user_note(): void
    {
        // Arrange: Create two users and a note for the second user
        $user = User::factory()->create();
        $otherUser = User::factory()->create();
        $learningTechnic = LearningTechnic::factory()->create();
        $otherUsersNote = Note::factory()->create([
            'user_id' => $otherUser->id,
            'learning_technic_id' => $learningTechnic->id,
        ]);
        $updatedData = ['title' => 'Attempted Update Title'];

        // Act: Authenticate as the first user and try to update the second user's note
        Sanctum::actingAs($user);
        $response = $this->putJson("/api/notes/{$otherUsersNote->id}", $updatedData);

        // Assert: Check for forbidden status
        $response->assertStatus(403); // Or 404
    }

    /**
     * Test authenticated user can delete their note.
     */
    public function test_authenticated_user_can_delete_note(): void
    {
        // Arrange: Create a user and their note
        $user = User::factory()->create();
        $learningTechnic = LearningTechnic::factory()->create();
        $note = Note::factory()->create([
            'user_id' => $user->id,
            'learning_technic_id' => $learningTechnic->id,
        ]);
        $noteId = $note->id; // Store ID before deleting

        // Act: Authenticate and send DELETE request
        Sanctum::actingAs($user);
        $response = $this->deleteJson("/api/notes/{$noteId}");

        // Assert: Check response and database
        $response->assertStatus(204); // Successful deletion often returns 204 No Content
        $this->assertDatabaseMissing('notes', [
            'id' => $noteId,
        ]);
    }

    /**
     * Test authenticated user cannot delete another user's note.
     */
    public function test_authenticated_user_cannot_delete_another_user_note(): void
    {
        // Arrange: Create two users and a note for the second user
        $user = User::factory()->create();
        $otherUser = User::factory()->create();
        $learningTechnic = LearningTechnic::factory()->create();
        $otherUsersNote = Note::factory()->create([
            'user_id' => $otherUser->id,
            'learning_technic_id' => $learningTechnic->id,
        ]);

        // Act: Authenticate as the first user and try to delete the second user's note
        Sanctum::actingAs($user);
        $response = $this->deleteJson("/api/notes/{$otherUsersNote->id}");

        // Assert: Check for forbidden status and that the note still exists
        $response->assertStatus(403); // Or 404
        $this->assertDatabaseHas('notes', [
            'id' => $otherUsersNote->id,
        ]);
    }
}
