<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();

            $table->string('title', 200);
            $table->enum('category', ['kuliah', 'harian', 'penting'])->default('harian');
            $table->date('due_date')->nullable();

            $table->boolean('is_done')->default(false);
            $table->timestamp('done_at')->nullable(); // diisi saat is_done = true

            $table->text('notes')->nullable();
            $table->timestamps();

            // Index untuk query dashboard (ambil tugas hari ini milik user)
            $table->index(['user_id', 'is_done']);
            $table->index(['user_id', 'due_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};