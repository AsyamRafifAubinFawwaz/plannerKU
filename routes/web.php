<?php

use App\Http\Controllers\TaskController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    Route::resource('tasks', TaskController::class)
        ->only(['index', 'store', 'update', 'destroy'])
        ->names('tasks');

});



require __DIR__.'/settings.php';
