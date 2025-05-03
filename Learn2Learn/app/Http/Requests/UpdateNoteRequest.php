<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateNoteRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Authorization handled by NotePolicy
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'content' => ['sometimes', 'required', 'string'],
            'learning_technic_id' => [
                'sometimes',
                'nullable',
                'integer',
                Rule::exists('learning_technics', 'id') // Assuming 'learning_technics' table exists
            ],
            'tags' => ['sometimes', 'array'], // Optional: tags can be provided or updated
            'tags.*' => ['integer', Rule::exists('tags', 'id')] // Each tag ID must exist in 'tags' table
        ];
    }
}
