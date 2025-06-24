// functions/updatePassword/src/index.js
const sdk = require('node-appwrite');

/*
  'req' berisi payload dari client dan variabel environment.
  'res' digunakan untuk mengirim kembali respons ke client.
*/
module.exports = async function (req, res) {
  const client = new sdk.Client();
  const users = new sdk.Users(client);

  // Ambil variabel environment yang akan kita atur di konsol Appwrite.
  const { APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID, APPWRITE_API_KEY } = req.variables;

  // Validasi bahwa semua variabel environment sudah ada.
  if (!APPWRITE_API_KEY || !APPWRITE_ENDPOINT || !APPWRITE_PROJECT_ID) {
    console.error("Kesalahan Konfigurasi: Variabel environment fungsi belum diatur.");
    return res.json({ success: false, message: "Konfigurasi server fungsi tidak lengkap." }, 500);
  }

  // Inisialisasi client Appwrite dengan kunci API admin.
  client
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT_ID)
    .setKey(APPWRITE_API_KEY);

  try {
    // Ambil data (userId dan password baru) dari payload request yang dikirim dari aplikasi admin.
    const payload = JSON.parse(req.payload ?? '{}');
    const { userId, password } = payload;

    // Validasi input.
    if (!userId || !password) {
      throw new Error('userId dan password wajib disertakan dalam payload request.');
    }
    
    if (password.length < 8) {
      throw new Error('Password harus terdiri dari minimal 8 karakter.');
    }

    // Gunakan Appwrite Node SDK untuk memperbarui password pengguna.
    await users.updatePassword(userId, password);

    console.log(`SUKSES: Password untuk pengguna dengan ID ${userId} berhasil diperbarui.`);

    // Kirim respons sukses kembali ke aplikasi admin.
    return res.json({
      success: true,
      message: `Password untuk pengguna ${userId} berhasil diperbarui.`
    });

  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'Terjadi kesalahan internal pada server.';
    console.error("ERROR saat memperbarui password:", errorMessage);
    
    // Kirim respons error jika terjadi kesalahan.
    return res.json({
      success: false,
      message: errorMessage
    }, 500);
  }
};