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
import { Article, CreateArticleData } from "@/types/article";

// --- Definisi Tipe ---
export interface Admin extends Models.Document {
  name: string;
  email: string;
  userType: "admin";
  accountId: string;
}

// --- Konfigurasi Appwrite ---
export const config = {
  platform: "com.gumisaq.admin",
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
  databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID,
  storageBucketId: process.env.EXPO_PUBLIC_APPWRITE_ARTICLES_BUCKET_ID || "articles",
  adminCollectionId: process.env.EXPO_PUBLIC_APPWRITE_ADMIN_COLLECTION_ID,
  artikelCollectionId: process.env.EXPO_PUBLIC_APPWRITE_ARTIKEL_COLLECTION_ID,
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
// LAYANAN OTENTIKASI ADMIN
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
// LAYANAN PENYIMPANAN (STORAGE)
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
// LAYANAN MANAJEMEN KONTEN (ARTIKEL)
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

    // Bagian notifikasi dihapus dari sini
    
    return newArticle;
  } catch (error) {
    console.error("Gagal mempublikasikan artikel:", error);
    throw error;
  }
}