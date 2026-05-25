<?php

namespace App\Http\Controllers;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;


use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $validate = $request->validate([
            'email' => 'required|email|exists:users,email',
            'password' => 'required|string'
        ]);
        if (!Auth::attempt(['email' => $validate['email'], 'password' => $validate['password']])) {
            return response()->json([
                'success' => false,
                'message' => 'Email ou mot de passe incorrect.'
            ]);
        }
        $user = Auth::user();

        Log::info('User logged in', [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'ip' => $request->ip(),
            'at' => now()->toDateTimeString(),
        ]);
        $token = $user->createToken('auth_token')->plainTextToken;
        return response()->json([
            'success' => true,
            'message' => 'Connexion réussie.',
            'user' => $this->formatUser($user),
            'token' => $token,
        ]);

    }
    public function register(Request $request)
    {
        $request->validate([
            'name'             => 'required|string|max:255',
            'email'            => 'required|email|unique:users',
            'password'         => 'required|string|min:6',
        ]);

        $user = User::create([
            'name'             => $request->name,
            'email'            => $request->email,
            'password'         => $request->password,
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user'  => $user,
            'token' => $token,
        ], 201);
    }
    private function formatUser(User $user): array
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'whatsapp_number' => $user->whatsapp_number,
            'whatsapp_status' => $user->whatsapp_status,
            'created_at' => $user->created_at,
        ];
    }
}

