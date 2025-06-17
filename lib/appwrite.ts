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
import { CreateArticleData, Article } from "@/types/article";
import { createArticleNotification } from "./notification-service";
import { hashPassword } from "./hash-service";

// --- DEFINISI TIPE ---
export interface Admin extends Models.Document {
  name: string;
  email: string;
  password?: string;
  userType: "admin";
}

// --- KONFIGURASI APPWRITE ---
export const config = {
  platform: "com.poltekes.nutripath.admin",
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
  databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID,
  storageBucketId: process.env.EXPO_PUBLIC_APPWRITE_STORAGE_BUCKET_ID || 'default',
  adminCollectionId: process.env.EXPO_PUBLIC_APPWRITE_ADMIN_COLLECTION_ID,
  artikelCollectionId: process.env.EXPO_PUBLIC_APPWRITE_ARTIKEL_COLLECTION_ID,
  usersProfileCollectionId: process.env.EXPO_PUBLIC_APPWRITE_USERS_PROFILE_COLLECTION_ID,
  ahligiziCollectionId: process.env.EXPO_PUBLIC_APPWRITE_AHLIGIZI_COLLECTION_ID,
  notificationsCollectionId: process.env.EXPO_PUBLIC_APPWRITE_NOTIFICATION_COLLECTION_ID,
};

if (!config.adminCollectionId || !config.storageBucketId) {
  throw new Error("ID Koleksi Admin atau ID Bucket Penyimpanan belum diatur di environment variables.");
}

// Inisialisasi Klien Appwrite
export const client = new Client()
  .setEndpoint(config.endpoint!)
  .setProject(config.projectId!)
  .setPlatform(config.platform!);

export const databases = new Databases(client);
export const storage = new Storage(client);
export const account = new Account(client);
export const avatar = new Avatars(client);

let currentAdmin: Admin | null = null;

// =================================================================
// LAYANAN OTENTIKASI ADMIN
// =================================================================

export async function registerAdmin(name: string, email: string, plainTextPassword: string): Promise<Models.Document> {
  try {
    const existingAdmins = await databases.listDocuments(config.databaseId!, config.adminCollectionId!, [Query.equal("email", email)]);
    if (existingAdmins.total > 0) throw new Error("Email ini sudah terdaftar.");
    const hashedPassword = hashPassword(plainTextPassword);
    return await databases.createDocument(config.databaseId!, config.adminCollectionId!, ID.unique(), { name, email, password: hashedPassword, userType: "admin" });
  } catch (error) {
    console.error("Gagal mendaftarkan admin:", error);
    throw error;
  }
}

export async function signInAdmin(email: string, plainTextPassword: string): Promise<Admin> {
  try {
    const hashedInputPassword = hashPassword(plainTextPassword);
    const adminUsers = await databases.listDocuments<Admin>(config.databaseId!, config.adminCollectionId!, [Query.equal("email", email)]);
    if (adminUsers.total === 0) throw new Error("Kredensial tidak valid.");
    const admin = adminUsers.documents[0];
    if (hashedInputPassword !== admin.password) throw new Error("Kredensial tidak valid.");
    currentAdmin = admin;
    return admin;
  } catch (error) {
    console.error("Login admin error:", error);
    throw error;
  }
}

export async function getCurrentUser(): Promise<Admin | null> {
  if (!currentAdmin) return null;
  try {
    currentAdmin = await databases.getDocument<Admin>(config.databaseId!, config.adminCollectionId!, currentAdmin.$id);
    return currentAdmin;
  } catch {
    currentAdmin = null;
    return null;
  }
}

export async function logout(): Promise<void> {
  currentAdmin = null;
}

// =================================================================
// LAYANAN MANAJEMEN PENGGUNA & AHLI GIZI
// =================================================================

export async function createNewUser(userData: { name: string; email: string; password: string; [key: string]: any }): Promise<Models.Document> {
  try {
    const hashedPassword = hashPassword(userData.password);
    return await databases.createDocument(config.databaseId!, config.usersProfileCollectionId!, ID.unique(), { ...userData, password: hashedPassword, userType: "user" });
  } catch (error) {
    console.error("Gagal membuat pengguna baru:", error);
    throw error;
  }
}

export async function createNewNutritionist(nutritionistData: { name: string; email: string; password: string; [key: string]: any }): Promise<Models.Document> {
  try {
    const hashedPassword = hashPassword(nutritionistData.password);
    return await databases.createDocument(config.databaseId!, config.ahligiziCollectionId!, ID.unique(), { ...nutritionistData, password: hashedPassword, userType: "nutritionist", status: "offline" });
  } catch (error) {
    console.error("Gagal membuat ahli gizi baru:", error);
    throw error;
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
    // Payload yang akan disimpan ke database.
    // Properti 'imageFile' tidak ikut disimpan.
    const articlePayload = {
        title: articleData.title,
        description: articleData.description || "",
        content: articleData.content,
        category: articleData.category,
        author: articleData.author,
        tags: articleData.tags,
        isPublished: articleData.isPublished,
        image: articleData.image, // Menggunakan properti 'image'
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
// FUNGSI HELPER (INTERNAL)
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
