<?php
namespace App\Http\Controllers;

use App\Services\AiService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class BroadcastController extends Controller
{
    private $nodeUrl = 'http://localhost:3001';

    public function send(Request $request, AiService $aiService)
    {
        $request->validate([
            'file'  => 'required|file|mimes:csv,txt',
            'topic' => 'required|string|max:500',
        ]);

        $userId = Auth::id();
        $topic  = $request->input('topic');

        // Parse CSV
        $file     = $request->file('file');
        $contacts = array_map('str_getcsv', file($file->getRealPath()));

        $results = [];

        foreach ($contacts as $row) {
            // CSV format: phone, name
            $phone = trim($row[0] ?? '');
            $name  = trim($row[1] ?? 'Customer');

            if (empty($phone)) continue;

            // Format phone for WhatsApp
            $jid = str_replace(['+', ' ', '-'], '', $phone) . '@s.whatsapp.net';

            // AI generates personalized message
            $message = $aiService->generatePersonalizedMessage($name, $topic);

            // Send via WhatsApp
            $response = Http::timeout(10)->post($this->nodeUrl . '/send', [
                'userId'  => $userId,
                'to'      => $jid,
                'message' => $message,
            ]);

            $results[] = [
                'phone'   => $phone,
                'name'    => $name,
                'message' => $message,
                'sent'    => $response->successful(),
            ];

            // Small delay to avoid WhatsApp spam detection
            usleep(500000); // 0.5 seconds
        }

        return response()->json([
            'total' => count($results),
            'sent'  => count(array_filter($results, fn($r) => $r['sent'])),
            'results' => $results,
        ]);
    }
}