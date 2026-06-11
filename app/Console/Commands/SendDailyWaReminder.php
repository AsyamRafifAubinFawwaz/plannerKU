<?php

namespace App\Console\Commands;

use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

use App\Models\User;
use App\Services\WaNotificationService;

#[Signature('wa:send-daily-reminder')]
#[Description('Kirim notifikasi WA harian berisi ringkasan tugas dan habit untuk user Pro')]
class SendDailyWaReminder extends Command
{
    /**
     * Execute the console command.
     */
    public function handle(WaNotificationService $waService)
    {
        $this->info('Mulai mengirim notifikasi harian...');
        
        $users = User::whereNotNull('wa_number')->get();
        $count = 0;

        foreach ($users as $user) {
            // Hanya user Pro yang dikirimi notifikasi
            if (!$user->isPro()) continue;

            $tasks = $user->tasks()
                ->where('is_done', false)
                ->whereNotNull('due_date')
            ->whereDate('due_date', '<=', today())
                ->get();
                
            $habits = $user->habits()
                ->where('is_active', true)
                ->get();

            // Jika tidak ada apa-apa, skip
            if ($tasks->isEmpty() && $habits->isEmpty()) continue;

            $message = "Halo *{$user->name}* 👋\nBerikut ringkasan PlannerKu kamu hari ini:\n\n";

            if ($tasks->isNotEmpty()) {
                $message .= "🎯 *Tugas Deadline/Tertunda:*\n";
                foreach ($tasks as $task) {
                    $message .= "- {$task->title}\n";
                }
                $message .= "\n";
            }

            if ($habits->isNotEmpty()) {
                $message .= "🔥 *Target Habit Aktif:*\n";
                foreach ($habits as $habit) {
                    $message .= "- {$habit->name}\n";
                }
                $message .= "\n";
            }

            $message .= "Jangan lupa selesaikan misimu hari ini ya! Semangat! 💪";

            // Kirim via Fonnte Service
            $success = $waService->send($user, $message);
            if ($success) $count++;
        }

        $this->info("Berhasil mengirim notifikasi WA ke {$count} user Pro.");
    }
}
