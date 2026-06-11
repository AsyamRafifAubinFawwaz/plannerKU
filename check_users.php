<?php
$users = App\Models\User::all();
foreach ($users as $u) {
    echo "ID: {$u->id} | Email: {$u->email} | WA: {$u->wa_number} | Plan: {$u->plan} | isPro: " . ($u->isPro() ? 'Ya' : 'Tidak') . "\n";
    echo "   - Tugas Tertunda: " . $u->tasks()->where('is_done', false)->whereNotNull('due_date')->whereDate('due_date', '<=', today())->count() . "\n";
    echo "   - Habit Aktif: " . $u->habits()->where('is_active', true)->count() . "\n\n";
}
