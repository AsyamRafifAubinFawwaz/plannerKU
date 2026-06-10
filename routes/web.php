<?php

use App\Http\Controllers\EventController;
use App\Http\Controllers\HabitController;
use App\Http\Controllers\HabitLogsController;
use App\Http\Controllers\TaskController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [\App\Http\Controllers\DashboardController::class, 'index'])->name('dashboard');

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
});



require __DIR__ . '/settings.php';
