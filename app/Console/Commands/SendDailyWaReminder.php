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
            if (!$user->isPro()) continue;

            $tasks = $user->tasks()
                ->where('is_done', false)
                ->whereNotNull('due_date')
            ->whereDate('due_date', '<=', today())
                ->get();
                
            $habits = $user->habits()
                ->where('is_active', true)
                ->get();

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

            $motivations = [
                "Jangan lupa selesaikan misimu hari ini ya! Semangat! 💪",
                "Langkah kecil setiap hari membuat perbedaan besar. Ayo beraksi! 🔥",
                "Fokus pada prosesnya, bukan hanya hasilnya. Kamu pasti bisa! 🚀",
                "Setiap tugas yang dicentang adalah satu langkah lebih dekat ke mimpimu. ✨",
                "Jangan tunggu motivasi datang, mulailah dan motivasi akan mengikuti! 🏃‍♂️",
                "Beri dirimu apresiasi atas setiap progres hari ini. Keep going! 🌟",
                "Waktunya bersinar! Selesaikan misimu hari ini dengan senyuman. 😊"
            ];
            
            $randomMotivation = $motivations[array_rand($motivations)];
            $message .= $randomMotivation;

            $success = $waService->send($user, $message);
            if ($success) $count++;
        }

        $this->info("Berhasil mengirim notifikasi WA ke {$count} user Pro.");
    }
}
