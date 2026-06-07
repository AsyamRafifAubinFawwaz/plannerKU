---
trigger: always_on
---

# PRD — PlannerKu

## Deskripsi Produk

PlannerKu adalah web app produktivitas harian berbasis freemium
yang menggabungkan task planner, habit tracker, dan kalender
dalam satu antarmuka yang simpel.

Target pengguna: mahasiswa dan masyarakat umum Indonesia.

---

## Problem Statement

Banyak orang Indonesia — terutama mahasiswa — memakai banyak
aplikasi terpisah untuk mencatat tugas, melacak kebiasaan, dan
mengingat jadwal. Belum ada solusi lokal yang menggabungkan
ketiganya dengan harga terjangkau dan bahasa Indonesia.

Masalah tambahan: user sering lupa detail tugasnya karena
informasi asli (foto soal, screenshot WA dosen, foto papan tulis)
tersebar di galeri HP dan tidak terhubung ke planner.

---

## Fitur MVP

### Modul 1 — Task Planner

| Fitur | Gratis | Pro |
|---|---|---|
| Tambah tugas dengan judul, kategori, deadline | ✅ | ✅ |
| Tandai tugas selesai | ✅ | ✅ |
| Label kategori: kuliah / harian / penting | ✅ | ✅ |
| Catatan tambahan per tugas | ✅ | ✅ |
| Lampiran foto per tugas (maks 1 foto, maks 2MB) | ✅ | ✅ |
| Lampiran foto per tugas (maks 3 foto, maks 5MB/foto) | ❌ | ✅ |
| AI scan foto → auto-isi judul & deadline tugas | ❌ | ✅ |
| Maks 20 tugas per bulan | ✅ limit | ✅ unlimited |
| Export tugas ke PDF | ❌ | ✅ |

### Modul 2 — Habit Tracker

| Fitur | Gratis | Pro |
|---|---|---|
| Tambah kebiasaan dengan nama & icon | ✅ | ✅ |
| Centang kebiasaan harian | ✅ | ✅ |
| Lihat streak & dot 7 hari | ✅ | ✅ |
| Maks 3 habit aktif | ✅ limit | ✅ unlimited |
| Statistik & grafik kemajuan | ❌ | ✅ |
| Template kebiasaan siap pakai | ❌ | ✅ |

### Modul 3 — Kalender

| Fitur | Gratis | Pro |
|---|---|---|
| Lihat kalender mingguan | ✅ | ✅ |
| Tambah event dengan warna label | ✅ | ✅ |
| Support event multi-hari | ✅ | ✅ |
| Maks 10 event total | ✅ limit | ✅ unlimited |
| Notifikasi WhatsApp H-1 event | ❌ | ✅ |
| Recurring event (mingguan/bulanan) | ❌ | ✅ |

### Fitur umum

| Fitur | Gratis | Pro |
|---|---|---|
| Dashboard ringkasan harian | ✅ | ✅ |
| Akun & profil | ✅ | ✅ |
| Login via email + password | ✅ | ✅ |
| Login via passkey | ✅ | ✅ |
| Two-factor authentication | ✅ | ✅ |
| Notifikasi WhatsApp harian (ringkasan tugas) | ❌ | ✅ |

---

## Fitur Foto Tugas — Detail

### Konsep

User bisa melampirkan foto langsung saat tambah atau edit tugas.
Foto ditampilkan sebagai thumbnail kecil di task card —
user klik untuk lihat full size.

Contoh use case:
- Foto screenshot tugas dari grup WA dosen
- Foto soal ujian dari papan tulis
- Foto catatan kuliah yang perlu diselesaikan
- Screenshot deadline dari portal akademik

### Batasan per tier

| Batasan | Gratis | Pro |
|---|---|---|
| Jumlah foto per tugas | 1 foto | 3 foto |
| Ukuran maksimal per foto | 2 MB | 5 MB |
| Format yang diterima | JPG, PNG, WEBP | JPG, PNG, WEBP, HEIC |
| AI scan & auto-fill | ❌ | ✅ |
| Total storage per user | 50 MB | 2 GB |

### Alur upload (gratis)

```
User buka form tambah/edit tugas
→ Klik tombol "Lampirkan foto"
→ Pilih 1 foto dari galeri / kamera
→ Foto di-compress otomatis di frontend sebelum upload
→ Tersimpan di storage Laravel (disk: public atau S3)
→ Path foto disimpan di kolom `attachments` (JSON) di tabel tasks
→ Tampil sebagai thumbnail 60×60px di task card
```

### Alur AI scan (Pro)

```
User upload foto
→ Backend kirim foto ke Claude API (vision)
→ AI ekstrak: judul tugas, deadline, deskripsi
→ Form auto-terisi dengan hasil ekstraksi
→ User bisa edit sebelum simpan
→ Hemat waktu input manual
```

### Komponen yang dibutuhkan

- `TaskAttachment.vue` — thumbnail grid + preview full
- `PhotoUploader.vue` — input file + compress + preview sebelum upload
- `AttachmentService.php` — handle upload, validasi, hapus file
- Kolom `attachments` (JSON) di tabel `tasks`
- Storage disk yang terkonfigurasi (local untuk dev, S3/R2 untuk prod)

---

## Model Harga

| Tier | Harga | Keterangan |
|---|---|---|
| Gratis | Rp 0 | Selamanya, tidak perlu kartu kredit |
| Pro | Rp 19.000/bulan | atau Rp 149.000/tahun |
| Max | Rp 39.000/bulan | atau Rp 299.000/tahun (multi-akun, AI) |

### Mekanisme upgrade (MVP)

1. User gratis kena limit → muncul modal upgrade
2. User pilih paket → diarahkan ke halaman konfirmasi
3. User transfer manual ke rekening
4. Admin konfirmasi → `plan` di-update manual via panel/tinker
5. Fitur Pro langsung aktif

> Payment gateway (Midtrans) dikerjakan setelah MVP live.

---

## Batasan MVP (yang tidak dikerjakan dulu)

- ❌ Multi-akun / sharing (fitur Max)
- ❌ AI ringkas tugas & prioritas (fitur Max)
- ❌ Export PDF (bisa ditambah setelah MVP)
- ❌ Recurring event
- ❌ Full-text search
- ❌ Mobile app / PWA
- ❌ Midtrans payment gateway
- ❌ Dark/light mode toggle
- ❌ AI scan foto (fitur Pro — dikerjakan setelah core selesai)
- ❌ Upload ke S3/R2 (pakai local storage dulu untuk MVP)

---

## Alur User Utama

### Alur onboarding

```
Daftar → Login → Dashboard kosong
→ Muncul prompt "Tambah tugas pertamamu"
→ User tambah tugas / habit / event
→ Mulai pakai
```

### Alur tambah tugas dengan foto

```
User klik "Tambah tugas"
→ Isi judul, kategori, deadline
→ (opsional) Klik ikon kamera → pilih foto
→ Foto tampil sebagai preview kecil di form
→ Klik Simpan
→ Task card muncul di list dengan thumbnail foto
→ Klik thumbnail → foto tampil full screen
```

### Alur upgrade

```
User kena limit (task ke-21, habit ke-4, event ke-11,
atau coba upload foto ke-2 saat gratis)
→ Muncul UpgradeModal
→ User klik "Lihat paket"
→ Halaman pricing
→ User pilih Pro / Max
→ Halaman konfirmasi + instruksi transfer manual
→ Tunggu konfirmasi admin
→ Email notifikasi aktif
```

---

## Kriteria Selesai (Definition of Done) MVP

- [ ] Semua migration ter-migrate tanpa error
- [ ] User bisa daftar, login, dan logout
- [ ] User bisa tambah / selesaikan / hapus tugas
- [ ] User bisa lampirkan 1 foto saat tambah/edit tugas
- [ ] Foto tampil sebagai thumbnail di task card
- [ ] Foto terhapus otomatis saat task dihapus
- [ ] User bisa tambah habit dan centang harian
- [ ] Streak terhitung otomatis
- [ ] User bisa tambah event di kalender
- [ ] Dashboard menampilkan ringkasan hari ini
- [ ] Limit gratis berjalan (modal upgrade muncul)
- [ ] Halaman settings (ganti nama, WA number)
- [ ] Website bisa diakses publik via domain