---
trigger: always_on
---

# Todo — PlannerKu

Progress pengerjaan MVP. Update file ini setiap kali task selesai.

---

## Status

| Simbol | Arti |
|---|---|
| ✅ | Selesai |
| 🔄 | Sedang dikerjakan |
| ⬜ | Belum dikerjakan |

---

## Phase 0 — Docs & Desain ✅

| Status | Task |
|--------|------|
| ✅ | `docs/agent.md` |
| ✅ | `docs/architecture.md` |
| ✅ | `docs/prd.md` |
| ✅ | `docs/design.md` — termasuk sistem gamifikasi 3D |
| ✅ | `docs/services.md` |
| ✅ | `docs/todo.md` |
| ✅ | Mockup Figma — Dashboard, Tasks, Habits, Calendar, Modal, Timeline, Landing Page |

---

## Phase 1 — Database & Model

| Status | Task |
|--------|------|
| ✅ | Migration `users` |
| ✅ | Migration `tasks` (+ `attachments` JSON) |
| ✅ | Migration `habits` |
| ✅ | Migration `habit_logs` |
| ✅ | Migration `events` — **perlu tambah kolom `is_done`, `start_date`, `end_date`** |
| ✅ | Migration `subscriptions` |
| ✅ | Model `User` — relasi + helper plan + canAdd* |
| ⬜ | **Migration baru: tambah `is_done` + `start_date` + `end_date` ke tabel `events`** |
| ⬜ | Model `Task` — fillable, cast `attachments→array`, scope, boot auto-delete foto |
| ⬜ | Model `Habit` — fillable, casts, relasi ke HabitLog |
| ⬜ | Model `HabitLog` — fillable, unique handling |
| ⬜ | Model `Event` — fillable, casts date, scope `multiDay()` |
| ⬜ | Model `Subscription` — fillable, casts |

---

## Phase 2 — Backend

| Status | Task |
|--------|------|
| ⬜ | `TaskPolicy` |
| ⬜ | `HabitPolicy` |
| ⬜ | `EventPolicy` |
| ⬜ | `StoreTaskRequest` + `UpdateTaskRequest` (+ validasi foto) |
| ⬜ | `StoreHabitRequest` + `UpdateHabitRequest` |
| ⬜ | **`StoreEventRequest` + `UpdateEventRequest` — include `is_done`, `start_date`, `end_date`** |
| ⬜ | `AttachmentService` |
| ⬜ | `HabitStreakService` |
| ⬜ | `WaNotificationService` |
| ⬜ | `DashboardController@index` |
| ⬜ | `TaskController` — index, store, update, destroy |
| ⬜ | `HabitController` — index, store, update, destroy |
| ⬜ | `HabitLogController@toggle` |
| ⬜ | **`EventController` — index, store, update, destroy + `toggleDone()`** |
| ⬜ | `SettingsController` — index, update |
| ⬜ | `SubscriptionController` — index, show |
| ⬜ | Command `wa:send-daily-reminder` |
| ⬜ | Command `plan:activate` |
| ⬜ | Setup scheduler di `routes/console.php` |
| ⬜ | Routes di `routes/web.php` |
| ⬜ | `HandleInertiaRequests` — share auth + isPro + flash |
| ⬜ | Konfigurasi storage disk |
| ⬜ | `php artisan storage:link` |

---

## Phase 3 — Frontend ✅ (UI/UX Selesai)

> Seluruh komponen UI sudah selesai dan matang.
> Tema Gamified 3D (Duolingo-style) sudah diterapkan di semua halaman.
> Yang tersisa hanya koneksi ke backend (Inertia props + form submission).

| Status | Task |
|--------|------|
| ✅ | Setup token warna di `app.css` + `tailwind.config.js` |
| ✅ | `AppLayout` — topbar + sidebar (ikon react-icons: FiGrid, FiTarget, FaFire, FiCalendar) |
| ✅ | `Topbar` |
| ✅ | `Sidebar` |
| ✅ | `FlashMessage` |
| ✅ | `UpgradeModal` |
| ✅ | `ConfirmModal` |
| ✅ | `Dashboard.vue` |
| ✅ | `Tasks/Index.vue` — kartu 3D, checkbox gamifikasi, tombol aksi selalu visible |
| ✅ | `TaskCard` — efek tekan 3D (border-b-4 + translate-y) |
| ✅ | `TaskForm` |
| ✅ | `PhotoUploader` — compress + preview |
| ✅ | `TaskAttachment` — lightbox fullscreen (Dialog, bukan tab baru) |
| ✅ | `Task Detail Sheet` — slide-out, padding lega, info dalam kartu 3D |
| ✅ | `Habits/Index.vue` — koin 3D, animasi centang bouncing |
| ✅ | `HabitRow` — koin 7 hari (w-6 h-6), animasi scaling saat selesai |
| ✅ | `HabitForm` |
| ✅ | `Calendar/Index.vue` — grid baru, tanggal kiri atas, dots kanan atas, event langsung muncul |
| ✅ | `CalendarGrid` — left-border per event, klik langsung buka modal Edit |
| ✅ | `Settings/Index.vue` |
| ✅ | `Subscription/Index.vue` |
| ✅ | `Subscription/Confirm.vue` |
| ⬜ | **Koneksi backend: wiring semua Inertia props + form submission ke controller** |
| ⬜ | **Tambah toggle `is_done` di event kalender (setelah migration baru selesai)** |

---

## Phase 4 — Integrasi & Launch

| Status | Task |
|--------|------|
| ⬜ | Test notif WA end-to-end |
| ⬜ | Setup crontab di server |
| ⬜ | Landing page (Blade statis) |
| ⬜ | Setup queue worker |
| ⬜ | Deploy ke VPS / Laravel Forge |
| ⬜ | `php artisan migrate` di production |
| ⬜ | `php artisan storage:link` di production |
| ⬜ | Test alur lengkap end-to-end |

---

## Phase 5 — Fitur Pro Lanjutan

| Status | Task |
|--------|------|
| ⬜ | AI scan foto tugas (Claude Vision API) |
| ⬜ | Migrasi storage ke S3 / R2 |
| ⬜ | Export tugas ke PDF |
| ⬜ | Statistik habit detail |
| ⬜ | Recurring event |
| ⬜ | Timeline view personal (Gantt) |
| ⬜ | Group timeline / project kelompok (Max plan) |

---

## Phase 6 — Payment Gateway

| Status | Task |
|--------|------|
| ⬜ | Integrasi Midtrans Snap |
| ⬜ | Webhook handler |
| ⬜ | Auto-aktivasi plan |
| ⬜ | Email konfirmasi |

---

## Catatan Pengerjaan

- **[Phase 3 selesai]** Seluruh UI/UX frontend MVP sudah matang dan selaras.
  - Tema: Gamified 3D dark mode (`#141414`, aksen `#FF6B1A`)
  - Ikon: semua sudah migrasi ke `react-icons` (Fi + Fa6)
  - Efek 3D: `border-b-4` + `translate-y-[2px]` saat ditekan
  - Task: checkbox lingkaran besar, tombol aksi selalu visible, lightbox foto
  - Habit: koin 3D animasi bouncing saat dicentang
  - Kalender: grid baru, event langsung tampil dengan left-border warna

- **[Next step prioritas]** Mulai Phase 2 backend — urutan yang disarankan:
  1. Migration baru: tambah `is_done`, `start_date`, `end_date` ke tabel `events`
  2. Model `Event`, `Task`, `Habit`, `HabitLog`
  3. Form Request, Policy, Controller per fitur
  4. Wiring Inertia props di semua halaman Vue

- Migration semua tabel sudah ada kecuali update `events` (perlu migration baru).
- Subscription MVP pakai transfer manual — Midtrans paling terakhir.
- Figma: https://www.figma.com/design/C6vthS26g1Z36rd9Uz3wdy