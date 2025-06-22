const sdk = require('node-appwrite');

/*
  Fungsi ini sekarang menerima satu objek 'context'
  dan kita mengambil apa yang kita butuhkan darinya (req, res, log, error).
*/
module.exports = async function ({ req, res, log, error }) {
  const client = new sdk.Client();

  // Validasi variabel environment (tidak ada perubahan di sini)
  if (
    !process.env.APPWRITE_ENDPOINT ||
    !process.env.APPWRITE_PROJECT_ID ||
    !process.env.APPWRITE_API_KEY
  ) {
    error("Kesalahan Konfigurasi: Variabel environment fungsi belum diatur.");
    return res.json({ success: false, message: "Konfigurasi server fungsi tidak lengkap." }, 500);
  }

  // Konfigurasi client SDK (tidak ada perubahan di sini)
  client
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

  const users = new sdk.Users(client);

  try {
    // Ambil payload (tidak ada perubahan di sini)
    const payload = JSON.parse(req.payload ?? '{}');
    const userIdToDelete = payload.userId;

    if (!userIdToDelete) {
      throw new Error('userId wajib disertakan dalam payload request.');
    }

    // Perintah hapus pengguna (tidak ada perubahan di sini)
    await users.delete(userIdToDelete);

    // Gunakan 'log' dari context untuk logging yang lebih baik
    log(`SUKSES: Akun pengguna dengan ID ${userIdToDelete} berhasil dihapus.`);

    // Kirim balasan sukses (tidak ada perubahan di sini)
    return res.json({
      success: true,
      message: `Akun pengguna ${userIdToDelete} berhasil dihapus.`
    });

  } catch (e) {
    // Gunakan 'error' dari context untuk logging error
    const errorMessage = e instanceof Error ? e.message : 'Terjadi kesalahan internal pada server.';
    error("ERROR saat menghapus pengguna:", errorMessage);
    
    // Kirim balasan error (tidak ada perubahan di sini)
    return res.json({
      success: false,
      message: errorMessage
    }, 500);
  }
};
