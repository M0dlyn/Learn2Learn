<?php

namespace Tests\Feature\Feature\Api;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use App\Models\LearningTechnic;
use Laravel\Sanctum\Sanctum;

class LearningTechnicTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test authenticated user can list learning technics.
     */
    public function test_authenticated_user_can_list_learning_technics(): void
    {
        // Arrange: Create user and technics
        $user = User::factory()->create();
        LearningTechnic::factory()->count(3)->create();

        // Act: Authenticate and make request
        Sanctum::actingAs($user);
        $response = $this->getJson('/api/learning-technics');

        // Assert: Check status, structure, and count
        $response->assertStatus(200);
        $response->assertJsonStructure([
            'data' => [
                '*' => ['id', 'name', 'short_desc', 'detailed_desc', 'created_at', 'updated_at']
            ],
            'links', // For pagination
            'meta'   // For pagination
        ]);
        $response->assertJsonCount(3, 'data');
    }

    /**
     * Test authenticated user can view a specific learning technic.
     */
    public function test_authenticated_user_can_view_learning_technic(): void
    {
        // Arrange: Create user and a technic
        $user = User::factory()->create();
        $technic = LearningTechnic::factory()->create([
            'name' => 'Test Technic Name',
            'short_desc' => 'Test Short Desc',
        ]);

        // Act: Authenticate and make request
        Sanctum::actingAs($user);
        $response = $this->getJson("/api/learning-technics/{$technic->id}");

        // Assert: Check status and data
        $response->assertStatus(200);
        $response->assertJson([
            'data' => [
                'id' => $technic->id,
                'name' => 'Test Technic Name',
                'short_desc' => 'Test Short Desc',
                // detailed_desc might also be asserted if needed
            ]
        ]);
    }

     /**
      * Test unauthenticated user cannot list learning technics.
      */
     public function test_unauthenticated_user_cannot_list_learning_technics(): void
     {
         LearningTechnic::factory()->count(1)->create();
         $response = $this->getJson('/api/learning-technics');
         $response->assertStatus(401); // Expect Unauthenticated
     }

      /**
       * Test unauthenticated user cannot view a specific learning technic.
       */
      public function test_unauthenticated_user_cannot_view_learning_technic(): void
      {
           $technic = LearningTechnic::factory()->create();
           $response = $this->getJson("/api/learning-technics/{$technic->id}");
           $response->assertStatus(401); // Expect Unauthenticated
      }
}
