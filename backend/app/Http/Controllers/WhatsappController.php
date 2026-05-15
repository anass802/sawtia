<?php

namespace App\Http\Controllers;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Services\AiService;
class WhatsappController extends Controller
{
    private $nodeUrl = 'http://localhost:3001';

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
    public function webhook(Request $request, AiService $aiService){
        $secret=$request->header('X-Webhook-Secret');
        if($secret!==env('WEBHOOK_SECRET')){
            return response()->json([
                'error'=>'Unauthorized'
            ],401);
        }
        $event=$request->event;
        $data=$request->data;
        if($event==='qr_ready'){
            $user=User::find($data['user_id']);
            if($user){
                $user->update([
                    'whatsapp_status'=>'qr_ready'
                ]);
            }
        }
        if($event=='message_received'){
            $message=$data['text'];
            $reply=$aiService->generateHumanReply($message);
            Http::post($this->nodeUrl.'/send',[
                'userId'=>$data['user_id'],
                'to'=>$data['senderPhone'],
                'message'=>$reply
            ]);
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
