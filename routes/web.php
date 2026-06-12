<?php

use App\Http\Controllers\EventController;
use App\Http\Controllers\HabitController;
use App\Http\Controllers\HabitLogsController;
use App\Http\Controllers\SubscriptionController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\TaskExportController;
use App\Http\Controllers\WorkspaceController;
use App\Http\Controllers\WorkspaceTaskController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [\App\Http\Controllers\DashboardController::class, 'index'])->name('dashboard');

    Route::get('/tasks/export', [TaskExportController::class, 'downloadPdf'])->name('tasks.export');
    Route::resource('tasks', TaskController::class)
        ->only(['index', 'store', 'update', 'destroy'])
        ->names('tasks');

    Route::resource('habits', HabitController::class)
        ->only(['index', 'store', 'update', 'destroy'])
        ->names('habits');

    Route::post('habits/{habit}/toggle', [HabitLogsController::class, 'toggle'])
        ->name('habit-logs.toggle');

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
    
    Route::post('/collaboration/{workspace}/tasks', [WorkspaceTaskController::class, 'store'])->name('collaboration.tasks.store');
    Route::patch('/workspace-tasks/{workspaceTask}/status', [WorkspaceTaskController::class, 'updateStatus'])->name('collaboration.tasks.updateStatus');
});



require __DIR__ . '/settings.php';
