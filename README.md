# MAQOOSHIDUL QUR-AAN 12 (MQ12)
### Sistem Informasi Manajemen Organisasi, Tata Kelola Kas & Tabungan Safari

Aplikasi web modern, responsif, dan terintegrasi untuk manajemen organisasi dakwah, tata kelola kas bertingkat, tabungan safari, pinjaman antar-kas, arsip digital, dan matriks hak akses (RBAC).

---

## 🚀 Fitur Utama
1. **Desain Eksklusif Ungu Gradien Biru Navy**: Palet elegan `#6D28D9 via #312E81 to #000040` dengan aksen Gold (`#FFD700`).
2. **Floating Curved Notched Bottom Dock**: Navigasi smartphone melayang dengan tombol bulat Beranda di tengah.
3. **9 Modul Terintegrasi**:
   - Dashboard & KPI Eksekutif
   - Keanggotaan & KTA Digital
   - Buku Kas Utama, Multi-Rekening & Running Balance Ledger
   - Tabungan Safari & Simulasi Saldo
   - Pembayaran & Tagihan Mandiri Anggota (QRIS & Transfer Bank)
   - Pinjaman Antar-Kas dengan Simulasi Dampak Likuiditas
   - Arsip & Surat Resmi Berstempel Digital
   - Rekening Koran Formal Cetak PDF (A4 Kop Surat Resmi)
   - SuperAdmin Master Control Suite (Branding, Split-Pane RBAC Matrix, Audit Trail & Danger Zone)
4. **Backend Google Apps Script Terintegrasi**: Bebas CORS, sinkronisasi Google Sheets, dan penyimpanan Google Drive.
5. **Autentikasi Session Token**: Validasi token di setiap request (`org_session_token`) dengan deteksi otomatis sesi berakhir (*auto-redirect to login*).
6. **OneSignal Web Push SDK v16**: Notifikasi pop-up real-time di layar smartphone pengurus & anggota.
7. **Modal Konfirmasi Logout (*Clean Executive UI*)**: Intersepsi seluruh aksi logout dengan dialog konfirmasi aman dan de-registrasi OneSignal.

---

## 📁 Struktur Berkas Repositori
```
maqooshidul-quraan-12/
├── index.html              # Aplikasi Web Lengkap (Single Page Application)
├── api.js                  # Konektor Backend API Google Apps Script & Session Token
├── OneSignalSDKWorker.js   # Service Worker OneSignal Push Notification (wajib di root)
├── logo-mq12.png           # Asset Master Logo Kaligrafi Emas
├── .nojekyll               # Memastikan GitHub Pages menyajikan semua berkas statis
├── .gitignore              # Konfigurasi file yang diabaikan Git
└── README.md               # Dokumentasi Proyek & Panduan Deploy
```

---

## 🌐 Cara Deploy ke GitHub Pages (Gratis & Cepat)

### Langkah 1: Inisialisasi Git dan Push ke GitHub
Buka terminal (Git Bash / PowerShell) di dalam folder proyek ini:
```bash
cd maqooshidul-quraan-12
git init
git add .
git commit -m "feat: initial release MQ12 web app"
git branch -M main
git remote add origin https://github.com/USERNAME-ANDA/NAMA-REPO-ANDA.git
git push -u origin main
```

### Langkah 2: Aktifkan GitHub Pages
1. Buka repositori Anda di browser: `https://github.com/USERNAME-ANDA/NAMA-REPO-ANDA`
2. Klik tab **Settings** (Pengaturan) di bagian atas repositori.
3. Di bilah menu kiri, pilih **Pages** (di bawah bagian *Code and automation*).
4. Pada bagian **Build and deployment** -> **Source**:
   - Pilih **Deploy from a branch**.
   - Di bawah **Branch**, pilih `main` dan folder `/(root)`.
   - Klik **Save**.
5. Tunggu 1-2 menit hingga proses deploy selesai.
6. Link website Anda akan muncul di bagian atas:
   `https://USERNAME-ANDA.github.io/NAMA-REPO-ANDA/`

---

## ⚙️ Konfigurasi Backend & Push Notification
- **Backend API URL**: Dikonfigurasi di dalam berkas `api.js` (`const API_URL = "https://script.google.com/macros/s/AKfycbzyCW7RtaLkDk3BGIoefdEQ8530jqrDTItO_ijuuxWX2bmwdlxuAgeIFsrk9GUgKayIUA/exec"`).
- **OneSignal App ID**: `82ab671c-83d2-4786-94c2-ee0fb9666e89`
- **OneSignal Safari Web ID**: `web.onesignal.auto.62a04992-e924-4258-8064-560c4d6dc347`

---

© 2026 Lembaga Dakwah & Pendidikan Al-Qur'an **MAQOOSHIDUL QUR-AAN 12**. All rights reserved.
