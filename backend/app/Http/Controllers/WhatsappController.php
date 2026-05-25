<?php

namespace App\Http\Controllers;
use App\Models\User;
use App\Services\EmbeddingService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use App\Services\AiService;
class WhatsappController extends Controller
{
    private $nodeUrl = 'http://node_whatsapp:3001';

    public function connect(Request $request){
        $userId=auth()->id();
        $response=Http::post($this->nodeUrl.'/connect',[
           'userId'=>$userId
        ]);
        return $response->json();
    }
    public function status($userId){
        $response=Http::get($this->nodeUrl.'/status/'. $userId);
        return $response->json();
    }
    public function disconnect(Request $request){
        $response=Http::post($this->nodeUrl.'/disconnect',[
            'userId'=>auth()->id()
        ]);
         return $response->json();
    }

    public function webhook(Request $request, AiService $aiService,EmbeddingService $embeddingService){
        
            \Log::info("RAW PAYLOAD", ['body' => $request->getContent()]);
            \Log::info("PARSED EVENT", ['event' => $request->input('event')]);
            \Log::info("PARSED DATA", ['data' => $request->input('data')]);

            $secret = $request->header('X-Webhook-Secret');
            if ($secret !== env('WEBHOOK_SECRET')) {
                return response()->json(['error' => 'Unauthorized'], 401);
            }
        
            $event = $request->event;
            $data  = $request->data;
        if($event==='qr_ready'){
            $user=User::find($data['user_id']);
            if($user){
                $user->update([
                    'whatsapp_status'=>'qr_ready'
                ]);
            }
        }
        if ($event == 'message_received') {
            \Log::info("ENTERING MESSAGE HANDLER");

            try {
                $message = $data['text'] ?? null;
                $userId  = $data['user_id'];
                \Log::info("MESSAGE TEXT", ['message' => $message]);

                if (!$message) {
                    \Log::error("NO TEXT IN DATA", $data);
                    return response()->json(['success' => true]);
                }
                $embedding = $embeddingService->embed($message);
                $context = $embeddingService->searchSimilarChunks($embedding, $userId);
                $webcontext=$embeddingService->searchWebsiteChunks($embedding, $userId);
                \Log::info("CONTEXT FOUND", ['chunks' => count($context)]);

                $reply = $aiService->generateHumanReply($message, $context, $webcontext);
                \Log::info("AI REPLIED", ['reply' => $reply]);

                $sendResponse = Http::timeout(10)->post($this->nodeUrl.'/send', [
                    'userId'  => $data['user_id'],
                    'to'      => $data['senderPhone'],
                    'message' => $reply
                ]);

                \Log::info("SEND RESPONSE", [
                    'status' => $sendResponse->status(),
                    'body'   => $sendResponse->body(),
                ]);

            } catch (\Exception $e) {
                \Log::error("Webhook failed", [
                    "error" => $e->getMessage(),
                    "line"  => $e->getLine(),
                    "file"  => $e->getFile(),
                ]);
            }   
        }
        if($event==='connected'){
            $user=User::find($data['user_id']);
            $user->update([
                'whatsapp_status'=>'connected',
                'whatsapp_number'=>$data['phone']
            ]);
        }
        if($event === 'disconnected'){
        User::where('id', $data['user_id'])->update([
            'whatsapp_status' => 'disconnected',
            'whatsapp_number' => null,
        ]);
        }

        return response()->json([
            'success' => true
        ]);

    }
    public function qr($userId){
        $response=Http::get($this->nodeUrl . '/qr/' .$userId);
        if ($response->failed()) {
        return response()->json([
            'error' => 'Failed to fetch QR'
        ], $response->status());
    }

        return $response->json();
    }

}
