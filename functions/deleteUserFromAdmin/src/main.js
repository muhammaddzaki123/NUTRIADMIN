const sdk = require('node-appwrite');

/*
  Fungsi ini menerima satu objek 'context'
  dan kita mengambil apa yang kita butuhkan darinya (req, res, log, error).
*/
module.exports = async function ({ req, res, log, error }) {
  const client = new sdk.Client();

  // Validasi variabel environment (tidak ada perubahan)
  if (
    !process.env.APPWRITE_ENDPOINT ||
    !process.env.APPWRITE_PROJECT_ID ||
    !process.env.APPWRITE_API_KEY
  ) {
    error("Kesalahan Konfigurasi: Variabel environment fungsi belum diatur.");
    return res.json({ success: false, message: "Konfigurasi server fungsi tidak lengkap." }, 500);
  }

  // Konfigurasi client SDK (tidak ada perubahan)
  client
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

  const users = new sdk.Users(client);

  try {
    // DIUBAH: Gunakan req.body, bukan req.payload
    const payload = JSON.parse(req.body ?? '{}');
    const userIdToDelete = payload.userId;

    if (!userIdToDelete) {
      // Baris ini yang sebelumnya menyebabkan error
      throw new Error('userId wajib disertakan dalam payload request.');
    }

    // Perintah hapus pengguna (tidak ada perubahan)
    await users.delete(userIdToDelete);

    log(`SUKSES: Akun pengguna dengan ID ${userIdToDelete} berhasil dihapus.`);

    return res.json({
      success: true,
      message: `Akun pengguna ${userIdToDelete} berhasil dihapus.`
    });

  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'Terjadi kesalahan internal pada server.';
    error("ERROR saat menghapus pengguna:", errorMessage);
    
    return res.json({
      success: false,
      message: errorMessage
    }, 500);
  }
};
