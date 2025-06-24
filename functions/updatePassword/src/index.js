// functions/updatePassword/src/index.js

const sdk = require('node-appwrite');

// Tanda tangan (signature) fungsi modern menggunakan satu objek konteks
module.exports = async ({ req, res, log, error }) => {
  const client = new sdk.Client();

  // --- PERBAIKAN UTAMA ---
  // Ambil variabel dari process.env, BUKAN req.variables
  const { APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID, APPWRITE_API_KEY } = process.env;

  // Validasi variabel environment
  if (!APPWRITE_API_KEY || !APPWRITE_ENDPOINT || !APPWRITE_PROJECT_ID) {
    error("Kesalahan Konfigurasi: Variabel environment fungsi belum diatur.");
    return res.json({ success: false, message: "Konfigurasi server fungsi tidak lengkap." }, 500);
  }
  
  // Inisialisasi client
  client
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT_ID)
    .setKey(APPWRITE_API_KEY);

  const users = new sdk.Users(client);

  try {
    // Gunakan req.body untuk payload di runtime baru
    const payload = JSON.parse(req.body ?? '{}');
    const { userId, password } = payload;

    if (!userId || !password) {
      throw new Error('userId dan password wajib disertakan dalam payload request.');
    }
    
    if (password.length < 8) {
      throw new Error('Password harus terdiri dari minimal 8 karakter.');
    }

    await users.updatePassword(userId, password);

    // Gunakan fungsi log() dari konteks untuk logging yang lebih baik
    log(`SUKSES: Password untuk pengguna dengan ID ${userId} berhasil diperbarui.`);

    return res.json({
      success: true,
      message: `Password untuk pengguna ${userId} berhasil diperbarui.`
    });

  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'Terjadi kesalahan internal.';
    
    // Gunakan fungsi error() dari konteks
    error(`ERROR saat memperbarui password: ${errorMessage}`);
    
    return res.json({
      success: false,
      message: errorMessage
    }, 500);
  }
};