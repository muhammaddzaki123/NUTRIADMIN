import { Article, CreateArticleData } from "@/types/article";
import {
  Account,
  Avatars,
  Client,
  Databases,
  Functions,
  ID,
  Models,
  Query,
  Storage,
} from "react-native-appwrite";
import { createArticleNotification } from "./notification-service";

// --- Definisi Tipe ---
export interface Admin extends Models.Document {
  name: string;
  email: string;
  userType: "admin";
  accountId: string;
}

// --- Konfigurasi Appwrite ---
export const config = {
  platform: "com.poltekes.nutripath.admin",
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
  databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID,
  storageBucketId:process.env.EXPO_PUBLIC_APPWRITE_ARTICLES_BUCKET_ID || "default",
  adminCollectionId: process.env.EXPO_PUBLIC_APPWRITE_ADMIN_COLLECTION_ID,
  artikelCollectionId: process.env.EXPO_PUBLIC_APPWRITE_ARTIKEL_COLLECTION_ID,
  usersProfileCollectionId:process.env.EXPO_PUBLIC_APPWRITE_USERS_PROFILE_COLLECTION_ID,
  ahligiziCollectionId:process.env.EXPO_PUBLIC_APPWRITE_AHLIGIZI_COLLECTION_ID,
  notificationsCollectionId:process.env.EXPO_PUBLIC_APPWRITE_NOTIFICATION_COLLECTION_ID,
  loginlogCollectionId:process.env.EXPO_PUBLIC_APPWRITE_LOGINLOG_COLLECTION_ID,
  
  //functions
  deleteUserFunctionId:process.env.EXPO_PUBLIC_APPWRITE_DELETE_USER_FUNCTION_ID,
  loginlogFunctionId:process.env.EXPO_PUBLIC_APPWRITE_LOGINLOG_FUNCTION_ID,
};

// Validasi Konfigurasi
if (!config.adminCollectionId) {
  throw new Error("ID Koleksi Admin (ADMIN_COLLECTION_ID) belum diatur di environment variables.");
}
if (!config.deleteUserFunctionId) {
    console.warn("PERINGATAN: 'DELETE_USER_FUNCTION_ID' belum diatur di environment variables. Fitur hapus pengguna tidak akan berfungsi.");
}

// Inisialisasi Klien Appwrite
export const client = new Client()
  .setEndpoint(config.endpoint!)
  .setProject(config.projectId!)
  .setPlatform(config.platform!);

export const databases = new Databases(client);
export const storage = new Storage(client);
export const account = new Account(client);
export const avatars = new Avatars(client);
export const functions = new Functions(client);

// =================================================================
// LAYANAN OTENTIKASI ADMIN (Tidak ada perubahan)
// =================================================================
export async function registerAdmin(name: string, email: string, password: string): Promise<Models.Document> {
  try {
    const newAccount = await account.create(ID.unique(), email, password, name);
    if (!newAccount) throw new Error("Gagal membuat akun admin.");

    return await databases.createDocument(
      config.databaseId!,
      config.adminCollectionId!,
      newAccount.$id,
      {
        name,
        email,
        userType: "admin",
        accountId: newAccount.$id,
      }
    );
  } catch (error) {
    console.error("Gagal mendaftarkan admin:", error);
    throw error;
  }
}

export async function signInAdmin(email: string, password: string): Promise<Admin> {
  try {
    await account.deleteSession("current").catch(() => {});
    await account.createEmailPasswordSession(email, password);
    const adminData = await getCurrentUser();
    if (!adminData) {
      await logout();
      throw new Error("Akun ini tidak memiliki hak akses sebagai admin.");
    }
    return adminData;
  } catch (error: any) {
    throw new Error(error.message || "Kredensial tidak valid.");
  }
}

export async function getCurrentUser(): Promise<Admin | null> {
  try {
    const currentAccount = await account.get();
    if (!currentAccount) return null;

    const adminProfile = await databases.getDocument<Admin>(
      config.databaseId!,
      config.adminCollectionId!,
      currentAccount.$id
    );
    return adminProfile;
  } catch (error) {
    return null;
  }
}

export async function logout(): Promise<void> {
  try {
    await account.deleteSession("current");
  } catch (error) {
    console.error("Gagal logout:", error);
  }
}

// =================================================================
// LAYANAN MANAJEMEN PENGGUNA & AHLI GIZI
// =================================================================
export async function createNewUser(userData: { name: string; email: string; password: string; [key: string]: any }): Promise<Models.Document> {
  try {
    const newAccount = await account.create(ID.unique(), userData.email, userData.password, userData.name);
    if (!newAccount) throw new Error("Gagal membuat akun pengguna.");
    
    const { password, ...profileData } = userData;

    return await databases.createDocument(config.databaseId!, config.usersProfileCollectionId!, newAccount.$id, {
      ...profileData,
      accountId: newAccount.$id,
      userType: "user"
    });
  } catch (error) {
    console.error("Gagal membuat pengguna baru:", error);
    throw error;
  }
}

export async function createNewNutritionist(nutritionistData: { name: string; email: string; password: string; [key: string]: any }): Promise<Models.Document> {
  try {
    const newAccount = await account.create(ID.unique(), nutritionistData.email, nutritionistData.password, nutritionistData.name);
    if (!newAccount) throw new Error("Gagal membuat akun ahli gizi.");

    const { password, ...profileData } = nutritionistData;
    
    return await databases.createDocument(config.databaseId!, config.ahligiziCollectionId!, newAccount.$id, {
      ...profileData,
      accountId: newAccount.$id,
      userType: "nutritionist",
      status: "offline"
    });
  } catch (error) {
    console.error("Gagal membuat ahli gizi baru:", error);
    throw error;
  }
}

//delete User & Nutritionist
export async function deleteUser(userId: string): Promise<void> {
  try {
    if (!config.deleteUserFunctionId) {
        throw new Error("ID Fungsi untuk menghapus pengguna tidak dikonfigurasi.");
    }
    await databases.deleteDocument(config.databaseId!, config.usersProfileCollectionId!, userId);
    await functions.createExecution(
      config.deleteUserFunctionId,
      JSON.stringify({ userId: userId }),
      false
    );
    
    console.log(`Permintaan penghapusan untuk pengguna ID ${userId} berhasil dikirim.`);
  } catch (error) {
    console.error("Gagal menghapus pengguna:", error);
    throw error;
  }
}

export async function deleteNutritionist(nutritionistId: string): Promise<void> {
  try {
    if (!config.deleteUserFunctionId) {
        throw new Error("ID Fungsi untuk menghapus pengguna tidak dikonfigurasi.");
    }
    await databases.deleteDocument(config.databaseId!, config.ahligiziCollectionId!, nutritionistId);
    await functions.createExecution(
      config.deleteUserFunctionId,
      JSON.stringify({ userId: nutritionistId }), 
      false
    );

    console.log(`Permintaan penghapusan untuk ahli gizi ID ${nutritionistId} berhasil dikirim.`);
  } catch (error) {
    console.error("Gagal menghapus ahli gizi:", error);
    throw error;
  }
}
//delete User & Nutritionist sampe sini

// =================================================================
// LAYANAN PENYIMPANAN (STORAGE) - TIDAK ADA PERUBAHAN
// =================================================================
export async function uploadFile(file: any, bucketId: string): Promise<Models.File> {
  try {
      return await storage.createFile(bucketId, ID.unique(), file);
  } catch (error) {
      throw new Error(`Gagal mengunggah file: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export function getFilePreview(bucketId: string, fileId: string): URL {
  return storage.getFileView(bucketId, fileId);
}

async function deleteFileByUrl(fileUrl: string) {
  try {
      const fileId = fileUrl.split("/files/")[1].split("/view")[0];
      await storage.deleteFile(config.storageBucketId!, fileId);
      console.log(`File dengan ID ${fileId} berhasil dihapus.`);
  } catch (error) {
      console.warn(`Gagal menghapus file lama dari storage: ${error}`);
  }
}

// =================================================================
// LAYANAN MANAJEMEN KONTEN (ARTIKEL) - TIDAK ADA PERUBAHAN
// =================================================================
export async function getArticles(): Promise<Article[]> {
  try {
    const response = await databases.listDocuments<Article>(config.databaseId!, config.artikelCollectionId!, [Query.orderDesc("$createdAt")]);
    return response.documents;
  } catch (error) {
    console.error("Gagal mengambil artikel:", error);
    throw error;
  }
}

export async function getArticleById(articleId: string): Promise<Article> {
  try {
    return await databases.getDocument<Article>(config.databaseId!, config.artikelCollectionId!, articleId);
  } catch (error) {
    console.error(`Gagal mengambil artikel dengan ID: ${articleId}`, error);
    throw error;
  }
}

export async function deleteArticle(articleId: string, image: string) {
  try {
    await databases.deleteDocument(config.databaseId!, config.artikelCollectionId!, articleId);
    if (image) {
      await deleteFileByUrl(image);
    }
  } catch (error) {
    console.error("Gagal menghapus artikel:", error);
    throw error;
  }
}

export async function updateArticle(articleId: string, updateData: Partial<CreateArticleData>) {
  try {
    let finalImage = updateData.image;

    if (updateData.imageFile) {
      const oldArticle = await getArticleById(articleId);
      const uploadedFile = await uploadFile(updateData.imageFile, config.storageBucketId!);
      finalImage = getFilePreview(config.storageBucketId!, uploadedFile.$id).href;
      if (oldArticle.image) {
        await deleteFileByUrl(oldArticle.image);
      }
    }
    
    const { imageFile, ...payload } = { ...updateData, image: finalImage };

    await databases.updateDocument(
      config.databaseId!,
      config.artikelCollectionId!,
      articleId,
      payload
    );
  } catch (error) {
    console.error("Gagal memperbarui artikel:", error);
    throw error;
  }
}

export async function publishNewArticle(articleData: CreateArticleData): Promise<Models.Document> {
  try {
    const articlePayload = {
      title: articleData.title,
      description: articleData.description || "",
      content: articleData.content,
      category: articleData.category,
      author: articleData.author,
      tags: articleData.tags,
      isPublished: articleData.isPublished,
      image: articleData.image,
      viewCount: 0,
    };
    
    const newArticle = await databases.createDocument(
      config.databaseId!,
      config.artikelCollectionId!,
      ID.unique(),
      articlePayload
    );

    const allUserIds = await getAllUserAndNutritionistIds();
    if (allUserIds.length > 0) {
      await createArticleNotification(
        newArticle.$id,
        newArticle.title,
        articleData.description || "Artikel baru telah terbit!",
        allUserIds
      );
    }
    return newArticle;
  } catch (error) {
    console.error("Gagal mempublikasikan artikel:", error);
    throw error;
  }
}

// =================================================================
// FUNGSI HELPER (INTERNAL) - TIDAK ADA PERUBAHAN
// =================================================================
async function getAllUserAndNutritionistIds(): Promise<string[]> {
  try {
    const [users, nutritionists] = await Promise.all([
      databases.listDocuments(config.databaseId!, config.usersProfileCollectionId!, [Query.select(["$id"])]),
      databases.listDocuments(config.databaseId!, config.ahligiziCollectionId!, [Query.select(["$id"])]),
    ]);
    const userIds = users.documents.map((doc) => doc.$id);
    const nutritionistIds = nutritionists.documents.map((doc) => doc.$id);
    return [...new Set([...userIds, ...nutritionistIds])];
  } catch (error) {
    console.error("Error saat mengambil semua ID pengguna:", error);
    return [];
  }
}

// =================================================================
// LAYANAN LOGGING
// =================================================================
export async function getLoginLogs(): Promise<Models.Document[]> {
  try {
    if (!config.loginlogCollectionId) {
      throw new Error("ID Koleksi untuk Login Log belum diatur.");
    }

    const logs = await databases.listDocuments(
      config.databaseId!,
      config.loginlogCollectionId,
      [Query.orderDesc("$createdAt"), Query.limit(100)]
    );
    return logs.documents;
  } catch (error) {
    console.error("Gagal mengambil log login:", error);
    throw error;
  }
}

// =================================================================
// LAYANAN STATISTIK DASBOR
// =================================================================

/**
 * Mengambil jumlah total pengguna terdaftar.
 */
export async function getUsersCount(): Promise<number> {
  try {
    const response = await databases.listDocuments(
      config.databaseId!,
      config.usersProfileCollectionId!,
      [Query.limit(1)] // PERBAIKAN: Ubah dari 0 menjadi 1
    );
    return response.total;
  } catch (error) {
    console.error("Gagal mengambil jumlah pengguna:", error);
    throw new Error("Gagal mengambil data jumlah pengguna.");
  }
}

/**
 * Mengambil jumlah total artikel yang ada.
 */
export async function getArticlesCount(): Promise<number> {
  try {
    const response = await databases.listDocuments(
      config.databaseId!,
      config.artikelCollectionId!,
      [Query.limit(1)] // PERBAIKAN: Ubah dari 0 menjadi 1
    );
    return response.total;
  } catch (error) {
    console.error("Gagal mengambil jumlah artikel:", error);
    throw new Error("Gagal mengambil data jumlah artikel.");
  }
}

/**
 * Mengambil jumlah total ahli gizi terdaftar.
 */
export async function getNutritionistsCount(): Promise<number> {
  try {
    const response = await databases.listDocuments(
      config.databaseId!,
      config.ahligiziCollectionId!,
      [Query.limit(1)] // PERBAIKAN: Ubah dari 0 menjadi 1
    );
    return response.total;
  } catch (error) {
    console.error("Gagal mengambil jumlah ahli gizi:", error);
    throw new Error("Gagal mengambil data jumlah ahli gizi.");
  }
}

/**
 * Mengambil semua dokumen profil pengguna.
 */
export async function getAllUsers(): Promise<Models.Document[]> {
  try {
    const data = await databases.listDocuments(
      config.databaseId!,
      config.usersProfileCollectionId!,
      [Query.limit(5000)] // Atur batas yang cukup tinggi
    );
    return data.documents;
  } catch (error) {
    console.error("Gagal mengambil semua data pengguna:", error);
    throw error;
  }
}

/**
 * Mengambil semua dokumen artikel.
 */
export async function getAllArticles(): Promise<Models.Document[]> {
    try {
      const data = await databases.listDocuments(
        config.databaseId!,
        config.artikelCollectionId!,
        [Query.limit(5000)]
      );
      return data.documents;
    } catch (error) {
      console.error("Gagal mengambil semua data artikel:", error);
      throw error;
    }
  }
  
/**
 * Mengambil semua dokumen ahli gizi.
 */
export async function getAllNutritionists(): Promise<Models.Document[]> {
    try {
        const data = await databases.listDocuments(
        config.databaseId!,
        config.ahligiziCollectionId!,
        [Query.limit(5000)]
        );
        return data.documents;
    } catch (error) {
        console.error("Gagal mengambil semua data ahli gizi:", error);
        throw error;
    }
}

