<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('habit_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('habit_id')->constrained()->cascadeOnDelete();

            // user_id disimpan redundan di sini supaya query statistik
            // per-user tidak perlu JOIN ke tabel habits setiap saat
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();

            $table->date('logged_date');
            $table->timestamps();

            // Satu habit hanya boleh dicentang sekali per hari
            $table->unique(['habit_id', 'logged_date']);

            // Index untuk query "semua log user minggu ini"
            $table->index(['user_id', 'logged_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('habit_logs');
    }
};