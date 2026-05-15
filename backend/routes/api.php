<?php
use App\Http\Controllers\WhatsappController;
use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;


Route::post('/whatsapp/webhook', [WhatsappController::class,'webhook']);
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/whatsapp/connect', [WhatsappController::class, 'connect']);
    Route::get('/whatsapp/qr/{userId}', [WhatsappController::class, 'qr']);
    Route::get('/whatsapp/status/{userId}', [WhatsappController::class, 'status']);
    Route::post('/whatsapp/disconnect', [WhatsappController::class, 'disconnect']);
});
Route::post('/auth/login',[AuthController::class,'login']);


