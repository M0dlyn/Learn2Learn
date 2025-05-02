<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LearningTechnicResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // If the resource is null (e.g., not found), return an empty array or handle as needed
        if (is_null($this->resource)) {
            return [];
        }

        return [
            'id' => $this->id,
            'name' => $this->name,
            'short_desc' => $this->short_desc,
            'detailed_desc' => $this->detailed_desc,
            'created_at' => $this->created_at?->toIso8601String(), 
            'updated_at' => $this->updated_at?->toIso8601String(), 
        ];
    }
}
