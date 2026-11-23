# MAQOOSHIDUL QUR-AAN 12 (MQ12)
### Sistem Informasi Manajemen Organisasi, Tata Kelola Kas & Tabungan Safari
**Production-Ready Web Application (Full-Screen & Auto-Responsive)**

Aplikasi web modern, responsif otomatis, dan siap produksi untuk manajemen organisasi dakwah, tata kelola kas bertingkat, tabungan safari, pinjaman antar-kas, arsip digital, dan matriks hak akses (RBAC).

---

## 🚀 Fitur Produksi Utama
1. **Layar Penuh & Responsif Otomatis (Breakpoint `md: 768px`)**:
   - **Tampilan Desktop (`>= 768px`)**: Sidebar elegan ungu gradien navy di kiri, header status desktop, dan tabel-tabel data eksekutif.
   - **Tampilan Smartphone (`< 768px`)**: Header mobile ringkas anti-tumpuk, kartu identitas KTA hero card, dan Floating Curved Notched Bottom Navigation Bar di bawah.
   - Tanpa bingkai mockup atau fixed-canvas 1440x900 / 390x844 — aplikasi langsung mengisi 100% layar perangkat apapun.
2. **Alur Masuk Aman (Entry Point Auth Guard)**:
   - Cek `localStorage.getItem('org_session_token')`.
   - Pengunjung baru langsung diarahkan ke **Halaman Login** resmi.
   - Sesi yang valid langsung dialihkan ke **Beranda** dengan profil pengguna aktif.
3. **Backend Google Apps Script Terintegrasi**:
   - Endpoint: `https://script.google.com/macros/s/AKfycbzyCW7RtaLkDk3BGIoefdEQ8530jqrDTItO_ijuuxWX2bmwdlxuAgeIFsrk9GUgKayIUA/exec`
   - Bebas CORS (POST dengan text/plain).
   - Pengiriman token di setiap request dan deteksi sesi berakhir otomatis.
4. **Push Notifikasi OneSignal SDK v16**: Pop-up push notification di smartphone pengurus.
5. **Modal Konfirmasi Logout (*Clean Executive UI*)**: Dialog konfirmasi sebelum keluar, revoke token server, dan pembersihan sesi perangkat.

---

## 📁 Cara Deploy 1 File ke GitHub Pages (1-Klik)

1. Buka repositori Anda di GitHub.
2. Klik **Add file** -> **Upload files**.
3. Tarik dan lepas file **`index.html`** ke GitHub.
4. Klik **Commit changes**.
5. Buka **Settings** -> **Pages** -> pilih Branch `main` / `root` -> **Save**.
6. Web Anda langsung aktif di `https://USERNAME.github.io/REPO-NAME/`!

---

© 2026 Lembaga Dakwah & Pendidikan Al-Qur'an **MAQOOSHIDUL QUR-AAN 12**. All rights reserved.
