# Matematik TVET GFM031 — Nota & Kuiz

Aplikasi web statik (PWA) untuk nota dan kuiz Matematik TVET GFM031. Tiada
backend, tiada panel guru, tiada pangkalan data. Semua kandungan dibina semasa
proses build dan dimuatkan dari fail statik.

- **Nota** untuk 5 topik
- **Kuiz** per topik dan cabaran rawak 20 soalan
- **Boleh offline** selepas lawatan pertama (service worker + cache)
- **Kemajuan** disimpan pada peranti pelajar sahaja (`localStorage`)

## Keperluan

- Node.js 20 atau 22 (disyorkan 22)
- npm 10+

## Arahan pembangunan

```bash
npm install
npm run dev
```

`npm run dev` akan menjana semula `src/data/content.json` daripada fail JSON
sumber, kemudian memulakan pelayan pembangunan Vite.

```bash
npm run build     # jana kandungan + semak TypeScript + bina ke dist/
npm run preview   # pratonton hasil build di http://localhost:4173
```

## Kandungan

Sumber kebenaran ialah tiga fail JSON di akar projek:

| Fail | Kandungan |
| --- | --- |
| `gfm_nota_lengkap.json` | Nota HTML untuk 5 topik |
| `gfm_bank_soalan.json` | 100 soalan kuiz (soalan, 4 pilihan, jawapan, penjelasan) |
| `gfm_gambarajah.json` | Gambarajah SVG untuk soalan yang memerlukan rajah |

`scripts/prepare-content.mjs` membaca ketiga-tiga fail, membersihkan HTML,
menetapkan topik bagi setiap soalan, memasukkan gambarajah, mengesahkan data,
dan menulis `src/data/content.json`. Fail ini dijana semula pada setiap `npm run dev` dan
`npm run build`, jadi jangan edit `src/data/content.json` secara manual.

### Mengedit nota

Edit kandungan HTML dalam `gfm_nota_lengkap.json`. Nota dipaparkan melalui
`dangerouslySetInnerHTML`, jadi hanya letakkan kandungan yang dipercayai. Tag
`<script>` dan atribut `on*` dibuang secara automatik semasa penjanaan.

### Mengedit soalan

Edit `gfm_bank_soalan.json`:

```json
{
  "id": 1,
  "module": "Modul 1: Pengukuran Asas",
  "source": "Latihan 30 Soalan",
  "question": "Tukarkan 108 km/j kepada m/s.",
  "options": ["20 m/s", "25 m/s", "30 m/s", "35 m/s"],
  "correct_answer": "C",
  "explanation": "108 ÷ 3.6 = 30 m/s"
}
```

Peraturan yang disemak automatik semasa penjanaan:

- `id` mesti unik
- `options` mesti tepat 4 dan tiada pilihan kosong
- `correct_answer` mesti `A`, `B`, `C` atau `D`
- tiada aksara rosak `U+FFFD`

Penetapan topik menggunakan julat ID dalam fungsi `topicForId()` di
`scripts/prepare-content.mjs`. Jika anda menambah soalan baharu, kemas kini
julat tersebut. Pembetulan kandungan khas (ID 8, 16, 70, 90) juga berada dalam
objek `fixes` dalam fail yang sama.

### Gambarajah soalan

Sesetengah soalan memerlukan rajah. Gambarajah disimpan sebagai SVG dalam
`gfm_gambarajah.json`, dengan kunci mengikut `id` soalan:

```json
{
  "5": "<svg viewBox=\"0 0 300 200\">...</svg>"
}
```

`scripts/prepare-content.mjs` akan memasukkan SVG ini ke dalam medan `diagram`
pada soalan berkenaan. Jika anda mengubah rujukan asal, jalankan
`npm run diagrams` untuk mengekstrak semula gambarajah daripada
`rujukan/gfm latihan.txt`, kemudian semak hasilnya.

### Ikon PWA

Ikon dijana daripada `public/logo.svg`:

```bash
npm run icons
```

Ini menghasilkan `pwa-64x64.png`, `pwa-192x192.png`, `pwa-512x512.png`,
`maskable-icon-512x512.png`, `apple-touch-icon-180x180.png` dan `favicon.ico`
dalam `public/`.

## Struktur projek

```text
.
├─ index.html                 # Templat HTML
├─ netlify.toml               # Build, redirect SPA dan header cache
├─ vite.config.ts             # Konfigurasi Vite + manifest/service worker PWA
├─ tailwind.config.js
├─ scripts/
│  ├─ prepare-content.mjs     # Penjana kandungan dan pengesahan data
│  └─ extract-diagrams.mjs    # Ekstrak SVG daripada fail rujukan
├─ src/
│  ├─ app.tsx                 # Susun atur, routing, footer
│  ├─ main.tsx
│  ├─ styles.css              # Tailwind + gaya kandungan nota
│  ├─ components/             # Header, kad topik, prompt pasang, dsb.
│  ├─ lib/                    # Kandungan, kuiz, routing, storan
│  ├─ pages/                  # Home, Note, Quiz, NotFound
│  └─ data/content.json       # DIJANA — jangan edit manual
├─ public/                    # Ikon, logo, favicon
├─ gfm_nota_lengkap.json      # Sumber nota
├─ gfm_bank_soalan.json       # Sumber soalan
└─ gfm_gambarajah.json        # Gambarajah SVG untuk soalan terpilih
```

## Routing

Aplikasi menggunakan History API dengan URL bersih:

- `/` — laman utama
- `/nota/<topik>` — contoh: `/nota/trigonometri`
- `/kuiz/<topik>` — contoh: `/kuiz/pengukuran`
- `/kuiz/semua` — cabaran rawak 20 soalan daripada 100 soalan

Topik yang sah: `pengukuran`, `lukisan-berskala`, `trigonometri`,
`statistik-pengiraan`, `statistik-graf`.

`netlify.toml` menetapkan redirect `/*` ke `/index.html` (status 200) supaya
URL ini berfungsi apabila dibuka terus atau dimuat semula. Service worker juga
menggunakan `navigateFallback` yang sama.

## Deploy ke Netlify

### Pilihan 1 — Sambung repositori Git

1. Tolak projek ini ke GitHub/GitLab/Bitbucket.
2. Di Netlify, pilih **Add new site → Import an existing project**.
3. Pilih repositori.
4. Tetapan build (biasanya dikesan automatik daripada `netlify.toml`):
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - **Node version:** 22
5. Klik **Deploy**.

### Pilihan 2 — Drag and drop

```bash
npm run build
```

Kemudian seret folder `dist/` ke halaman Netlify Drop. Cara ini tidak
menyokong deploy berulang secara automatik, tetapi sesuai untuk pratonton.

### Selepas deploy

- Pastikan HTTPS aktif (Netlify menyediakannya secara automatik). Service
  worker dan pemasangan PWA memerlukan HTTPS.
- Uji buka `/nota/trigonometri` secara terus — halaman sepatutnya dimuatkan,
  bukan 404.
- Uji mod offline: buka aplikasi sekali, matikan rangkaian, kemudian muat
  semula.

## PWA dan storan

- Service worker dijana oleh `vite-plugin-pwa` semasa build.
- Prompt “Versi baharu tersedia” muncul apabila ada kemas kini; tekan
  **Muat semula** untuk menggunakan versi terbaharu.
- Kemajuan kuiz disimpan dalam `localStorage` dengan kunci
  `gfm-pwa-progress-v1`.
- Butang **Padam kemajuan** di footer memadam semua rekod pada peranti itu.
- Tiada data dihantar ke pelayan. Tiada akaun, tiada login.

## Skrip

| Arahan | Fungsi |
| --- | --- |
| `npm run dev` | Jana kandungan dan jalankan pelayan pembangunan |
| `npm run build` | Jana kandungan, semak TypeScript, bina ke `dist/` |
| `npm run preview` | Pratonton hasil build |
| `npm run content` | Jana semula `src/data/content.json` sahaja |
| `npm run diagrams` | Ekstrak semula gambarajah daripada fail rujukan |
| `npm run icons` | Jana semula ikon PWA daripada `public/logo.svg` |

## Nota teknikal

- Stack: Vite 8, Preact 11, TypeScript, Tailwind CSS 3.4, Workbox melalui
  `vite-plugin-pwa`.
- Susunan soalan dan pilihan jawapan diacak pada setiap percubaan. Ini
  memastikan taburan kunci asal tidak memberi petunjuk kepada pelajar.
- Nota asal menggunakan kelas Tailwind. `tailwind.config.js` mengimbas
  `src/data/**/*.json` supaya kelas yang hanya muncul dalam kandungan nota
  tetap dijana.
- Jika build gagal kerana kelas Tailwind tidak sah, semak kelas baharu dalam
  nota atau dalam `src/styles.css`.
