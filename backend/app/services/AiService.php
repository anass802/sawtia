<?php

namespace App\Services;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AiService
{
    /**
     * Create a new class instance.
     */
       public function generateHumanReply($message){
    $apiKey = env('OPENROUTER_API_KEY');

    $response = Http::withHeaders([
        'Authorization' => "Bearer {$apiKey}",
        'HTTP-Referer' => 'http://localhost',
        'X-Title' => 'Helpdesk App'
    ])->post('https://openrouter.ai/api/v1/chat/completions', [
        "model" => "openai/gpt-3.5-turbo",
        "messages" => array_merge([
    [
        "role" => "system",
        "content" => "You are a friendly human customer support agent..."
    ]
], [
    [
        "role" => "user",
        "content" => $message
    ]
])
    ]);

    $reply = $response->json()['choices'][0]['message']['content']
        ?? "Sorry, I didn’t get that.";

    Log::info('ConversationAI reply', [
        'reply' => $reply
    ]);

    return $reply;
}
}
