<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('habit_logs', function (Blueprint $table) {
            $table->string('photo_path')->nullable()->after('logged_date');
            $table->string('caption')->nullable()->after('photo_path');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('habit_logs', function (Blueprint $table) {
            $table->dropColumn(['photo_path', 'caption']);
        });
    }
};
