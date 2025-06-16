// app/(admin)/manage-articles/create.tsx

import { publishNewArticle } from '@/lib/appwrite';
import { useGlobalContext } from '@/lib/global-provider';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

const CreateArticleScreen = () => {
  const router = useRouter();
  const { admin } = useGlobalContext();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State untuk setiap field dalam form
  const [form, setForm] = useState({
    title: '',
    description: '',
    content: '',
    category: '',
    tags: '',
  });

  const handlePublish = async () => {
    // Validasi input
    if (!form.title || !form.content || !form.category) {
      Alert.alert("Input Tidak Lengkap", "Judul, Konten, dan Kategori wajib diisi.");
      return;
    }

    if (!admin) {
      Alert.alert("Error", "Sesi admin tidak ditemukan. Silakan login kembali.");
      return;
    }

    setIsSubmitting(true);
    try {
      await publishNewArticle({
        ...form,
        author: admin.name, // Menggunakan nama admin yang login sebagai penulis
        tags: form.tags.split(',').map(tag => tag.trim()).filter(tag => tag), // Mengubah string tags menjadi array
      });

      Alert.alert(
        "Sukses!",
        "Artikel berhasil dipublikasikan dan notifikasi telah dikirim ke pengguna.",
        [{ text: "OK", onPress: () => router.back() }] // Kembali ke halaman daftar setelah berhasil
      );

    } catch (error: any) {
      console.error("Gagal mempublikasikan artikel:", error);
      Alert.alert("Error", `Gagal mempublikasikan artikel: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header Halaman */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <Ionicons name="close" size={28} color="#333" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-800">Artikel Baru</Text>
        <TouchableOpacity
          onPress={handlePublish}
          disabled={isSubmitting}
          className="p-2"
        >
          {isSubmitting ? (
            <ActivityIndicator color="#0BBEBB" />
          ) : (
            <Ionicons name="checkmark-done" size={28} color="#0BBEBB" />
          )}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <View className="space-y-6">
          {/* Judul Artikel */}
          <View>
            <Text className="text-base text-gray-600 mb-2">Judul Artikel</Text>
            <TextInput
              value={form.title}
              onChangeText={(e) => setForm({ ...form, title: e })}
              placeholder="Contoh: Manfaat Sarapan Pagi untuk Kesehatan"
              className="border border-gray-300 p-4 rounded-xl text-base"
            />
          </View>

          {/* Deskripsi Singkat */}
          <View>
            <Text className="text-base text-gray-600 mb-2">Deskripsi Singkat</Text>
            <TextInput
              value={form.description}
              onChangeText={(e) => setForm({ ...form, description: e })}
              placeholder="Ringkasan singkat dari isi artikel"
              multiline
              className="border border-gray-300 p-4 rounded-xl text-base h-24"
              style={{ textAlignVertical: 'top' }}
            />
          </View>

          {/* Konten Utama */}
          <View>
            <Text className="text-base text-gray-600 mb-2">Konten Utama</Text>
            <TextInput
              value={form.content}
              onChangeText={(e) => setForm({ ...form, content: e })}
              placeholder="Tulis isi lengkap artikel di sini..."
              multiline
              className="border border-gray-300 p-4 rounded-xl text-base h-48"
              style={{ textAlignVertical: 'top' }}
            />
          </View>
          
          {/* Kategori */}
          <View>
            <Text className="text-base text-gray-600 mb-2">Kategori</Text>
            <TextInput
              value={form.category}
              onChangeText={(e) => setForm({ ...form, category: e })}
              placeholder="Contoh: Diabetes, Hipertensi, Nutrisi"
              className="border border-gray-300 p-4 rounded-xl text-base"
            />
          </View>

          {/* Tags */}
          <View>
            <Text className="text-base text-gray-600 mb-2">Tags (pisahkan dengan koma)</Text>
            <TextInput
              value={form.tags}
              onChangeText={(e) => setForm({ ...form, tags: e })}
              placeholder="Contoh: diet, sehat, olahraga"
              className="border border-gray-300 p-4 rounded-xl text-base"
            />
          </View>

          {/* Tombol Publikasi (Opsi kedua di bawah form) */}
          <TouchableOpacity
            onPress={handlePublish}
            disabled={isSubmitting}
            className={`py-4 rounded-xl items-center ${isSubmitting ? 'bg-gray-400' : 'bg-primary-500'}`}
          >
            <Text className="text-white font-bold text-lg">
              {isSubmitting ? 'Mempublikasikan...' : 'Publikasikan'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateArticleScreen;