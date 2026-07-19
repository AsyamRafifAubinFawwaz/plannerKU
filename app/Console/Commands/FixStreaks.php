<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Habit;
use App\Services\HabitStreakService;

class FixStreaks extends Command
{
    protected $signature = 'fix:streaks';
    protected $description = 'Fix habit streaks recalculation';

    public function handle(HabitStreakService $service)
    {
        $habits = Habit::all();
        foreach ($habits as $habit) {
            $service->recalculate($habit);
        }
        $this->info('Fixed ' . $habits->count() . ' habits.');
    }
}
