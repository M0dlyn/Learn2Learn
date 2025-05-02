<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class LearningTechnic extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'short_desc',
        'detailed_desc',
    ];

    /**
     * Get the notes for the learning technic.
     */
    public function notes(): HasMany
    {
        return $this->hasMany(Note::class);
    }
}
