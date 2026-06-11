<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class WaNotificationService
{
    public function send(User $user, string $message): bool
    {
        // 1. Cek apakah user punya nomor WA dan fitur Pro
        if (!$user->wa_number || !$user->isPro()) {
            return false;
        }

        try {
            $response = Http::withHeaders([
                'Authorization' => env('FONNTE_TOKEN')
            ])->post('https://api.fonnte.com/send', [
                'target' => $user->wa_number,
                'message' => $message,
            ]);

            return $response->successful();
        } catch (\Exception $e) {
            Log::error("Gagal mengirim WA ke {$user->wa_number}: " . $e->getMessage());
            return false;
        }
    }
}
