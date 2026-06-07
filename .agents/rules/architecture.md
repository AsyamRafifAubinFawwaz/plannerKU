---
trigger: always_on
---

# Architecture — PlannerKu

## Gambaran Umum

PlannerKu adalah web app produktivitas harian berbasis freemium.
Arsitektur difokuskan pada:

- Pengerjaan cepat oleh solo developer
- Kode yang ringkas, benar, dan konsisten
- Kemudahan maintenance jangka panjang
- Skalabel dari MVP ke produk penuh

---

## High Level Architecture

```
┌─────────────────────┐
│      Browser        │
│   (Vue 3 via SPA)   │
└──────────┬──────────┘
           │ Inertia.js (bukan REST API, bukan full page reload)
           ▼
┌─────────────────────┐
│   Laravel Backend   │
│  Route → Controller │
│  → Policy/Request   │
│  → Model/Service    │
└──────┬──────────────┘
       │
       ├──────────────────┐
       ▼                  ▼
┌─────────────┐   ┌───────────────┐
│  MySQL /    │   │  Fonnte API   │
│  PostgreSQL │   │  (Notif WA)   │
└─────────────┘   └───────────────┘
```

---

## Tech Stack (tidak boleh diganti tanpa diskusi)

| Layer              | Teknologi                        |
|--------------------|----------------------------------|
| Backend framework  | Laravel (versi terbaru)          |
| Auth               | Laravel Fortify + Passkey + 2FA  |
| Frontend           | Inertia.js + Vue 3               |
| Styling            | Tailwind CSS v4                  |
| Database           | MySQL atau PostgreSQL             |
| ORM                | Eloquent                         |
| Notifikasi WA      | Fonnte API                       |
| Payment (nanti)    | Transfer manual → Midtrans       |
| Deployment (nanti) | VPS / Laravel Forge              |

---

## Pola Arsitektur: Thin Controller

### Alur request yang benar

```
Request masuk
    │
    ▼
Form Request        ← validasi input, otorisasi basic
    │
    ▼
Controller          ← TIPIS: terima, delegasi, kembalikan response
    │
    ├──▶ Policy     ← cek kepemilikan & izin resource
    │
    ├──▶ User method ← canAddTask(), canAddHabit(), dll
    │
    └──▶ Model / Service ← logic bisnis, query, kalkulasi streak
```

### Controller hanya boleh berisi 3 hal

1. Terima request (sudah divalidasi Form Request)
2. Panggil Model method atau Service
3. Kembalikan response Inertia atau `back()`

### Contoh benar vs salah

```php
// ✅ BENAR
public function store(StoreTaskRequest $request)
{
    abort_if(! auth()->user()->canAddTask(), 403);
    auth()->user()->tasks()->create($request->validated());
    return back()->with('success', 'Tugas ditambahkan.');
}

// ❌ SALAH — logic bocor ke controller
public function store(Request $request)
{
    $request->validate([...]); // harusnya Form Request
    $count = Task::where('user_id', auth()->id())->count(); // harusnya canAddTask()
    if ($count >= 20) { ... }
    Task::create([...]);
    return back();
}
```

---

## Struktur Folder

```
app/
├── Http/
│   ├── Controllers/
│   │   ├── DashboardController.php
│   │   ├── TaskController.php
│   │   ├── HabitController.php
│   │   ├── HabitLogController.php
│   │   ├── EventController.php
│   │   └── SubscriptionController.php
│   ├── Requests/
│   │   ├── StoreTaskRequest.php
│   │   ├── UpdateTaskRequest.php
│   │   ├── StoreHabitRequest.php
│   │   ├── UpdateHabitRequest.php
│   │   ├── StoreEventRequest.php
│   │   └── UpdateEventRequest.php
│   └── Middleware/
│       └── HandleInertiaRequests.php   ← share data global (user, plan, flash)
├── Models/
│   ├── User.php          ← sudah ada, jangan diubah strukturnya
│   ├── Task.php
│   ├── Habit.php
│   ├── HabitLog.php
│   ├── Event.php
│   └── Subscription.php
├── Policies/
│   ├── TaskPolicy.php
│   ├── HabitPolicy.php
│   └── EventPolicy.php
└── Services/
    ├── HabitStreakService.php   ← hitung & update streak
    └── WaNotificationService.php ← kirim notif via Fonnte

resources/
└── js/
    ├── Pages/
    │   ├── Dashboard.vue
    │   ├── Tasks/
    │   │   └── Index.vue
    │   ├── Habits/
    │   │   └── Index.vue
    │   ├── Calendar/
    │   │   └── Index.vue
    │   └── Settings/
    │       └── Index.vue
    └── Components/
        ├── Layout/
        │   ├── AppLayout.vue     ← topbar + sidebar
        │   ├── Topbar.vue
        │   └── Sidebar.vue
        ├── Task/
        │   ├── TaskCard.vue
        │   └── TaskForm.vue
        ├── Habit/
        │   ├── HabitRow.vue
        │   └── HabitForm.vue
        ├── Calendar/
        │   └── CalendarGrid.vue
        └── Shared/
            ├── UpgradeModal.vue
            ├── ConfirmModal.vue
            └── FlashMessage.vue
```

---

## Routing

```php
// routes/web.php
Route::middleware(['auth'])->group(function () {

    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::resource('tasks',  TaskController::class)
        ->only(['index', 'store', 'update', 'destroy']);

    Route::resource('habits', HabitController::class)
        ->only(['index', 'store', 'update', 'destroy']);

    Route::post('habits/{habit}/toggle', [HabitLogController::class, 'toggle'])
        ->name('habit-logs.toggle');

    Route::resource('events', EventController::class)
        ->only(['index', 'store', 'update', 'destroy']);

    Route::get('/settings', [SettingsController::class, 'index'])->name('settings');
});
```

---

## Shared Data via Inertia Middleware

Di `HandleInertiaRequests.php`, share data global berikut ke semua halaman:

```php
public function share(Request $request): array
{
    return array_merge(parent::share($request), [
        'auth' => [
            'user' => $request->user()?->only('id', 'name', 'email', 'plan', 'plan_expires_at'),
            'isPro' => $request->user()?->isPro() ?? false,
        ],
        'flash' => [
            'success' => session('success'),
            'error'   => session('error'),
        ],
    ]);
}
```

---

## Strategi Rendering

| Halaman          | Cara render          |
|------------------|----------------------|
| Dashboard        | Inertia (Vue)        |
| Tasks            | Inertia (Vue)        |
| Habits           | Inertia (Vue)        |
| Calendar         | Inertia (Vue)        |
| Settings         | Inertia (Vue)        |
| Landing page     | Blade statis         |
| Login / Register | Fortify + Blade      |

---

## Keamanan

- Semua route fitur wajib di dalam middleware `auth`.
- Kepemilikan resource dicek via **Policy**, bukan manual di controller.
- Limit fitur gratis dicek via method di `User.php` (`canAddTask()`, dll).
- Validasi input selalu di **Form Request**.
- Tidak ada logika plan yang bisa di-bypass dari frontend.