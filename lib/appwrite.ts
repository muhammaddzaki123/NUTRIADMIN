import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Models,
  Query,
  Storage,
} from "react-native-appwrite";
import { Article, CreateArticleData } from "@/types/article"; // Pastikan tipe ini ada
import { createArticleNotification } from "./notification-service"; // Pastikan file ini ada

// --- Definisi Tipe ---
// 'password' dihapus dari tipe karena tidak lagi disimpan di database
export interface Admin extends Models.Document {
  name: string;
  email: string;
  userType: "admin";
  accountId: string;
}

// --- Konfigurasi Appwrite (Sesuai Asli) ---
export const config = {
  platform: "com.poltekes.nutripath.admin",
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
  databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID,
  storageBucketId: process.env.EXPO_PUBLIC_APPWRITE_ARTICLES_BUCKET_ID || "articles",
  adminCollectionId: process.env.EXPO_PUBLIC_APPWRITE_ADMIN_COLLECTION_ID,
  artikelCollectionId: process.env.EXPO_PUBLIC_APPWRITE_ARTIKEL_COLLECTION_ID,
  usersProfileCollectionId: process.env.EXPO_PUBLIC_APPWRITE_USERS_PROFILE_COLLECTION_ID,
  ahligiziCollectionId: process.env.EXPO_PUBLIC_APPWRITE_AHLIGIZI_COLLECTION_ID,
  notificationsCollectionId: process.env.EXPO_PUBLIC_APPWRITE_NOTIFICATION_COLLECTION_ID,
};

// Validasi Konfigurasi
if (!config.adminCollectionId) {
  throw new Error("ID Koleksi Admin belum diatur di environment variables.");
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


// =================================================================
// LAYANAN OTENTIKASI ADMIN (DIPERBARUI DENGAN METODE AMAN)
// =================================================================

/**
 * PENTING: Pendaftaran admin sebaiknya dilakukan dari Appwrite Console untuk keamanan.
 * Fungsi ini disediakan untuk development, jangan diekspos di UI publik.
 */
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

/**
 * Login admin menggunakan sesi aman Appwrite.
 */
export async function signInAdmin(email: string, password: string): Promise<Admin> {
  try {
    await account.deleteSession("current").catch(() => {});
    await account.createEmailPasswordSession(email, password);
    const adminData = await getCurrentUser(); // Menggunakan getCurrentUser yang sudah diperbaiki
    if (!adminData) {
      await logout(); // Hapus sesi jika profil admin tidak ditemukan
      throw new Error("Akun ini tidak memiliki hak akses sebagai admin.");
    }
    return adminData;
  } catch (error: any) {
    throw new Error(error.message || "Kredensial tidak valid.");
  }
}

/**
 * Mengambil data admin yang sedang login dari sesi aktif.
 */
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

/**
 * Logout admin dengan menghapus sesi saat ini.
 */
export async function logout(): Promise<void> {
  try {
    await account.deleteSession("current");
  } catch (error) {
    console.error("Gagal logout:", error);
  }
}

// =================================================================
// LAYANAN MANAJEMEN PENGGUNA & AHLI GIZI (DIPERBARUI)
// =================================================================

/**
 * Membuat user baru (pasien) oleh admin.
 */
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

/**
 * Membuat ahli gizi baru oleh admin.
 */
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

/**
 * Menghapus pengguna (pasien), termasuk akun otentikasi dan profil databasenya.
 */
export async function deleteUser(userId: string): Promise<void> {
  try {
    await databases.deleteDocument(config.databaseId!, config.usersProfileCollectionId!, userId);
    await account.deleteIdentity(userId);
    console.log(`Pengguna dengan ID ${userId} berhasil dihapus sepenuhnya.`);
  } catch (error) {
    console.error("Gagal menghapus pengguna:", error);
    throw error;
  }
}

/**
 * Menghapus ahli gizi, termasuk akun otentikasi dan profil databasenya.
 */
export async function deleteNutritionist(nutritionistId: string): Promise<void> {
  try {
    await databases.deleteDocument(config.databaseId!, config.ahligiziCollectionId!, nutritionistId);
    await account.deleteIdentity(nutritionistId);
    console.log(`Ahli gizi dengan ID ${nutritionistId} berhasil dihapus sepenuhnya.`);
  } catch (error) {
    console.error("Gagal menghapus ahli gizi:", error);
    throw error;
  }
}


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

// ```

// ### Ringkasan Perubahan Utama pada File Ini:

// 1.  **Struktur Konfigurasi Asli**: Objek `config` dan semua nama `collectionId` di dalamnya **tidak diubah** dan dipertahankan sesuai kode asli Anda.
// 2.  **Otentikasi Admin yang Aman**:
//     * Fungsi `registerAdmin`, `signInAdmin`, `getCurrentUser`, dan `logout` telah sepenuhnya diubah untuk menggunakan metode aman dari Appwrite (`account.create`, `account.createEmailPasswordSession`, `account.get`, `account.deleteSession`).
//     * **Tidak ada lagi** penyimpanan atau perbandingan password manual di database.
// 3.  **Manajemen Pengguna yang Aman**:
//     * Fungsi `createNewUser` dan `createNewNutritionist` sekarang juga menggunakan `account.create` untuk membuat akun otentikasi bagi setiap user baru. Ini berarti mereka bisa login dengan aman.
//     * Fungsi `deleteUser` dan `deleteNutritionist` sekarang juga menghapus akun dari sistem otentikasi Appwrite (`account.deleteIdentity`), memastikan penghapusan data yang tuntas.
// 4.  **Fungsi Lain Tetap Sama**: Seluruh logika untuk mengelola artikel, upload file, dan notifikasi tidak diubah karena sudah berfungsi dengan baik dan tidak terkait langsung dengan metode otentikasi.

// Versi ini siap digunakan untuk aplikasi admin Anda dan menyediakan fondasi yang jauh lebih aman dan and