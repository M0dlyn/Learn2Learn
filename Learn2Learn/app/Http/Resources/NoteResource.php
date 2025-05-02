<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
// If you create TagResource later, you can use it here:
// use App\Http\Resources\TagResource;

class NoteResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'content' => $this->content,
            'user_id' => $this->user_id,
            'learning_technic_id' => $this->learning_technic_id,
            'created_at' => $this->created_at?->toIso8601String(), // Use null safe operator
            'updated_at' => $this->updated_at?->toIso8601String(), // Use null safe operator
            // Conditionally load tags if the relationship is eager loaded
            'tags' => $this->whenLoaded('tags', function () {
                // Option 1: Return collection of tag IDs
                return $this->tags->pluck('id');
                // Option 2: If TagResource exists, return collection of TagResource
                // return TagResource::collection($this->tags);
            }),
            // Optionally load learning technic if needed
            // 'learning_technic' => new LearningTechnicResource($this->whenLoaded('learningTechnic')),
        ];
    }
}
