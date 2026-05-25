<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WebscanerChunk extends Model
{
    protected $table = 'webscaner_chunks';

    protected $fillable = [
        'web_id',
        'text',
        'chunk_index',
        'embedding',
    ];

    protected $casts = [
        'embedding' => 'array',
    ];
    public function website()
{
    return $this->belongsTo(Webscaner::class, 'web_id');
}
}