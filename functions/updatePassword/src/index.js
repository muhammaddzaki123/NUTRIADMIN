const sdk = require('node-appwrite');

module.exports = async function (req, res) {
  const client = new sdk.Client();
  const users = new sdk.Users(client);

  const { APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID, APPWRITE_API_KEY } = req.variables;

  if (!APPWRITE_API_KEY || !APPWRITE_ENDPOINT || !APPWRITE_PROJECT_ID) {
    console.error("Kesalahan Konfigurasi: Variabel environment fungsi belum diatur.");
    return res.json({ success: false, message: "Konfigurasi server fungsi tidak lengkap." }, 500);
  }

  client
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT_ID)
    .setKey(APPWRITE_API_KEY);

  try {
    const payload = JSON.parse(req.payload ?? '{}');
    const { userId, password } = payload;

    if (!userId || !password) {
      throw new Error('userId dan password wajib disertakan dalam payload request.');
    }

    if (password.length < 8) {
        throw new Error('Password harus terdiri dari minimal 8 karakter.');
    }

    await users.updatePassword(userId, password);

    console.log(`SUKSES: Password untuk pengguna dengan ID ${userId} berhasil diperbarui.`);

    return res.json({
      success: true,
      message: `Password untuk pengguna ${userId} berhasil diperbarui.`
    });

  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'Terjadi kesalahan internal pada server.';
    console.error("ERROR saat memperbarui password:", errorMessage);

    return res.json({
      success: false,
      message: errorMessage
    }, 500);
  }
};