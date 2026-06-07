---
trigger: always_on
---

# Design System — PlannerKu

## Tema yang Disepakati

**Opsi A — Dark Pure**
Hitam pekat sebagai base, oranye terang sebagai warna utama.
Karakter: tegas, modern, developer-friendly.

---

## Color Tokens

Definisikan semua warna sebagai CSS variable di `resources/css/app.css`.
**Jangan pernah hardcode hex langsung di template Vue.**

```css
/* resources/css/app.css */
:root {
  /* Background layers */
  --color-bg:            #0A0A0A;   /* halaman utama */
  --color-surface:       #141414;   /* topbar, sidebar, card */
  --color-card:          #1E1E1E;   /* card dalam card, input */
  --color-border:        #2A2A2A;   /* semua garis pemisah */

  /* Brand */
  --color-primary:       #FF6B1A;   /* tombol utama, aksen aktif */
  --color-primary-light: #FF8C42;   /* hover state primary */
  --color-primary-dim:   #FF6B1A1A; /* background badge/tag primary */

  /* Text */
  --color-text:          #FFFFFF;   /* teks utama */
  --color-text-muted:    #888888;   /* label, placeholder, sekunder */
  --color-text-faint:    #444444;   /* disabled, sangat redup */

  /* Semantic */
  --color-success:       #1D9E75;   /* selesai, streak aktif, pro badge */
  --color-danger:        #E24B4A;   /* deadline lewat, hapus */
  --color-warning:       #EF9F27;   /* mendekati deadline */
  --color-info:          #378ADD;   /* informasi netral */
}
```

### Tailwind custom token — `tailwind.config.js`

```js
theme: {
  extend: {
    colors: {
      bg:      'var(--color-bg)',
      surface: 'var(--color-surface)',
      card:    'var(--color-card)',
      border:  'var(--color-border)',
      primary: {
        DEFAULT: 'var(--color-primary)',
        light:   'var(--color-primary-light)',
        dim:     'var(--color-primary-dim)',
      },
      text: {
        DEFAULT: 'var(--color-text)',
        muted:   'var(--color-text-muted)',
        faint:   'var(--color-text-faint)',
      },
      success: 'var(--color-success)',
      danger:  'var(--color-danger)',
      warning: 'var(--color-warning)',
      info:    'var(--color-info)',
    },
    borderWidth: {
      DEFAULT: '0.5px',  // semua border di app ini 0.5px
    },
  },
},
```

Contoh pemakaian di Vue:

```html
<div class="bg-surface border border-border rounded-xl p-4">
  <button class="bg-primary hover:bg-primary-light text-white px-4 py-2 rounded-lg">
    Simpan
  </button>
</div>
```

---

## Tipografi

Font: **system font** (`font-sans` Tailwind) — tidak perlu Google Fonts.

| Elemen               | Size  | Weight | Warna token        |
|----------------------|-------|--------|--------------------|
| Logo / brand         | 15px  | 500    | `text-primary`     |
| Heading halaman      | 20px  | 500    | `text-text`        |
| Sub-heading / title  | 15px  | 500    | `text-text`        |
| Body / label         | 13px  | 400    | `text-text`        |
| Label sekunder       | 12px  | 400    | `text-text-muted`  |
| Badge / chip         | 11px  | 500    | tergantung konteks |
| Placeholder          | 13px  | 400    | `text-text-faint`  |

---

## Spacing & Radius

| Token       | Value | Penggunaan                            |
|-------------|-------|---------------------------------------|
| `p-3`       | 12px  | Padding badge, chip, item kecil       |
| `p-4`       | 16px  | Padding card standar                  |
| `p-5`       | 20px  | Padding section / container           |
| `gap-2`     | 8px   | Jarak elemen dalam list               |
| `gap-3`     | 12px  | Jarak antar card dalam grid           |
| `gap-4`     | 16px  | Jarak antar section                   |
| `rounded-md`| 6px   | Elemen kecil (badge, input kecil)     |
| `rounded-lg`| 8px   | Card, input, button standar           |
| `rounded-xl`| 12px  | Modal, panel, card besar              |
| `rounded-full` | 9999px | Badge pil, avatar, dot streak     |

---

## Komponen UI

### Button

```
Primary  → bg-primary text-white hover:bg-primary-light
           px-4 py-2 text-[13px] rounded-lg transition-colors duration-150

Ghost    → bg-transparent border border-border text-text-muted
           hover:bg-card hover:text-text
           px-4 py-2 text-[13px] rounded-lg transition-colors duration-150

Danger   → bg-transparent border border-danger/30 text-danger
           hover:bg-danger/10
           px-4 py-2 text-[13px] rounded-lg transition-colors duration-150

Kecil    → px-3 py-1.5 text-[11px] rounded-md
```

### Input & Textarea

```
bg-card border border-border text-text
placeholder:text-text-faint
focus:outline-none focus:ring-1 focus:ring-primary
px-3 py-2 rounded-lg text-[13px]
```

### Card

```
bg-surface border border-border rounded-xl p-4
hover:border-[#3A3A3A] transition-colors duration-150
```

### Badge / Tag kategori

| Kategori | Background      | Teks          |
|----------|----------------|---------------|
| kuliah   | `#1E1A3A`      | `#A89BE8`     |
| harian   | `bg-card`      | `text-muted`  |
| penting  | `primary-dim`  | `text-primary`|
| deadline lewat | `danger/15` | `text-danger` |
| selesai  | `success/15`   | `text-success`|

```html
<!-- Contoh badge kuliah -->
<span class="text-[11px] px-2 py-0.5 rounded-full font-medium"
      style="background:#1E1A3A; color:#A89BE8">
  kuliah
</span>
```

### Sidebar icon

```
Wrapper: w-8 h-8 rounded-lg flex items-center justify-center
Aktif  : bg-primary text-white
Non-aktif: text-text-muted hover:text-text hover:bg-card
Ukuran icon: 20px
```

### Stat card (dashboard)

```
bg-surface border border-border rounded-xl p-3

Angka utama (misal jumlah tugas): text-[16px] font-medium text-primary
Angka biasa                      : text-[16px] font-medium text-text
Label                            : text-[11px] text-text-muted mt-0.5
```

### Task item

```
bg-surface hover:bg-card px-3 py-2 rounded-lg
flex items-center gap-2.5 transition-colors duration-100

Checkbox selesai  : w-3.5 h-3.5 bg-primary rounded-[3px] flex-shrink-0
Checkbox belum    : w-3.5 h-3.5 border-[1.5px] border-border rounded-[3px] flex-shrink-0
Teks selesai      : text-[12px] text-text-muted line-through flex-1
Teks aktif        : text-[12px] text-text flex-1
```

### Habit dot tracker (7 hari)

```
Done : w-2.5 h-2.5 rounded-full bg-primary
Miss : w-2.5 h-2.5 rounded-full bg-card border border-border
```

### Upgrade modal

```
bg-primary-dim border border-primary/20 rounded-xl p-4
Teks heading : text-primary-light font-medium
Teks body    : text-text-muted text-[13px]
Tombol       : bg-primary text-white (primary button)
```

---

## Layout Global

### Struktur halaman

```
┌─────────────────────────────────────────┐
│  Topbar (h-11, bg-surface)              │
│  border-b border-border                 │
├──────────┬──────────────────────────────┤
│ Sidebar  │  Konten utama                │
│ w-13     │  bg-bg p-5                   │
│ bg-surface│  min-h-[calc(100vh-44px)]   │
│ border-r │                              │
└──────────┴──────────────────────────────┘
```

### Topbar

- Kiri: logo "PlannerKu" `text-primary font-medium text-[15px]`
- Kanan: nama user (text-text-muted) + avatar + tombol logout (ghost)
- `border-b border-border` dengan `border-width: 0.5px`

### Sidebar

- Width: `w-13` (52px), icon only — collapsed di mobile
- Icon aktif: `bg-primary text-white rounded-lg`
- Urutan: Dashboard · Tugas · Habit · Kalender · Pengaturan

### Dashboard grid

```
[Tugas hari ini] [Streak] [Event minggu ini]  ← grid-cols-3 gap-3
[Task list hari ini                        ]  ← col-span-full
[Habit tracker minggu ini                  ]  ← col-span-full
```

---

## Animasi & Transisi

Minimal. Hanya untuk feedback interaksi.

```
Hover elemen   : transition-colors duration-150
Modal masuk    : transition opacity + scale, duration-200
Centang tugas  : transition-colors duration-100
```

Tidak ada animasi dekoratif — fokus ke produktivitas, bukan wow-factor.

---

## Icon

Gunakan **Tabler Icons** (outline style, konsisten).

| Konteks           | Ukuran |
|-------------------|--------|
| Sidebar           | 20px   |
| Inline teks       | 16px   |
| Tombol            | 16px   |
| Empty state       | 32px   |

Selalu tambahkan `aria-hidden="true"` pada icon dekoratif.

---

## Dark Mode

Seluruh UI adalah dark mode secara default.
Tidak ada light mode toggle untuk saat ini.
