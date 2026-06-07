<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    // di method up()
    public function up(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            $table->json('attachments')->nullable()->after('notes');
        });
    }

    // di method down()
    public function down(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            $table->dropColumn('attachments');
        });
    }
};
