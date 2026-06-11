---
trigger: always_on
---

# Design System — PlannerKu

## Status: ✅ Selesai & Matang

Seluruh UI/UX frontend MVP sudah selesai dan selaras.
Dokumen ini adalah source of truth untuk konsistensi desain
saat mengerjakan komponen baru atau fitur tambahan.

---

## Tema: Gamified 3D Dark Mode

Terinspirasi dari Duolingo — interaktif, satisfying, namun tetap elegan.

```
Background utama : #141414  (bukan #0A0A0A lagi — lebih warm)
Surface/card     : #1E1E1E
Border           : #2A2A2A
Primary (oranye) : #FF6B1A
Primary light    : #FF8C42
Teks utama       : #FFFFFF
Teks muted       : #888888
```

---

## Color Tokens (CSS Variables)

```css
/* resources/css/app.css */
:root {
  --color-bg:             #141414;
  --color-surface:        #1E1E1E;
  --color-card:           #252525;
  --color-border:         #2A2A2A;
  --color-primary:        #FF6B1A;
  --color-primary-light:  #FF8C42;
  --color-primary-dim:    rgba(255, 107, 26, 0.12);
  --color-text:           #FFFFFF;
  --color-text-muted:     #888888;
  --color-text-faint:     #444444;
  --color-success:        #1D9E75;
  --color-danger:         #E24B4A;
  --color-warning:        #EF9F27;
  --color-info:           #378ADD;
}
```

### Tailwind config

```js
theme: {
  extend: {
    colors: {
      bg:      '#141414',
      surface: '#1E1E1E',
      card:    '#252525',
      border:  '#2A2A2A',
      primary: { DEFAULT: '#FF6B1A', light: '#FF8C42', dim: 'rgba(255,107,26,0.12)' },
      text:    { DEFAULT: '#FFFFFF', muted: '#888888', faint: '#444444' },
      success: '#1D9E75',
      danger:  '#E24B4A',
      warning: '#EF9F27',
      info:    '#378ADD',
    },
    borderWidth: { DEFAULT: '0.5px' },
  },
},
```

---

## Sistem Ikon

**Library: `react-icons`** — bukan lucide-react.

Semua ikon sudah dimigrasi ke keluarga `Fi` (Feather) dan `Fa6` (Font Awesome 6).

| Halaman / Elemen | Ikon | Import |
|---|---|---|
| Dashboard | `FiGrid` | `react-icons/fi` |
| Tugas | `FiTarget` | `react-icons/fi` |
| Habit | `FaFire` | `react-icons/fa6` |
| Kalender | `FiCalendar` | `react-icons/fi` |
| Settings | `FiSettings` | `react-icons/fi` |
| Tambah | `FiPlus` | `react-icons/fi` |
| Edit | `FiEdit2` | `react-icons/fi` |
| Hapus | `FiTrash2` | `react-icons/fi` |
| Detail / buka | `FiChevronRight` | `react-icons/fi` |
| Foto/kamera | `FiCamera` | `react-icons/fi` |
| Streak/api | `FaFire` | `react-icons/fa6` |
| Centang selesai | `FiCheckCircle` | `react-icons/fi` |

---

## Efek 3D — Sistem Gamifikasi

Ini adalah inti dari sistem visual PlannerKu. Semua elemen interaktif
menggunakan efek "tombol fisik" yang memberikan sensasi menekan nyata.

### Kelas Tailwind standar untuk kartu/tombol 3D

```jsx
// Kartu tugas / habit — keadaan normal
className="bg-surface border border-border border-b-4 border-b-[#FF6B1A]
           rounded-xl p-4 cursor-pointer
           transition-all duration-100 active:translate-y-[2px] active:border-b-[1px]"

// Tombol primary 3D
className="bg-primary border-b-4 border-b-[#C4500D]
           text-white font-semibold px-4 py-2 rounded-lg
           transition-all duration-100 active:translate-y-[2px] active:border-b-[1px]"

// Tombol secondary / ghost 3D
className="bg-surface border border-border border-b-4 border-b-[#1A1A1A]
           text-text-muted px-4 py-2 rounded-lg
           transition-all duration-100 active:translate-y-[2px] active:border-b-[1px]"
```

### Aturan warna border-b (shadow 3D)

| Warna elemen | Border-b (shadow) |
|---|---|
| Primary `#FF6B1A` | `#C4500D` (gelap 20%) |
| Surface `#1E1E1E` | `#0A0A0A` |
| Card `#252525` | `#111111` |
| Success `#1D9E75` | `#14705A` |
| Danger `#E24B4A` | `#A83535` |

---

## Komponen UI — Spesifikasi Final

### Task Card (3D)

```jsx
<div className="bg-surface border border-border border-b-4 border-b-[#0A0A0A]
                rounded-xl px-4 py-3 flex items-center gap-3
                transition-all duration-100 active:translate-y-[2px] active:border-b">

  {/* Checkbox gamifikasi — lingkaran besar */}
  <button className="w-7 h-7 rounded-full border-[2.5px] border-primary
                     flex items-center justify-center flex-shrink-0
                     transition-all duration-150
                     data-[done=true]:bg-primary data-[done=true]:border-primary">
    {isDone && <FiCheck size={14} className="text-white" />}
  </button>

  {/* Konten */}
  <div className="flex-1 min-w-0">
    <p className={`text-[13px] ${isDone ? 'line-through text-text-muted' : 'text-text'}`}>
      {task.title}
    </p>
  </div>

  {/* Tombol aksi — SELALU VISIBLE */}
  <div className="flex items-center gap-1 border-l border-border pl-3">
    <button className="p-1.5 rounded-lg hover:bg-card text-text-muted
                       hover:text-info transition-colors">
      <FiChevronRight size={14} />
    </button>
    <button className="p-1.5 rounded-lg hover:bg-card text-text-muted
                       hover:text-primary transition-colors">
      <FiEdit2 size={14} />
    </button>
    <button className="p-1.5 rounded-lg hover:bg-card text-text-muted
                       hover:text-danger transition-colors">
      <FiTrash2 size={14} />
    </button>
  </div>
</div>
```

### Habit Coin (3D, animasi)

```jsx
{/* Koin 7 hari — w-6 h-6, bukan dot kecil */}
<button
  onClick={() => toggleHabit(habit.id, day)}
  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center
              transition-all duration-150
              ${isDone
                ? 'bg-primary border-primary scale-110'      // aktif: sedikit lebih besar
                : 'bg-transparent border-border hover:border-primary'
              }`}
>
  {isDone && (
    <FiCheck
      size={12}
      className="text-white animate-[bounce_0.3s_ease-out]"
    />
  )}
</button>
```

### Task Detail Sheet (Slide-out)

```
- Muncul dari kanan, overlay blur di belakang
- Padding kiri lebih lega: pl-6 (bukan pl-4)
- Setiap blok info (Deadline, Catatan, Lampiran) dibungkus kartu 3D terpisah
- Tombol tutup di kiri atas (bukan kanan)
```

### Photo Lightbox

```jsx
{/* Pakai Dialog bawaan (shadcn/ui atau Headless UI) */}
{/* JANGAN buka tab baru — gunakan overlay fullscreen */}
<Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
  <DialogContent className="max-w-screen-lg bg-black/90 backdrop-blur-sm border-0">
    <img src={selectedPhoto} className="w-full h-auto rounded-lg" />
    <button onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 text-white">
      <FiX size={24} />
    </button>
  </DialogContent>
</Dialog>
```

### Kalender Grid (Baru)

```
Struktur satu kotak tanggal:
┌─────────────────────┐
│ 9  (kiri atas)  ● ● │  ← dots warna event di kanan atas
│                     │
│ ┃ Kumpul laporan   │  ← event dengan left-border warna
│ ┃ Konsultasi dosen │  ← langsung tampil, klik = buka modal edit
└─────────────────────┘
```

```jsx
// Kotak tanggal
<div className="border border-border rounded-lg p-2 min-h-[90px]
                hover:border-primary/30 transition-colors">

  {/* Header tanggal */}
  <div className="flex justify-between items-start mb-1">
    <span className={`text-[13px] font-medium
                      ${isToday ? 'text-primary' : 'text-text-muted'}`}>
      {day}
    </span>
    {/* Dots event di kanan atas */}
    <div className="flex gap-0.5">
      {events.slice(0,3).map(e => (
        <div key={e.id} className="w-1.5 h-1.5 rounded-full" style={{background:e.color}} />
      ))}
    </div>
  </div>

  {/* Event list langsung tampil */}
  {events.map(event => (
    <div key={event.id}
         onClick={() => openEditModal(event)}
         className="text-[11px] text-text-muted px-1.5 py-0.5 mb-0.5
                    rounded cursor-pointer hover:opacity-80
                    border-l-2 truncate"
         style={{borderColor: event.color, background: event.color + '15'}}>
      {event.is_done && <span className="mr-1">✓</span>}
      {event.title}
    </div>
  ))}
</div>
```

---

## Sidebar — Spesifikasi Final

```
Lebar: 52px (icon only)
Background: bg-surface
Border-right: 0.5px border-border

Urutan ikon:
1. FiGrid      → /dashboard
2. FiTarget    → /tasks
3. FaFire      → /habits
4. FiCalendar  → /events
5. FiSettings  → /settings (paling bawah)

Ikon aktif: bg-primary text-white rounded-lg (w-8 h-8)
Ikon non-aktif: text-text-faint hover:text-text-muted
```

---

## Tipografi

| Elemen | Size | Weight | Warna |
|---|---|---|---|
| Logo | 15px | 600 | `text-primary` |
| Heading halaman | 18-20px | 600 | `text-text` |
| Body / label | 13px | 400 | `text-text` |
| Label sekunder | 12px | 400 | `text-text-muted` |
| Badge / chip | 11px | 500 | tergantung konteks |
| Teks koin habit | 10px | 400 | `text-text-faint` |

---

## Animasi

```
Efek tekan 3D  : transition-all duration-100 active:translate-y-[2px]
Hover transisi : transition-colors duration-150
Koin centang   : animate-bounce (0.3s, sekali saat toggle)
Modal masuk    : transition opacity + translateY, duration-200
```

Tidak ada animasi dekoratif berlebihan — semua animasi adalah
**response langsung terhadap interaksi user**, bukan dekorasi.