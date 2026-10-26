# Cerdas Cermat Biologi SMA

Aplikasi web interaktif pembelajaran Biologi SMA lengkap berbasis kurikulum nasional dengan materi terstruktur, diagram visual berlabel bahasa Indonesia, bank 75 soal HOTS (Pilihan Ganda & Esai), evaluasi capaian belajar, unduh materi PDF, serta integrasi pencatatan nilai ke **Google Sheets**.

---

## 🌟 Fitur Utama

1. **5 Sub Materi Lengkap Kurikulum SMA**:
   - **Keanekaragaman Hayati** (Tingkat Gen, Spesies, Ekosistem; Persebaran Garis Wallace & Weber; Konservasi In Situ & Ex Situ).
   - **Ekosistem dan Pencemaran Lingkungan** (Komponen Biotik-Abiotik, Piramida Energi, Hukum 10% Lindeman, Eutrofikasi, Biomagnifikasi, Bioremediasi).
   - **Sel dan Jaringan** (Organel Sel Eukariotik, Sel Tumbuhan vs Hewan, Jaringan Meristem/Parenkim/Sklerenkim/Xilem-Floem/Otot/Epitel/Ikat/Saraf).
   - **Sistem Pencernaan** (Saluran & Kelenjar Pencernaan, Enzim Pankreas ALiT, Alur Urutan 7 Langkah Pencernaan, Vili Ileum).
   - **Sistem Pernapasan & Peredaran Darah** (Pernapasan Dada vs Perut, Difusi Alveolus, Jantung 4 Ruang, Peredaran Darah Besar & Kecil).

2. **3 Tab Interaktif Pada Setiap Sub Materi**:
   - **(a) Materi**: Ringkasan berpoin, tabel komparasi organ $\rightarrow$ fungsi, diagram alur langkah bernomor, kotak "Ingat!" (jembatan keledai), serta ilustrasi SVG interaktif.
   - **(b) Latihan Soal (15 Soal per Sub Materi, Total 75 Soal)**:
     - 10 Soal Pilihan Ganda (A, B, C, D, E) tingkat Mudah, Sedang, hingga Sulit / HOTS.
     - 5 Soal Esai Uraian Singkat dengan pemeriksa kata kunci otomatis & rubrik penilaian.
     - Pilihan Mode Latihan (pembahasan instan) atau Mode Cerdas Cermat (timer hitung mundur).
     - Fitur Acak Soal & Opsi.
   - **(c) Hasil & Evaluasi**:
     - Skor gabungan resmi (70% Pilihan Ganda + 30% Esai).
     - Kategori penguasaan (*Belum Menguasai, Cukup, Menguasai, Sangat Menguasai*) dengan efek konfeti.
     - Grafik batang capaian per Tujuan Pembelajaran (TP).
     - Rekomendasi bagian materi yang perlu diulang dengan tombol tautan langsung.

3. **Integrasi Google Sheets & Google Drive**:
   - Masuk aman via *Sign in with Google*.
   - Pembuatan Spreadsheet rekap nilai otomatis dengan satu klik di Google Drive.
   - Pencatatan hasil latihan siswa langsung ke baris Google Sheet secara *real-time*.
   - Pratinjau langsung tabel rekap di dalam aplikasi.

4. **Ekspor Berkas PDF Klien-Side (jsPDF)**:
   - Unduh Buku Materi Lengkap (PDF) berisi seluruh materi, diagram, dan 75 bank soal + kunci jawaban.
   - Unduh PDF per Sub Materi.
   - Unduh Rapor Evaluasi Siswa (PDF).

---

## 🚀 Menjalankan Aplikasi Secara Lokal

### Prasyarat
- Node.js (v18 atau lebih baru)
- npm atau pnpm / yarn

### Instalasi
```bash
# 1. Clone repositori ini
git clone https://github.com/USERNAME/cerdas-cermat-biologi.git
cd cerdas-cermat-biologi

# 2. Pasang dependensi
npm install

# 3. Jalankan server pengembangan lokal
npm run dev
```

Buka peramban di `http://localhost:3000`.

---

## 📦 Build untuk Produksi

```bash
npm run build
```
Hasil build statis akan tersimpan di direktori `dist/` dan siap di-hosting di GitHub Pages, Vercel, Netlify, atau Firebase Hosting.

---

## 🌐 Cara Publish ke GitHub & GitHub Pages

### 1. Inisialisasi Git & Push ke Repositori GitHub
```bash
git init
git add .
git commit -m "feat: inisialisasi aplikasi Cerdas Cermat Biologi SMA lengkap"
git branch -M main
git remote add origin https://github.com/USERNAME/NAMA-REPO-ANDA.git
git push -u origin main
```

### 2. Deploy Gratis ke Vercel / Netlify (Paling Mudah)
- Buka [vercel.com](https://vercel.com) atau [netlify.com](https://netlify.com).
- Hubungkan akun GitHub Anda dan pilih repositori ini.
- Vercel/Netlify akan otomatis mendeteksi Vite dan melakukan deploy dalam 1 menit.

---

## 🛠️ Tumpukan Teknologi (Tech Stack)
- **Frontend Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Ikonografi**: Lucide React
- **Dokumentasi PDF**: jsPDF
- **Animasi & Efek**: Canvas-Confetti, Motion
- **Autentikasi & Database**: Firebase Auth & Google Sheets API
