<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->string('email', 150)->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password')->nullable(); // nullable karena bisa login pakai passkey

            // Kolom wajib Fortify TwoFactorAuthenticatable
            $table->text('two_factor_secret')->nullable();
            $table->text('two_factor_recovery_codes')->nullable();
            $table->timestamp('two_factor_confirmed_at')->nullable();

            // Kolom wajib Fortify PasskeyAuthenticatable
            $table->string('passkey_user_id', 255)->nullable()->unique();

            // ── PlannerKu ──────────────────────────
            $table->enum('plan', ['free', 'pro', 'max'])->default('free');
            $table->timestamp('plan_expires_at')->nullable(); // null = free selamanya
            $table->string('wa_number', 20)->nullable();      // untuk notif WA (fitur Pro)
            // ──────────────────────────────────────

            $table->rememberToken();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};