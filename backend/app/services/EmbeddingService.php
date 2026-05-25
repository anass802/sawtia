<?php
namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class EmbeddingService
{
    public function embed(string $text): array
    {
        $apiKey = env('OPENAI_API_KEY');
        $response = Http::withHeaders([
            'Authorization' => "Bearer {$apiKey}",
            'Content-Type'  => 'application/json',
        ])->post('https://api.openai.com/v1/embeddings', [
            'model' => 'text-embedding-3-small',
            'input' => $text,
        ]);
        if ($response->failed()) {
            Log::error('Embedding failed', ['body' => $response->body()]);
            return [];
        }

        return $response->json()['data'][0]['embedding'];
    }
    public function searchSimilarChunks(array $embedding, string $userId, int $limit = 3): array
{
    $vector = '[' . implode(',', $embedding) . ']';

    $chunks = \App\Models\Chunk::selectRaw("content, 1 - (embedding <=> ?::vector) as similarity", [$vector])
        ->whereHas('document', function ($query) use ($userId) {
            $query->where('user_id', $userId);
        })
        ->orderByRaw("embedding <=> ?::vector", [$vector])
        ->limit($limit)
        ->get();

    return $chunks->pluck('content')->toArray();
}
public function searchWebsiteChunks(array $embedding, string $userId, int $limit = 3): array
    {
        $vector = '[' . implode(',', $embedding) . ']';

        $chunks = \App\Models\WebscanerChunk::selectRaw(
            "text, 1 - (embedding <=> ?::vector) as similarity",
            [$vector]
        )
        ->whereHas('website', function ($query) use ($userId) {
            $query->where('user_id', $userId);
        })
        ->orderByRaw("embedding <=> ?::vector", [$vector])
        ->limit($limit)
        ->get();

        return $chunks->pluck('text')->toArray();
    }

}