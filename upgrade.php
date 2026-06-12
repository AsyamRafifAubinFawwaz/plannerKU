<?php
\App\Models\User::query()->update(['plan' => 'max', 'plan_expires_at' => now()->addMonths(12)]);
echo "All users upgraded to Max.\n";
