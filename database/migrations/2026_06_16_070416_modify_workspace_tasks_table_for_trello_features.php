<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('workspace_tasks', function (Blueprint $table) {
            $table->foreignId('column_id')->nullable()->after('workspace_id')->constrained('workspace_columns')->cascadeOnDelete();
            $table->integer('order')->default(0)->after('column_id');
            $table->dateTime('due_date')->nullable()->change();
            $table->text('description')->nullable()->after('title');
            $table->json('attachments')->nullable()->after('image_path');
            $table->json('labels')->nullable()->after('attachments');
        });

        // Seed data to migrate 'status' into 'workspace_columns'
        $workspaces = DB::table('workspaces')->get();
        foreach ($workspaces as $workspace) {
            $todoId = DB::table('workspace_columns')->insertGetId(['workspace_id' => $workspace->id, 'name' => 'To Do', 'order' => 1]);
            $doingId = DB::table('workspace_columns')->insertGetId(['workspace_id' => $workspace->id, 'name' => 'Doing', 'order' => 2]);
            $doneId = DB::table('workspace_columns')->insertGetId(['workspace_id' => $workspace->id, 'name' => 'Done', 'order' => 3]);

            DB::table('workspace_tasks')->where('workspace_id', $workspace->id)->where('status', 'todo')->update(['column_id' => $todoId]);
            DB::table('workspace_tasks')->where('workspace_id', $workspace->id)->where('status', 'doing')->update(['column_id' => $doingId]);
            DB::table('workspace_tasks')->where('workspace_id', $workspace->id)->where('status', 'done')->update(['column_id' => $doneId]);
        }

        $tasks = DB::table('workspace_tasks')->whereNotNull('assigned_to')->get();
        foreach ($tasks as $task) {
            DB::table('workspace_task_user')->insert([
                'workspace_task_id' => $task->id,
                'user_id' => $task->assigned_to,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        Schema::table('workspace_tasks', function (Blueprint $table) {
            $table->dropForeign(['assigned_to']);
            $table->dropColumn(['status', 'assigned_to']);
            $table->renameColumn('image_path', 'cover_image');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('workspace_tasks', function (Blueprint $table) {
            $table->string('status')->default('todo')->after('title');
            $table->foreignId('assigned_to')->nullable()->after('status')->constrained('users')->nullOnDelete();
            $table->renameColumn('cover_image', 'image_path');
        });

        $columns = DB::table('workspace_columns')->get();
        foreach ($columns as $column) {
            $status = strtolower(str_replace(' ', '', $column->name));
            if (!in_array($status, ['todo', 'doing', 'done'])) {
                $status = 'todo';
            }
            DB::table('workspace_tasks')->where('column_id', $column->id)->update(['status' => $status]);
        }

        $users = DB::table('workspace_task_user')->get();
        foreach ($users as $user) {
            DB::table('workspace_tasks')->where('id', $user->workspace_task_id)->update(['assigned_to' => $user->user_id]);
        }

        Schema::table('workspace_tasks', function (Blueprint $table) {
            $table->dropForeign(['column_id']);
            $table->dropColumn(['column_id', 'order', 'description', 'attachments', 'labels']);
            $table->date('due_date')->nullable()->change();
        });
    }
};
