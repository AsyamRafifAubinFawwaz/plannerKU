
Schema::table('workspace_tasks', function (Illuminate\Database\Schema\Blueprint $table) {
    if (Schema::hasColumn('workspace_tasks', 'column_id')) {
        $table->dropForeign(['column_id']);
        $table->dropColumn('column_id');
    }
    if (Schema::hasColumn('workspace_tasks', 'order')) {
        $table->dropColumn('order');
    }
    if (Schema::hasColumn('workspace_tasks', 'description')) {
        $table->dropColumn('description');
    }
    if (Schema::hasColumn('workspace_tasks', 'attachments')) {
        $table->dropColumn('attachments');
    }
    if (Schema::hasColumn('workspace_tasks', 'labels')) {
        $table->dropColumn('labels');
    }
});
