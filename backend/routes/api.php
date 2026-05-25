<?php
use App\Http\Controllers\WhatsappController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\BroadcastController;
use App\Http\Controllers\WebScraperController;
use Illuminate\Support\Facades\Route;


Route::post('/whatsapp/webhook', [WhatsappController::class,'webhook']);
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/whatsapp/connect', [WhatsappController::class, 'connect']);
    Route::get('/whatsapp/qr/{userId}', [WhatsappController::class, 'qr']);
    Route::get('/whatsapp/status/{userId}', [WhatsappController::class, 'status']);
    Route::post('/whatsapp/disconnect', [WhatsappController::class, 'disconnect']);
    Route::post('/documents/upload',[DocumentController::class, 'upload']);
    Route::get('/documents/knowledge',[DocumentController::class,'loadDocs']);
    Route::post('/broadcast', [BroadcastController::class, 'send']);
    Route::post('/scrape', [WebScraperController::class, 'scrape']);

});
Route::post('/auth/login',[AuthController::class,'login']);
Route::post('/auth/register', [AuthController::class, 'register']);



