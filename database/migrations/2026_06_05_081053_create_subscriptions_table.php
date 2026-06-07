<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('subscriptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();

            $table->enum('plan', ['pro', 'max']);

            $table->timestamp('started_at');
            $table->timestamp('expires_at');

            // Untuk sekarang pakai 'transfer_manual', nanti bisa tambah 'midtrans' dll
            $table->string('payment_method', 50)->default('transfer_manual');

            // Nominal yang dibayar (dalam rupiah), untuk riwayat
            $table->integer('amount')->default(0)->unsigned();

            $table->enum('status', ['active', 'expired', 'cancelled'])->default('active');

            // Catatan admin (bukti transfer, dll) — berguna saat masih manual
            $table->text('notes')->nullable();

            $table->timestamps();

            $table->index(['user_id', 'status']);
            $table->index(['user_id', 'expires_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('subscriptions');
    }
};