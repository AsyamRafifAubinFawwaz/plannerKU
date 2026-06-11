<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('events', function (Blueprint $table) {
            // Menandai event sebagai "sudah selesai" tanpa menghapusnya dari kalender.
            // Contoh: "Kumpul laporan PKL" — setelah dikumpul, tinggal toggle selesai.
            $table->boolean('is_done')->default(false)->after('color');

            // Pastikan kolom ini ada (jika belum ada dari migration awal)
            if (! Schema::hasColumn('events', 'start_date')) {
                $table->date('start_date')->nullable()->change();
            }
        });
    }

    public function down(): void
    {
        Schema::table('events', function (Blueprint $table) {
            $table->dropColumn('is_done');
        });
    }
};
