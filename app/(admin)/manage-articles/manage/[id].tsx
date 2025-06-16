// app/(admin)/manage-articles/[id].tsx

import { getArticleById, databases, config } from '@/lib/appwrite'; // Tambahkan 'databases' dan 'config'
import { useAppwrite } from '@/lib/useAppwrite';
import { Article } from '@/types/article';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const EditArticleScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>(); // Mengambil ID dari URL
  
  // State untuk data form, diinisialisasi kosong
  const [form, setForm] = useState({
    title: '',
    description: '',
    content: '',
    category: '',
    tags: '',
  });
  
  // State untuk loading dan submitting
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mengambil data artikel berdasarkan ID saat halaman dimuat
  useEffect(() => {
    const fetchArticle = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const articleData = await getArticleById(id) as Article;
        if (articleData) {
          setForm({
            title: articleData.title,
            description: articleData.description,
            content: articleData.content,
            category: articleData.category,
            tags: articleData.tags.join(', '), // Ubah array menjadi string untuk input
          });
        }
      } catch (error) {
        Alert.alert("Error", "Gagal memuat data artikel.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchArticle();
  }, [id]);

  const handleUpdate = async () => {
    if (!form.title || !form.content || !form.category) {
      Alert.alert("Input Tidak Lengkap", "Judul, Konten, dan Kategori wajib diisi.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Data yang akan diupdate
      const updateData = {
        ...form,
        tags: form.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      };

      await databases.updateDocument(
        config.databaseId!,
        config.artikelCollectionId!,
        id!,
        updateData
      );

      Alert.alert(
        "Sukses!",
        "Artikel berhasil diperbarui.",
        [{ text: "OK", onPress: () => router.back() }]
      );

    } catch (error: any) {
      console.error("Gagal memperbarui artikel:", error);
      Alert.alert("Error", `Gagal memperbarui artikel: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0BBEBB" />
        <Text>Memuat data artikel...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header Halaman */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <Ionicons name="close" size={28} color="#333" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-800">Edit Artikel</Text>
        <TouchableOpacity
          onPress={handleUpdate}
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
        {/* Formnya sama persis dengan halaman 'create' */}
        <View className="space-y-6">
          <View>
            <Text className="text-base text-gray-600 mb-2">Judul Artikel</Text>
            <TextInput
              value={form.title}
              onChangeText={(e) => setForm({ ...form, title: e })}
              className="border border-gray-300 p-4 rounded-xl text-base"
            />
          </View>
          <View>
            <Text className="text-base text-gray-600 mb-2">Deskripsi Singkat</Text>
            <TextInput
              value={form.description}
              onChangeText={(e) => setForm({ ...form, description: e })}
              multiline
              className="border border-gray-300 p-4 rounded-xl text-base h-24"
              style={{ textAlignVertical: 'top' }}
            />
          </View>
          <View>
            <Text className="text-base text-gray-600 mb-2">Konten Utama</Text>
            <TextInput
              value={form.content}
              onChangeText={(e) => setForm({ ...form, content: e })}
              multiline
              className="border border-gray-300 p-4 rounded-xl text-base h-48"
              style={{ textAlignVertical: 'top' }}
            />
          </View>
          <View>
            <Text className="text-base text-gray-600 mb-2">Kategori</Text>
            <TextInput
              value={form.category}
              onChangeText={(e) => setForm({ ...form, category: e })}
              className="border border-gray-300 p-4 rounded-xl text-base"
            />
          </View>
          <View>
            <Text className="text-base text-gray-600 mb-2">Tags (pisahkan dengan koma)</Text>
            <TextInput
              value={form.tags}
              onChangeText={(e) => setForm({ ...form, tags: e })}
              className="border border-gray-300 p-4 rounded-xl text-base"
            />
          </View>
          <TouchableOpacity
            onPress={handleUpdate}
            disabled={isSubmitting}
            className={`py-4 rounded-xl items-center ${isSubmitting ? 'bg-gray-400' : 'bg-primary-500'}`}
          >
            <Text className="text-white font-bold text-lg">
              {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditArticleScreen;