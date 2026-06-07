<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();

            $table->string('title', 200);

            // end_date nullable — kalau null berarti event satu hari saja
            $table->date('start_date');
            $table->date('end_date')->nullable();

            // Warna label di kalender (pilihan user), hex 6 digit
            $table->string('color', 7)->default('#185FA5');

            $table->text('notes')->nullable();
            $table->timestamps();

            // Index untuk query kalender bulan/minggu tertentu
            $table->index(['user_id', 'start_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};