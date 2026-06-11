<?php
$user2 = App\Models\User::find(2);
if ($user2) {
    // 1. Perbaiki status Pro (plan_expires_at)
    $user2->plan_expires_at = now()->addMonth();
    $user2->save();
    
    // 2. Beri 1 tugas tertunda agar bot punya alasan mengirim pesan
    if ($user2->tasks()->count() == 0) {
        $user2->tasks()->create([
            'title' => 'Tugas Contoh untuk Testing WA',
            'category' => 'penting',
            'due_date' => today(),
            'is_done' => false
        ]);
    }
    
    echo "Berhasil memperbaiki User 2! Silakan jalankan command WA lagi.\n";
}
