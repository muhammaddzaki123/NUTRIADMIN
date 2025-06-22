const sdk = require('node-appwrite');

/*
  Payload yang diharapkan dari client:
  {
    "userId": "ID_PENGGUNA_YANG_AKAN_DIHAPUS"
  }
*/

module.exports = async function (req, res) {
  const client = new sdk.Client();

  // Validasi bahwa semua variabel environment yang dibutuhkan sudah diatur di Appwrite Console.
  if (
    !process.env.APPWRITE_ENDPOINT ||
    !process.env.APPWRITE_PROJECT_ID ||
    !process.env.APPWRITE_API_KEY
  ) {
    console.error("Kesalahan Konfigurasi: Variabel environment fungsi belum diatur.");
    return res.json({ success: false, message: "Konfigurasi server fungsi tidak lengkap." }, 500);
  }

  // Konfigurasi client SDK Node.js dengan variabel yang akan kita atur nanti.
  client
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

  const users = new sdk.Users(client);

  try {
    // Ambil payload yang dikirim dari aplikasi klien.
    const payload = JSON.parse(req.payload ?? '{}');
    const userIdToDelete = payload.userId;

    // Pastikan userId ada di dalam payload.
    if (!userIdToDelete) {
      throw new Error('userId wajib ada di dalam payload request.');
    }

    // Ini adalah perintah inti: menghapus pengguna berdasarkan ID.
    // Perintah ini hanya bisa dijalankan oleh SDK sisi server dengan API Key yang valid.
    await users.delete(userIdToDelete);

    console.log(`SUKSES: Akun pengguna dengan ID ${userIdToDelete} berhasil dihapus.`);

    // Kirim balasan sukses ke aplikasi klien.
    res.json({
      success: true,
      message: `Akun pengguna ${userIdToDelete} berhasil dihapus.`
    });

  } catch (e) {
    // Jika terjadi error, catat di log fungsi dan kirim pesan error ke klien.
    const errorMessage = e instanceof Error ? e.message : 'Terjadi kesalahan internal pada server.';
    console.error("ERROR saat menghapus pengguna:", errorMessage);
    res.json({
      success: false,
      message: errorMessage
    }, 500);
  }
};
