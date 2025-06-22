const sdk = require('node-appwrite');

module.exports = async function (req, res) {
  const client = new sdk.Client();

  if (!process.env.APPWRITE_ENDPOINT || !process.env.APPWRITE_PROJECT_ID || !process.env.APPWRITE_API_KEY) {
    console.error("Kesalahan Konfigurasi: Variabel environment fungsi belum diatur.");
    return res.json({ success: false, message: "Konfigurasi server fungsi tidak lengkap." }, 500);
  }

  client
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

  const users = new sdk.Users(client);

  try {
    const payload = JSON.parse(req.payload ?? '{}');
    const userIdToDelete = payload.userId;

    if (!userIdToDelete) {
      throw new Error('userId wajib disertakan dalam payload request.');
    }

    await users.delete(userIdToDelete);
    console.log(`SUKSES: Akun pengguna dengan ID ${userIdToDelete} berhasil dihapus.`);

    res.json({
      success: true,
      message: `Akun pengguna ${userIdToDelete} berhasil dihapus.`
    });
  } catch (e) {
    console.error("ERROR saat menghapus pengguna:", e);
    res.json({
      success: false,
      message: e.message || 'Terjadi kesalahan internal pada server.'
    }, 500);
  }
};