<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WebscanerMetadata extends Model
{
    protected $table = 'webscaner_metadata';

    protected $fillable = [
        'web_id',
        'meta',
        'contacts',
        'links',
        'images',
        'products',
    ];

    protected $casts = [
        'meta' => 'array',
        'contacts' => 'array',
        'links' => 'array',
        'images' => 'array',
        'products' => 'array',
    ];
}