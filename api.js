/**
 * MAQOOSHIDUL QUR-AAN 12 (MQ12) - BACKEND API CONNECTOR
 * Koneksi Google Apps Script Web App, OneSignal Web Push, RBAC Matrix, Session Token & Custom Kwitansi
 */

const API_URL = "https://script.google.com/macros/s/AKfycbzyCW7RtaLkDk3BGIoefdEQ8530jqrDTItO_ijuuxWX2bmwdlxuAgeIFsrk9GUgKayIUA/exec";

let _globalLoadingCount = 0;

/**
 * Menampilkan Global Loading Overlay dengan logo MQ12 berputar searah jarum jam
 * @param {string} pesan Teks status loading yang ditampilkan di bawah logo
 */
let _loadingWatchdog = null;

/**
 * Menampilkan Global Loading Overlay dengan logo MQ12 berputar searah jarum jam
 * Dilengkapi pengawas otomatis (watchdog) 15 detik agar overlay tidak pernah tersangkut
 * @param {string} pesan Teks status loading yang ditampilkan di bawah logo
 */
function showLoading(pesan = 'Silakan ditunggu...') {
  _globalLoadingCount++;
  clearTimeout(_loadingWatchdog);
  _loadingWatchdog = setTimeout(() => {
    if (_globalLoadingCount > 0) {
      console.warn('[Loading Watchdog] Auto-hiding overlay after 15s network timeout');
      hideLoading(true);
    }
  }, 15000);

  try {
    const overlay = document.getElementById('global-loading-overlay');
    const textEl = document.getElementById('global-loading-text');
    if (textEl && pesan) {
      textEl.innerText = pesan;
    }
    if (overlay) {
      overlay.classList.remove('hidden');
      overlay.classList.add('flex');
    }
  } catch (e) {
    console.warn('[showLoading error]:', e);
  }
}

/**
 * Menyembunyikan Global Loading Overlay
 * @param {boolean} force Jika true, langsung menutup overlay tanpa memperhatikan antrean counter
 */
function hideLoading(force = false) {
  if (force) {
    _globalLoadingCount = 0;
  } else {
    _globalLoadingCount = Math.max(0, _globalLoadingCount - 1);
  }
  if (_globalLoadingCount === 0) {
    clearTimeout(_loadingWatchdog);
    _loadingWatchdog = null;
    try {
      const overlay = document.getElementById('global-loading-overlay');
      if (overlay) {
        overlay.classList.add('hidden');
        overlay.classList.remove('flex');
      }
    } catch (e) {
      console.warn('[hideLoading error]:', e);
    }
  }
}

/**
 * Fungsi Global callBackend untuk komunikasi dengan Google Apps Script Web App
 * Menggunakan method POST dan Content-Type text/plain;charset=utf-8 agar bebas CORS
 * Mengirim session token dari localStorage ('org_session_token') pada setiap pemanggilan
 * Memeriksa authError jika sesi berakhir dan mengarahkan otomatis ke Login
 * Menampilkan Global Loading Overlay (logo berputar) dan otomatis menutup di blok finally
 * 
 * @param {string} action Nama tindakan/endpoint backend (misal: 'login', 'logout', 'getDashboard', 'saveRecord', 'uploadFile', 'kirimNotifikasi', 'getRoles', 'updateRolePermissions', 'getKwitansiConfig', 'saveKwitansiConfig', 'generateDanKirimKwitansi')
 * @param {object} payload Parameter data yang dikirim ke backend
 * @returns {Promise<any>} Hasil respons JSON dari backend
 */
/**
 * Helper terpusat untuk mengambil session token aktif dari berbagai layer penyimpanan
 * @returns {string} Session token aktif atau string kosong jika belum login
 */
function getSessionToken() {
  if (typeof window !== 'undefined' && window.__ORG_TOKEN__) {
    return window.__ORG_TOKEN__;
  }
  if (typeof localStorage !== 'undefined') {
    const loc = localStorage.getItem('org_session_token');
    if (loc) return loc;
  }
  if (typeof sessionStorage !== 'undefined') {
    const ses = sessionStorage.getItem('org_session_token');
    if (ses) return ses;
  }
  return '';
}

async function callBackend(action, payload = {}) {
  const loadingMessages = {
    'login': 'Memverifikasi akun & login...',
    'logout': 'Keluar dari sistem...',
    'getDashboard': 'Memuat data dashboard...',
    'saveRecord': 'Menyimpan data...',
    'uploadFile': 'Mengunggah berkas...',
    'uploadArsip': 'Menyimpan berkas arsip...',
    'getNotifikasi': 'Memuat notifikasi...',
    'kirimNotifikasi': 'Mengirim notifikasi...',
    'getRoles': 'Memuat data hak akses role...',
    'updateRolePermissions': 'Menyimpan hak akses role...',
    'getUsers': 'Memuat daftar pengguna...',
    'saveUser': 'Menyimpan data pengguna...',
    'resetPassword': 'Mereset kata sandi...',
    'updateUserRole': 'Memperbarui peran pengguna...',
    'getPinjaman': 'Memuat data pinjaman...',
    'ajukanPinjaman': 'Menyimpan pengajuan pinjaman...',
    'prosesApprovalPinjaman': 'Memproses persetujuan pinjaman...',
    'angsurPinjamanInternal': 'Mencatat angsuran pinjaman...',
    'bayarAngsuran': 'Menyimpan angsuran pinjaman...',
    'getFinanceData': 'Memuat data Finance & Tagihan...',
    'ajukanSetoranFinance': 'Mengajukan setoran ke Keuangan...',
    'approvalSetoranFinance': 'Memproses persetujuan setoran...',
    'verifyPayment': 'Memverifikasi pembayaran...',
    'getKwitansiConfig': 'Memuat template kwitansi...',
    'saveKwitansiConfig': 'Menyimpan template kwitansi...',
    'generateDanKirimKwitansi': 'Memproses Kwitansi PDF...',
    'syncGitHub': 'Menyinkronkan repositori GitHub...',
    'bulkImport': 'Mengimpor data massal...',
    'updateProfile': 'Memperbarui profil...'
  };
  const msg = loadingMessages[action] || `Memproses ${action}...`;
  showLoading(msg);
  try {
    // Cegah pemanggilan API backend sebelum login selesai (tanpa token)
    const token = (action === 'login') ? '' : getSessionToken();
    if (action !== 'login' && !token) {
      console.warn(`[callBackend] Panggilan API "${action}" dibatalkan karena tidak ada token sesi aktif (belum login).`);
      hideLoading(true);
      return { success: false, message: 'Belum ada sesi login aktif', noSession: true };
    }

    console.log(`[API Call] Action: "${action}"`, { ...payload, ...(token ? { token: '***' } : {}) });

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
            body: JSON.stringify({
        action: action,
        payload: payload || {},
        token: action === 'login' ? '' : getSessionToken()
      }),
      redirect: 'follow'
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(`[API Response] Action: "${action}"`, data);

    // Cek jika sesi expired atau terdapat authError dari backend
    if (data && data.authError === true) {
      console.warn('AuthError pada action:', action, 'Token ada:', Boolean(getSessionToken()));
      const isDemo = (typeof localStorage !== 'undefined') && localStorage.getItem('mq12_is_demo') === 'true';
      if (isDemo) {
        console.warn(`[API Auth Warning] Diabaikan karena dalam Mode Demo RBAC (action: "${action}").`);
        return data;
      }
      console.warn('[API Auth Error] Sesi tidak valid atau telah berakhir dari backend.');
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('org_session_token');
        localStorage.removeItem('org_user');
        localStorage.removeItem('currentUser');
        localStorage.removeItem('user');
        localStorage.removeItem('user_data');
        localStorage.removeItem('mq12_is_demo');
      }
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.clear();
      }
      if (typeof window !== 'undefined') {
        window.currentUser = null;
        if (typeof window.showToast === 'function') {
          window.showToast("Sesi Anda telah berakhir, silakan login kembali", "warning");
        } else if (typeof showToast === 'function') {
          showToast("Sesi Anda telah berakhir, silakan login kembali", "warning");
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
    if (typeof window !== 'undefined') {
      const isOnline = (typeof navigator !== 'undefined' && typeof navigator.onLine === 'boolean') ? navigator.onLine : true;
      const errMsg = !isOnline 
        ? 'Perangkat Anda sedang offline. Mohon periksa sambungan internet.' 
        : `Koneksi jaringan bermasalah saat memproses ${action}.`;
      if (typeof window.showToast === 'function') {
        window.showToast(errMsg, 'error');
      } else if (typeof showToast === 'function') {
        showToast(errMsg, 'error');
      }
    }
    throw error;
  } finally {
    hideLoading();
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
 * @param {string} fileName Nama berkas lengkap beserta ekstensi (misal: 'dokumen.pdf')
 * @param {string} folderKey Kunci folder tujuan ('arsip', 'keuangan', 'kwitansi', 'general')
 */
async function uploadFile(base64Data, fileName, folderKey = 'general') {
  return await callBackend('uploadFile', { base64Data, fileName, folderKey });
}

/**
 * Mengonversi Objek File dari Input Form menjadi Base64 String
 * @param {File} file Objek file HTML5
 * @returns {Promise<string>} String Base64 tanpa header data:[mime];base64,
 */
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result.split(',')[1];
      resolve(base64String);
    };
    reader.onerror = error => reject(error);
    reader.readAsDataURL(file);
  });
}

/**
 * Mengirim notifikasi penagihan iuran / safari via OneSignal & WhatsApp
 * @param {string} targetUserId ID Anggota tujuan (contoh: 'MQ12-2026-001')
 * @param {string} judul Judul notifikasi
 * @param {string} pesan Isi pesan penagihan
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
 * Mengambil daftar seluruh role dan matriks hak akses dari backend
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

/**
 * Mengimpor data massal (bulk import) dari Excel/CSV ke Google Sheets
 * @param {string} modul Nama modul ('KEUANGAN' atau 'FINANCE')
 * @param {Array<object>} data Array baris objek data transaksi
 */
async function bulkImport(modul, data) {
  return await callBackend('bulkImport', { modul, data });
}

// Ekspor ke window global untuk ketersediaan di peramban
if (typeof window !== 'undefined') {
  window.API_URL = API_URL;
  window.getSessionToken = getSessionToken;
  window.showLoading = showLoading;
  window.hideLoading = hideLoading;
  window.callBackend = callBackend;
  window.callApi = callBackend;
  window.saveRecord = saveRecord;
  window.uploadFile = uploadFile;
  window.fileToBase64 = fileToBase64;
  window.kirimNotifikasiTagihan = kirimNotifikasiTagihan;
  window.getRoles = getRoles;
  window.updateRolePermissions = updateRolePermissions;
  window.bulkImport = bulkImport;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    API_URL,
    showLoading,
    hideLoading,
    callBackend,
    callApi: callBackend,
    saveRecord,
    uploadFile,
    fileToBase64,
    kirimNotifikasiTagihan,
    getRoles,
    updateRolePermissions,
    bulkImport
  };
}
