const sdk = require("node-appwrite");

module.exports = async function (req, res) {
  const client = new sdk.Client();
  const databases = new sdk.Databases(client);

  const {
    APPWRITE_ENDPOINT,
    APPWRITE_PROJECT_ID,
    APPWRITE_API_KEY,
    APPWRITE_DATABASE_ID,
    LOGS_COLLECTION_ID,
    USERS_COLLECTION_ID,
    NUTRITIONISTS_COLLECTION_ID
  } = req.variables;

  if (!APPWRITE_API_KEY) {
    return res.json({ success: false, message: "API Key belum diatur." }, 500);
  }

  client
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT_ID)
    .setKey(APPWRITE_API_KEY);

  try {
    const eventPayload = JSON.parse(req.payload);
    const userId = eventPayload.userId;

    let userDocument;
    let userType = '';

    try {
      userDocument = await databases.getDocument(APPWRITE_DATABASE_ID, USERS_COLLECTION_ID, userId);
      userType = 'user';
    } catch (e) {
      try {
        userDocument = await databases.getDocument(APPWRITE_DATABASE_ID, NUTRITIONISTS_COLLECTION_ID, userId);
        userType = 'nutritionist';
      } catch (err) {
        console.error(`User ID ${userId} tidak ditemukan.`);
        return res.json({ success: false, message: "Pengguna tidak ditemukan." }, 404);
      }
    }

    const logData = {
      userId: userDocument.$id,
      name: userDocument.name,
      email: userDocument.email,
      userType: userType,
      ip: eventPayload.ip,
      client: `${eventPayload.clientType} ${eventPayload.clientName} ${eventPayload.clientVersion}`,
      timestamp: new Date().toISOString()
    };

    await databases.createDocument(
      APPWRITE_DATABASE_ID,
      LOGS_COLLECTION_ID,
      sdk.ID.unique(),
      logData
    );

    res.json({ success: true, message: "Log berhasil dibuat." });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Terjadi kesalahan internal." }, 500);
  }
};