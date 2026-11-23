/**
 * MAQOOSHIDUL QUR-AAN 12 (MQ12) - BACKEND API CONNECTOR
 * Koneksi Google Apps Script Web App, OneSignal Web Push, RBAC Matrix & Session Token
 */

const API_URL = "https://script.google.com/macros/s/AKfycbzyCW7RtaLkDk3BGIoefdEQ8530jqrDTItO_ijuuxWX2bmwdlxuAgeIFsrk9GUgKayIUA/exec";

/**
 * Fungsi Global callBackend untuk komunikasi dengan Google Apps Script Web App
 * Menggunakan method POST dan Content-Type text/plain;charset=utf-8 agar bebas CORS
 * Mengirim session token dari localStorage ('org_session_token') pada setiap pemanggilan
 * Memeriksa authError jika sesi berakhir dan mengarahkan otomatis ke Login
 * 
 * @param {string} action Nama tindakan/endpoint backend (misal: 'login', 'logout', 'getDashboard', 'saveRecord', 'uploadFile', 'kirimNotifikasi', 'getRoles', 'updateRolePermissions')
 * @param {object} payload Parameter data yang dikirim ke backend
 * @returns {Promise<any>} Hasil respons JSON dari backend
 */
async function callBackend(action, payload = {}) {
  try {
    const token = (typeof localStorage !== 'undefined') ? (localStorage.getItem('org_session_token') || '') : '';
    console.log(`[API Call] Action: "${action}"`, { ...payload, ...(token ? { token: '***' } : {}) });

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify({ action, payload, token })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(`[API Response] Action: "${action}"`, data);

    // Cek jika sesi expired atau terdapat authError dari backend
    if (data && data.authError === true) {
      console.warn('[API Auth Error] Sesi tidak valid atau telah berakhir dari backend.');
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('org_session_token');
        localStorage.removeItem('currentUser');
        localStorage.removeItem('user');
        localStorage.removeItem('user_data');
      }
      if (typeof window !== 'undefined') {
        window.currentUser = null;
        if (typeof window.showToast === 'function') {
          window.showToast("Sesi Anda telah berakhir, silakan login kembali", "warning");
        } else if (typeof showToast === 'function') {
          showToast("Sesi Anda telah berakhir, silakan login kembali", "warning");
        } else {
          alert("Sesi Anda telah berakhir, silakan login kembali");
        }
        if (typeof window.switchScreen === 'function') {
          window.switchScreen('login');
        } else if (typeof switchScreen === 'function') {
          switchScreen('login');
        }
      }
    }

    return data;
  } catch (error) {
    console.error(`[API Backend Error] Action: "${action}":`, error);
    throw error;
  }
}

/**
 * Menyimpan data baris baru ke Google Sheet tertentu
 * @param {string} sheetName Nama sheet target (e.g., 'Anggota', 'Keuangan', 'Tabungan', 'Arsip', 'Master_Roles')
 * @param {Array} rowArray Array baris data yang akan disimpan
 */
async function saveRecord(sheetName, rowArray) {
  return await callBackend('saveRecord', { sheetName, rowArray });
}

/**
 * Mengunggah berkas terenkripsi/Base64 ke Google Drive / Backend Storage
 * @param {string} base64Data Data berkas dalam format Base64 murni
 * @param {string} fileName Nama berkas lengkap dengan ekstensi (e.g., 'Resi-TRX-092.jpg', 'SK-Legalitas.pdf')
 * @param {string} folderKey Kunci/Kategori folder tujuan (e.g., 'bukti_transfer', 'arsip_pdf')
 */
async function uploadFile(base64Data, fileName, folderKey = 'general') {
  return await callBackend('uploadFile', { base64Data, fileName, folderKey });
}

/**
 * Konversi Objek File browser menjadi string Base64 murni
 * @param {File} file Objek File dari input type="file"
 * @returns {Promise<string>} String Base64 tanpa header data:[mime];base64,
 */
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result;
      const base64 = typeof result === 'string' && result.includes(',') ? result.split(',')[1] : result;
      resolve(base64);
    };
    reader.onerror = error => reject(error);
  });
}

/**
 * Helper Fungsi untuk mengirim notifikasi tagihan ke anggota tertentu
 * Memanggil aksi 'kirimNotifikasi' pada Backend Google Apps Script
 * 
 * @param {string} targetUserId ID Anggota penerima (misal: 'MQ12-ANG-092')
 * @param {string} judul Judul notifikasi tagihan
 * @param {string} pesan Rincian pesan tagihan
 */
async function kirimNotifikasiTagihan(targetUserId, judul, pesan) {
  return await callBackend('kirimNotifikasi', {
    targetUserId,
    tabNotif: 'Tagihan',
    badge: 'Tagihan',
    judul,
    pesan,
    kirimWA: true
  });
}

/**
 * Mengambil daftar role beserta matriks hak akses permissions_json dari backend
 */
async function getRoles() {
  return await callBackend('getRoles');
}

/**
 * Menyimpan/memperbarui konfigurasi hak akses role ke backend
 */
async function updateRolePermissions(payload) {
  return await callBackend('updateRolePermissions', payload);
}

// Ekspor ke window global untuk ketersediaan di seluruh aplikasi
if (typeof window !== 'undefined') {
  window.API_URL = API_URL;
  window.callBackend = callBackend;
  window.saveRecord = saveRecord;
  window.uploadFile = uploadFile;
  window.fileToBase64 = fileToBase64;
  window.kirimNotifikasiTagihan = kirimNotifikasiTagihan;
  window.getRoles = getRoles;
  window.updateRolePermissions = updateRolePermissions;
}
