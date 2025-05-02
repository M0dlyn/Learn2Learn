<?php

namespace Tests\Feature\Api;

use App\Models\Note;
use App\Models\Tag;
use App\Models\User;
use App\Models\LearningTechnic;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class TagTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test listing all tags.
     */
    public function test_authenticated_user_can_list_tags(): void
    {
        // Arrange: Create a user and some tags
        $user = User::factory()->create();
        $tags = Tag::factory()->count(3)->create();

        // Act: Authenticate and make the request
        Sanctum::actingAs($user);
        $response = $this->getJson('/api/tags');

        // Assert: Check the response status and structure
        $response->assertStatus(200);
        $response->assertJsonCount(3, 'data');

        // Check structure
        $response->assertJsonStructure([
            'data' => [
                '*' => [
                    'id',
                    'name',
                    'created_at',
                    'updated_at',
                ]
            ],
            'links',
            'meta',
        ]);

        // Verify the returned tags match what we created
        $returnedTagIds = collect($response->json('data'))->pluck('id');
        $tags->each(function ($tag) use ($returnedTagIds) {
            expect($returnedTagIds)->toContain($tag->id);
        });
    }

    /**
     * Test creating a new tag.
     */
    public function test_authenticated_user_can_create_tag(): void
    {
        // Arrange: Create a user
        $user = User::factory()->create();
        $tagData = [
            'name' => 'New Test Tag',
        ];

        // Act: Authenticate and send POST request
        Sanctum::actingAs($user);
        $response = $this->postJson('/api/tags', $tagData);

        // Assert: Check response and database
        $response->assertStatus(201);
        $response->assertJsonFragment([
            'name' => $tagData['name'],
        ]);

        $this->assertDatabaseHas('tags', [
            'name' => $tagData['name'],
        ]);

        $response->assertJsonStructure([
            'data' => [
                'id',
                'name',
                'created_at',
                'updated_at',
            ]
        ]);
    }

    /**
     * Test viewing a specific tag.
     */
    public function test_authenticated_user_can_view_tag(): void
    {
        // Arrange: Create a user and a tag
        $user = User::factory()->create();
        $tag = Tag::factory()->create();

        // Act: Authenticate and request the tag
        Sanctum::actingAs($user);
        $response = $this->getJson("/api/tags/{$tag->id}");

        // Assert: Check response
        $response->assertStatus(200);
        $response->assertJsonStructure([
            'data' => [
                'id',
                'name',
                'created_at',
                'updated_at',
            ]
        ]);
        
        $response->assertJsonFragment([
            'id' => $tag->id,
            'name' => $tag->name,
        ]);
    }

    /**
     * Test updating a tag.
     */
    public function test_authenticated_user_can_update_tag(): void
    {
        // Arrange: Create a user and a tag
        $user = User::factory()->create();
        $tag = Tag::factory()->create();
        $updatedData = [
            'name' => 'Updated Tag Name',
        ];

        // Act: Authenticate and send PUT request
        Sanctum::actingAs($user);
        $response = $this->putJson("/api/tags/{$tag->id}", $updatedData);

        // Assert: Check response and database
        $response->assertStatus(200);
        $response->assertJsonFragment([
            'id' => $tag->id,
            'name' => $updatedData['name'],
        ]);
        
        $this->assertDatabaseHas('tags', [
            'id' => $tag->id,
            'name' => $updatedData['name'],
        ]);
    }

    /**
     * Test deleting a tag.
     */
    public function test_authenticated_user_can_delete_tag(): void
    {
        // Arrange: Create a user and a tag
        $user = User::factory()->create();
        $tag = Tag::factory()->create();
        $tagId = $tag->id;

        // Act: Authenticate and send DELETE request
        Sanctum::actingAs($user);
        $response = $this->deleteJson("/api/tags/{$tagId}");

        // Assert: Check response and database
        $response->assertStatus(204);
        $this->assertDatabaseMissing('tags', [
            'id' => $tagId,
        ]);
    }

    /**
     * Test that tag name must be unique when creating.
     */
    public function test_tag_name_must_be_unique_when_creating(): void
    {
        // Arrange: Create a user and a tag
        $user = User::factory()->create();
        $existingTag = Tag::factory()->create(['name' => 'Existing Tag']);
        $tagData = [
            'name' => 'Existing Tag', // Same name as existing tag
        ];

        // Act: Authenticate and try to create a tag with the same name
        Sanctum::actingAs($user);
        $response = $this->postJson('/api/tags', $tagData);

        // Assert: Check response
        $response->assertStatus(422); // Unprocessable Entity for validation error
        $response->assertJsonValidationErrors(['name']);
    }

    /**
     * Test tag name must be unique when updating.
     */
    public function test_tag_name_must_be_unique_when_updating(): void
    {
        // Arrange: Create a user and two tags
        $user = User::factory()->create();
        $existingTag = Tag::factory()->create(['name' => 'Existing Tag']);
        $tagToUpdate = Tag::factory()->create(['name' => 'Tag To Update']);
        $updateData = [
            'name' => 'Existing Tag', // Same name as existing tag
        ];

        // Act: Authenticate and try to update with an existing name
        Sanctum::actingAs($user);
        $response = $this->putJson("/api/tags/{$tagToUpdate->id}", $updateData);

        // Assert: Check response
        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['name']);
    }

    /**
     * Test popular tags endpoint.
     */
    public function test_can_get_popular_tags(): void
    {
        // Arrange: Create a user, tags, and notes with those tags
        $user = User::factory()->create();
        $learningTechnic = LearningTechnic::factory()->create();
        
        // Create tags with varied popularity
        $tag1 = Tag::factory()->create(['name' => 'Popular Tag']);
        $tag2 = Tag::factory()->create(['name' => 'Medium Tag']);
        $tag3 = Tag::factory()->create(['name' => 'Rare Tag']);
        
        // Create notes and associate them with tags
        $note1 = Note::factory()->create([
            'user_id' => $user->id,
            'learning_technic_id' => $learningTechnic->id,
        ]);
        $note2 = Note::factory()->create([
            'user_id' => $user->id,
            'learning_technic_id' => $learningTechnic->id,
        ]);
        $note3 = Note::factory()->create([
            'user_id' => $user->id,
            'learning_technic_id' => $learningTechnic->id,
        ]);
        
        // Associate tags with notes to create different popularity levels
        $note1->tags()->attach([$tag1->id, $tag2->id]);
        $note2->tags()->attach([$tag1->id]);
        $note3->tags()->attach([$tag1->id]);
        // Tag1 has 3 notes, Tag2 has 1 note, Tag3 has 0 notes
        
        // Act: Authenticate and get popular tags
        Sanctum::actingAs($user);
        $response = $this->getJson('/api/tags/popular');
        
        // Assert: Check response
        $response->assertStatus(200);
        $response->assertJsonStructure([
            'data' => [
                '*' => [
                    'id',
                    'name',
                    'created_at',
                    'updated_at',
                    'notes_count',
                ]
            ],
        ]);
        
        // Verify the first tag is the most popular one (Tag1)
        $firstTag = $response->json('data.0');
        $this->assertEquals($tag1->id, $firstTag['id']);
        $this->assertEquals(3, $firstTag['notes_count']);
    }

    /**
     * Test unused tags endpoint.
     */
    public function test_can_get_unused_tags(): void
    {
        // Arrange: Create a user, tags, and notes
        $user = User::factory()->create();
        $learningTechnic = LearningTechnic::factory()->create();
        
        // Create tags
        $usedTag = Tag::factory()->create(['name' => 'Used Tag']);
        $unusedTag = Tag::factory()->create(['name' => 'Unused Tag']);
        
        // Create a note and associate with only the used tag
        $note = Note::factory()->create([
            'user_id' => $user->id,
            'learning_technic_id' => $learningTechnic->id,
        ]);
        $note->tags()->attach($usedTag->id);
        
        // Act: Authenticate and get unused tags
        Sanctum::actingAs($user);
        $response = $this->getJson('/api/tags/unused');
        
        // Assert: Check response
        $response->assertStatus(200);
        $response->assertJsonStructure([
            'data' => [
                '*' => [
                    'id',
                    'name',
                    'created_at',
                    'updated_at',
                ]
            ],
        ]);
        
        // Get the returned tag IDs
        $returnedTagIds = collect($response->json('data'))->pluck('id');
        
        // Verify only unused tag is returned
        $this->assertCount(1, $returnedTagIds);
        $this->assertTrue($returnedTagIds->contains($unusedTag->id));
        $this->assertFalse($returnedTagIds->contains($usedTag->id));
    }
    
    /**
     * Test deleting a tag with notes detaches relationships.
     */
    public function test_deleting_tag_detaches_notes_relationships(): void
    {
        // Arrange: Create a user, a tag, and notes
        $user = User::factory()->create();
        $learningTechnic = LearningTechnic::factory()->create();
        $tag = Tag::factory()->create();
        
        // Create notes and associate with the tag
        $note1 = Note::factory()->create([
            'user_id' => $user->id,
            'learning_technic_id' => $learningTechnic->id,
        ]);
        $note2 = Note::factory()->create([
            'user_id' => $user->id,
            'learning_technic_id' => $learningTechnic->id,
        ]);
        
        $note1->tags()->attach($tag->id);
        $note2->tags()->attach($tag->id);
        
        // Verify pivot table has entries
        $this->assertDatabaseHas('tag_notes', [
            'tag_id' => $tag->id,
            'note_id' => $note1->id,
        ]);
        $this->assertDatabaseHas('tag_notes', [
            'tag_id' => $tag->id,
            'note_id' => $note2->id,
        ]);
        
        // Act: Authenticate and delete the tag
        Sanctum::actingAs($user);
        $response = $this->deleteJson("/api/tags/{$tag->id}");
        
        // Assert: Check response and database
        $response->assertStatus(204);
        
        // Tag should be deleted
        $this->assertDatabaseMissing('tags', [
            'id' => $tag->id,
        ]);
        
        // Relationships should be detached
        $this->assertDatabaseMissing('tag_notes', [
            'tag_id' => $tag->id,
        ]);
        
        // But notes should still exist
        $this->assertDatabaseHas('notes', [
            'id' => $note1->id,
        ]);
        $this->assertDatabaseHas('notes', [
            'id' => $note2->id,
        ]);
    }
}