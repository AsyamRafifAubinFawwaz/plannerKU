<?php

use App\Http\Controllers\EventController;
use App\Http\Controllers\HabitController;
use App\Http\Controllers\HabitLogsController;
use App\Http\Controllers\SubscriptionController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\TaskExportController;
use App\Http\Controllers\WorkspaceColumnController;
use App\Http\Controllers\WorkspaceController;
use App\Http\Controllers\WorkspaceTaskChecklistController;
use App\Http\Controllers\WorkspaceTaskController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [\App\Http\Controllers\DashboardController::class, 'index'])->name('dashboard');

    Route::get('/tasks/export', [TaskExportController::class, 'downloadPdf'])->name('tasks.export');
    Route::post('/tasks/reorder', [TaskController::class, 'reorder'])->name('tasks.reorder');
    Route::resource('tasks', TaskController::class)
        ->only(['index', 'store', 'update', 'destroy'])
        ->names('tasks');

    Route::resource('habits', HabitController::class)
        ->only(['index', 'store', 'update', 'destroy'])
        ->names('habits');

    Route::post('habits/{habit}/toggle', [HabitLogsController::class, 'toggle'])
        ->name('habit-logs.toggle');

    Route::post('habits/{habit}/proof', [HabitLogsController::class, 'uploadProof'])
        ->name('habit-logs.proof');

    Route::resource('events', EventController::class)
        ->only(['index', 'store', 'update', 'destroy'])
        ->names('events');
        
    Route::patch('events/{event}/toggle-done', [EventController::class, 'toggleDone'])
        ->name('events.toggle-done');

    Route::get('/pricing', [SubscriptionController::class, 'index'])->name('pricing');
    
    // Fitur Kolaborasi Tim (Kanban)
    Route::get('/collaboration', [WorkspaceController::class, 'index'])->name('collaboration.index');
    Route::post('/collaboration', [WorkspaceController::class, 'store'])->name('collaboration.store');
    Route::get('/collaboration/{workspace}', [WorkspaceController::class, 'show'])->name('collaboration.show');
    Route::post('/collaboration/{workspace}/members', [WorkspaceController::class, 'addMember'])->name('collaboration.members.store');
    
    // Undangan (Invitation)
    Route::post('/invitations/{invitation}/accept', [WorkspaceController::class, 'acceptInvitation'])->name('invitations.accept');
    Route::post('/invitations/{invitation}/decline', [WorkspaceController::class, 'declineInvitation'])->name('invitations.decline');
    
    Route::post('/collaboration/{workspace}/columns', [WorkspaceColumnController::class, 'store'])->name('workspace-columns.store');
    Route::patch('/workspaces/{workspace}/columns/order', [WorkspaceColumnController::class, 'updateOrder'])->name('workspace-columns.updateOrder');

    // Kolaborasi Task Details & Features
    Route::put('/workspace-tasks/{task}', [WorkspaceTaskController::class, 'update'])->name('workspace-tasks.update');
    Route::post('/workspace-tasks/{task}/attachments', [WorkspaceTaskController::class, 'storeAttachment'])->name('workspace-tasks.attachments.store');
    Route::delete('/workspace-tasks/{task}/attachments/{index}', [WorkspaceTaskController::class, 'destroyAttachment'])->name('workspace-tasks.attachments.destroy');
    
    // Checklist
    Route::post('/workspace-tasks/{task}/checklists', [WorkspaceTaskChecklistController::class, 'store'])->name('workspace-task-checklists.store');
    Route::patch('/workspace-task-checklists/{checklist}', [WorkspaceTaskChecklistController::class, 'update'])->name('workspace-task-checklists.update');
    Route::delete('/workspace-task-checklists/{checklist}', [WorkspaceTaskChecklistController::class, 'destroy'])->name('workspace-task-checklists.destroy');

    Route::patch('/workspaces/{workspace}/tasks/order', [WorkspaceTaskController::class, 'updateOrder'])->name('workspace-tasks.updateOrder');

    Route::post('/workspaces/{workspace}/columns', [WorkspaceColumnController::class, 'store']);
    Route::put('/workspace-columns/{column}', [WorkspaceColumnController::class, 'update']);
    Route::delete('/workspace-columns/{column}', [WorkspaceColumnController::class, 'destroy']);
    Route::patch('/workspaces/{workspace}/columns/order', [WorkspaceColumnController::class, 'updateOrder']);
});



require __DIR__ . '/settings.php';
