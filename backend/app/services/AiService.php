<?php

namespace App\Services;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AiService
{
    /**
     * Create a new class instance.
     */
   public function generateHumanReply($message, array $context=[],array $webcontext=[]):string
{
    $systemPrompt = "You are a friendly customer support agent.";
    $knowledgeText = "";
    if (!empty($context)) {
        $contextText = implode("\n\n", $context);
        $systemPrompt .= "\n\nUse this knowledge to answer:\n\n" . $contextText;
    }
    if (!empty($webcontext)) {
        $knowledgeText .= "WEBSITE KNOWLEDGE:\n" . implode("\n\n", $webcontext) . "\n\n";
    }
    if ($knowledgeText) {
        $systemPrompt .= "\n\nUse this knowledge to answer:\n\n" . $knowledgeText;
    }
    try {
        $apiKey = env('OPENAI_API_KEY');

        $response = Http::withHeaders([
            'Authorization' => "Bearer {$apiKey}",
            'Content-Type' => 'application/json',
        ])->timeout(20)->post('https://api.openai.com/v1/chat/completions', [
            "model" => "gpt-4o-mini",
            "messages" => array_merge([
                [
                    "role" => "system",
                    "content" => $systemPrompt
                ],
                [
                    "role" => "user",
                    "content" => $message
                ]
            ])
        ]);
        Log::info("OpenAI response", [
            "status" => $response->status(),
            "body"   => $response->body(),
        ]);

        if ($response->failed()) {
            Log::error("OpenAI failed", [
                "body" => $response->body()
            ]);

            return "Sorry, AI is unavailable right now.";
        }

        $reply=$reply = $response->json()['choices'][0]['message']['content'] ?? "Sorry, I didn't get that.";
        return $reply;

    } catch (\Exception $e) {
        Log::error("AI exception", [
            "error" => $e->getMessage()
        ]);

        return "AI error occurred.";
    }
}
public function generatePersonalizedMessage(string $name, string $topic): string
{
    $response = Http::withHeaders([
        'Authorization' => "Bearer " . env('OPENAI_API_KEY'),
        'Content-Type'  => 'application/json',
    ])->timeout(20)->post('https://api.openai.com/v1/chat/completions', [
        'model' => 'gpt-4o-mini',
        'messages' => [
            [
                'role'    => 'system',
                'content' => 'You are a professional business messaging assistant. Write short, personalized WhatsApp messages. Max 3 sentences. No emojis unless appropriate. Sound human and professional.',
            ],
            [
                'role'    => 'user',
                'content' => "Write a personalized WhatsApp message to {$name} about: {$topic}",
            ],
        ],
    ]);

    if ($response->failed()) {
        return "Hello {$name}, we wanted to reach out regarding {$topic}. Please contact us for more details.";
    }

    return $response->json()['choices'][0]['message']['content'] ?? "Hello {$name}.";
}
}
