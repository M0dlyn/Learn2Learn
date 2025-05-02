<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use App\Models\User;

class Note extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'title',
        'content',
        'user_id',
        'learning_technic_id',
    ];

    /**
     * Get the user that owns the note.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Get the learning technic that the note uses.
     */
    public function learningTechnic(): BelongsTo
    {
        return $this->belongsTo(LearningTechnic::class);
    }

    /**
     * Get the tags for the note.
     */
    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class, 'tag_notes');
    }
}
