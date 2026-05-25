<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('webscaner_chunks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('web_id')->constrained('webscaner')->cascadeOnDelete();
            $table->longText('text');
            $table->integer('chunk_index');
            $table->vector('embedding',1536);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('webscaner_chunks');
    }
};
