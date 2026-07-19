<?php

namespace App\Services;

use App\Models\Habit;
use Carbon\Carbon;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class HabitStreakService
{
    public function recalculate(Habit $habit) 
    {
        $logs = $habit->logs()->orderBy('logged_date', 'desc')->pluck('logged_date')->map(fn ($date) => Carbon::parse($date)->startOfDay());

       if($logs->isEmpty()){
        $habit->update(['current_streak' => 0, 'longest_streak'=> 0]);
        return;
       }

       $currentStreak = 0;
       $longestStreak = $habit->longest_streak;

       $today = Carbon::today();
       $latestLog = $logs->first();

       if(abs($latestLog->diffInDays($today)) > 1 ){
        $currentStreak = 0;
       } else {
        $currentStreak = 1;
        for($i = 0; $i < $logs->count() - 1; $i++){
            $selisihHari = abs($logs[$i]->diffInDays($logs[$i+1]));
            if($selisihHari  === 1){
                $currentStreak++;
            }elseif ($selisihHari === 0){
                continue;
            }else {
                break;
            }
        }
       }
        if($currentStreak > $longestStreak){
            $longestStreak = $currentStreak;
        }

        $habit->update([
            'current_streak' => $currentStreak,
            'longest_streak' => $longestStreak,
        ]);
    }

}
