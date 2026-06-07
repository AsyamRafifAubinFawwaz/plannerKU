<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('habits', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();

            $table->string('name', 100);
            $table->string('icon', 50)->default('ti-star'); // Tabler icon key

            // Target berapa hari per minggu (1–7), default setiap hari
            $table->tinyInteger('target_per_week')->default(7)->unsigned();

            // Streak dihitung & diupdate tiap kali user centang/uncentang
            $table->integer('current_streak')->default(0)->unsigned();
            $table->integer('longest_streak')->default(0)->unsigned();

            // Soft delete dengan flag (biar data log tetap ada)
            $table->boolean('is_active')->default(true);

            $table->integer('sort_order')->default(0); // urutan tampil di UI
            $table->timestamps();

            $table->index(['user_id', 'is_active']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('habits');
    }
};