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

## Phase 1 — Database & Model

| Status | Task |
|--------|------|
| ✅ | Migration `users` (+ kolom Fortify, plan, wa_number) |
| ✅ | Migration `tasks` (+ kolom `attachments` JSON untuk foto) |
| ✅ | Migration `habits` |
| ✅ | Migration `habit_logs` |
| ✅ | Migration `events` |
| ✅ | Migration `subscriptions` |
| ✅ | Model `User` — relasi + helper plan + canAdd* methods |
| ✅ | Model `Task` — fillable, casts (attachments → array), scope, relasi |
| ⬜ | Model `Habit` — fillable, casts, scope, relasi |
| ⬜ | Model `HabitLog` — fillable, unique constraint handling |
| ⬜ | Model `Event` — fillable, casts, scope |
| ⬜ | Model `Subscription` — fillable, casts |

---

## Phase 2 — Backend (Controller, Request, Policy, Service)

| Status | Task |
|--------|------|
| ⬜ | `TaskPolicy` — view, create, update, delete |
| ⬜ | `HabitPolicy` — view, create, update, delete |
| ⬜ | `EventPolicy` — view, create, update, delete |
| ⬜ | `StoreTaskRequest` + `UpdateTaskRequest` (include validasi foto) |
| ⬜ | `StoreHabitRequest` + `UpdateHabitRequest` |
| ⬜ | `StoreEventRequest` + `UpdateEventRequest` |
| ⬜ | `AttachmentService` — upload, validasi ukuran/format, hapus file |
| ⬜ | `DashboardController@index` |
| ⬜ | `TaskController` — index, store, update, destroy (+ handle foto) |
| ⬜ | `HabitController` — index, store, update, destroy |
| ⬜ | `HabitLogController@toggle` |
| ⬜ | `EventController` — index, store, update, destroy |
| ⬜ | `HabitStreakService` — kalkulasi & update streak |
| ⬜ | Route group dengan middleware auth |
| ⬜ | Konfigurasi storage disk di `config/filesystems.php` |

---

## Phase 3 — Frontend (Vue + Inertia)

| Status | Task |
|--------|------|
| ⬜ | Setup Tailwind token warna di `app.css` + `tailwind.config.js` |
| ⬜ | `AppLayout.vue` — topbar + sidebar |
| ⬜ | `Topbar.vue` |
| ⬜ | `Sidebar.vue` |
| ⬜ | `FlashMessage.vue` — success/error global |
| ⬜ | `UpgradeModal.vue` — muncul saat kena limit gratis |
| ⬜ | `Dashboard.vue` — stat card + task hari ini + habit tracker |
| ⬜ | `Tasks/Index.vue` — list + form tambah + edit + hapus |
| ⬜ | `TaskCard.vue` — tampilkan thumbnail foto jika ada |
| ⬜ | `PhotoUploader.vue` — input file + compress + preview |
| ⬜ | `TaskAttachment.vue` — thumbnail grid + fullscreen preview |
| ⬜ | `Habits/Index.vue` — list habit + centang harian |
| ⬜ | `HabitRow.vue` |
| ⬜ | `Calendar/Index.vue` — grid kalender + event |
| ⬜ | `Settings/Index.vue` — ganti nama, nomor WA |

---

## Phase 4 — Integrasi & Finishing

| Status | Task |
|--------|------|
| ⬜ | `WaNotificationService` + integrasi Fonnte API |
| ⬜ | Scheduled command — kirim notif WA harian (Pro) |
| ⬜ | Halaman landing page (Blade statis) |
| ⬜ | Halaman pricing + instruksi transfer manual |
| ⬜ | Flow konfirmasi pembayaran manual (admin panel/tinker) |
| ⬜ | Deploy ke VPS / Laravel Forge |

---

## Phase 5 — Fitur Pro Lanjutan (setelah MVP live)

| Status | Task |
|--------|------|
| ⬜ | AI scan foto tugas → auto-fill form (Claude Vision API) |
| ⬜ | Upload storage ke S3 / Cloudflare R2 (ganti local) |
| ⬜ | Batas foto Pro: 3 foto per tugas, 5MB/foto, format HEIC |
| ⬜ | Total storage quota per user (50MB gratis / 2GB Pro) |

---

## Phase 6 — Payment Gateway (paling terakhir)

| Status | Task |
|--------|------|
| ⬜ | Integrasi Midtrans Snap |
| ⬜ | Webhook handler pembayaran |
| ⬜ | Auto-aktivasi plan setelah pembayaran |
| ⬜ | Email konfirmasi pembayaran |

---

## Catatan Pengerjaan

- Migration selesai, Model User sudah include helper plan dan relasi lengkap.
- Kolom `attachments` (JSON) ditambahkan ke tabel `tasks` untuk menyimpan path foto.
- Fitur AI scan foto masuk Phase 5 — dikerjakan setelah core MVP live.
- Storage MVP pakai local disk dulu, migrasi ke S3/R2 setelah deploy.