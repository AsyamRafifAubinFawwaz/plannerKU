<?php
$user2 = App\Models\User::find(2);
if ($user2) {
    App\Models\Habit::create([
        'user_id' => $user2->id,
        'name' => 'Habit Test WA',
        'icon' => 'FaFire',
        'target_per_week' => 7,
        'is_active' => true,
    ]);
    echo "Habit created for User 2.\n";
}
