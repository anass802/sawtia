<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Webscaner extends Model
{
    protected $table = 'webscaner';

    protected $fillable = [
        'user_id',
        'url',
        'title',
        'description',
        'language',
        'last_scraped_at',
    ];
    public function chunks()
{
    return $this->hasMany(WebscanerChunk::class, 'web_id');
}
}