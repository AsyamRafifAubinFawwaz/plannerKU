---
trigger: always_on
---

# PRD — PlannerKu

## Deskripsi Produk

PlannerKu adalah web app produktivitas harian berbasis freemium
yang menggabungkan task planner, habit tracker, dan kalender
dalam satu antarmuka gamified yang interaktif.

Target pengguna: mahasiswa dan masyarakat umum Indonesia.

---

## Status UI/UX Frontend

> ✅ **Phase 3 (Frontend) sudah 100% selesai.**
> Semua halaman dan komponen sudah matang dengan tema Gamified 3D.
> Next step adalah backend (Phase 2) dan wiring Inertia.

---

## Problem Statement

Mahasiswa Indonesia memakai banyak app terpisah untuk tugas, kebiasaan,
dan jadwal. Belum ada solusi lokal yang menggabungkan ketiganya
dengan desain yang menyenangkan, harga terjangkau, dan bahasa Indonesia.

---

## Fitur MVP

### Modul 1 — Task Planner

| Fitur | Gratis | Pro |
|---|---|---|
| Tambah tugas: judul, kategori, deadline | ✅ | ✅ |
| Checkbox gamifikasi (lingkaran besar) | ✅ | ✅ |
| Label: kuliah / harian / penting | ✅ | ✅ |
| Tombol Detail, Edit, Hapus selalu visible | ✅ | ✅ |
| Catatan tambahan per tugas | ✅ | ✅ |
| Lampiran foto (1 foto, 2MB) | ✅ | ✅ |
| Lightbox fullscreen saat klik foto | ✅ | ✅ |
| Lampiran foto (3 foto, 5MB/foto) | ❌ | ✅ |
| AI scan foto → auto-fill form | ❌ | ✅ |
| Maks 20 tugas per bulan | ✅ limit | ✅ tak terbatas |
| Export PDF | ❌ | ✅ |

### Modul 2 — Habit Tracker

| Fitur | Gratis | Pro |
|---|---|---|
| Tambah habit dengan nama & icon | ✅ | ✅ |
| Koin 3D animasi — centang harian | ✅ | ✅ |
| Animasi bouncing saat habit selesai | ✅ | ✅ |
| Streak harian otomatis 🔥 | ✅ | ✅ |
| Dot tracker 7 hari (koin w-6 h-6) | ✅ | ✅ |
| Maks 3 habit aktif | ✅ limit | ✅ tak terbatas |
| Statistik & grafik kemajuan | ❌ | ✅ |
| Template habit siap pakai | ❌ | ✅ |
| Notifikasi WhatsApp harian | ❌ | ✅ |

### Modul 3 — Kalender

| Fitur | Gratis | Pro |
|---|---|---|
| Grid kalender mingguan & bulanan | ✅ | ✅ |
| Tanggal di kiri atas, dots di kanan atas | ✅ | ✅ |
| Event tampil langsung di kotak tanggal | ✅ | ✅ |
| Left-border warna per event | ✅ | ✅ |
| Klik event → langsung buka modal Edit | ✅ | ✅ |
| Tambah event dengan warna label | ✅ | ✅ |
| Event multi-hari (start_date + end_date) | ✅ | ✅ |
| **Toggle selesai per event (is_done)** | ✅ | ✅ |
| Maks 10 event total | ✅ limit | ✅ tak terbatas |
| Notifikasi WA H-1 event | ❌ | ✅ |
| Recurring event | ❌ | ✅ |

### Fitur Umum

| Fitur | Gratis | Pro |
|---|---|---|
| Dashboard ringkasan harian | ✅ | ✅ |
| Login email + password | ✅ | ✅ |
| Login passkey | ✅ | ✅ |
| Two-factor authentication | ✅ | ✅ |
| Notif WhatsApp harian (ringkasan tugas) | ❌ | ✅ |

---

## Fitur Event `is_done` — Detail

### Latar belakang

User ingin bisa menandai event di kalender sebagai "sudah selesai"
tanpa harus menghapus event tersebut dari kalender.
Contoh: "Kumpul laporan PKL" — setelah dikumpul, tinggal centang selesai.

### Perubahan database yang dibutuhkan

Migration baru (bukan edit migration lama):

```php
// Migration: add_is_done_to_events_table
$table->boolean('is_done')->default(false)->after('color');
```

Kolom `start_date` dan `end_date` sudah ada di tabel events.
Jika belum, tambahkan sekalian di migration yang sama.

### Tampilan di kalender

```
Event belum selesai : ┃ Kumpul laporan PKL
Event sudah selesai : ┃ ✓ Kumpul laporan PKL  (teks muted + strikethrough)
```

### Controller method baru

```php
// EventController
public function toggleDone(Event $event)
{
    $this->authorize('update', $event);
    $event->update(['is_done' => ! $event->is_done]);
    return back()->with('success', $event->is_done ? 'Event selesai!' : 'Event dibatalkan.');
}
```

```php
// Route baru
Route::patch('events/{event}/toggle-done', [EventController::class, 'toggleDone'])
    ->name('events.toggle-done');
```

---

## Fitur Foto Lampiran — Detail

| Batasan | Gratis | Pro |
|---|---|---|
| Jumlah foto per tugas | 1 | 3 |
| Ukuran per foto | 2MB | 5MB |
| Format | JPG, PNG, WEBP | + HEIC |
| AI scan & auto-fill | ❌ | ✅ |
| Storage per user | 50MB | 2GB |

### Lightbox (sudah selesai di frontend)

- Tidak membuka tab baru
- Menggunakan komponen `Dialog` fullscreen
- Background blur (`backdrop-blur-sm`)
- Bisa ditutup dengan klik luar area atau tombol X

---

## Model Harga

| Tier | Harga | Keterangan |
|---|---|---|
| Gratis | Rp 0 | Selamanya |
| Pro | Rp 19.000/bulan | atau Rp 149.000/tahun |
| Max | Rp 39.000/bulan | Multi-akun, AI, Timeline group |

### Payment MVP: Transfer Manual

```
User kena limit → UpgradeModal
→ /pricing → pilih paket
→ Instruksi transfer rekening
→ Konfirmasi ke admin
→ Admin jalankan: php artisan plan:activate {id} {plan}
→ Fitur Pro aktif ✅
```

---

## Alur User Utama

### Tambah tugas dengan foto

```
Klik "+ Task baru"
→ Isi judul, kategori, deadline
→ (opsional) Upload foto → preview langsung
→ Simpan → task muncul di list dengan thumbnail
→ Klik thumbnail → Lightbox fullscreen
```

### Centang habit (koin animasi)

```
Lihat baris habit
→ Klik koin hari ini
→ Koin berubah oranye + icon ✓ muncul dengan animasi bounce
→ Streak +1 otomatis
→ Jika streak baru = rekor → muncul celebration toast
```

### Tandai event selesai

```
Lihat kalender → event tampil di kotak tanggal
→ Klik event → modal edit terbuka
→ Klik tombol "Tandai Selesai"
→ Event di kalender berubah: teks muted + strikethrough + ikon ✓
→ Event tidak hilang dari kalender
```

---

## Batasan MVP (belum dikerjakan)

- ❌ Timeline Gantt view (personal)
- ❌ Group project / multi-akun (Max)
- ❌ AI scan foto
- ❌ Export PDF
- ❌ Recurring event
- ❌ Full-text search
- ❌ Mobile app / PWA
- ❌ Midtrans payment gateway

---

## Definition of Done MVP

- [ ] Migration baru `events` (is_done) selesai dan ter-migrate
- [ ] Semua Model selesai (Task, Habit, HabitLog, Event, Subscription)
- [ ] Semua Controller + Route terhubung
- [ ] Inertia props wired ke semua halaman Vue
- [ ] Toggle `is_done` event berjalan di kalender
- [ ] Upload & lightbox foto berjalan end-to-end
- [ ] Habit streak terhitung otomatis
- [ ] Limit gratis berjalan (UpgradeModal muncul)
- [ ] Notif WA harian berjalan untuk user Pro
- [ ] Website live dan bisa diakses publik