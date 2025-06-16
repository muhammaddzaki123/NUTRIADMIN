// app/(admin)/manage-articles/create.tsx

import { publishNewArticle } from '@/lib/appwrite';
import { useGlobalContext } from '@/lib/global-provider';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
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
  View,
} from 'react-native';

const CreateArticleScreen = () => {
  const router = useRouter();
  const { admin } = useGlobalContext();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State untuk form, disesuaikan dengan struktur baru
  const [form, setForm] = useState({
    title: '',
    imageUrl: '',
    content: '',
    category: 'nutrisi', // Nilai default
    tags: '',
    isPublished: true, // Defaultnya langsung terbit
  });

  const categories = ['nutrisi', 'diet', 'kesehatan', 'hipertensi', 'diabetes', 'kanker'];

  const handlePublish = async () => {
    if (!form.title || !form.content || !form.category) {
      Alert.alert("Input Tidak Lengkap", "Judul, Konten, dan Kategori wajib diisi.");
      return;
    }
    if (!admin) {
      Alert.alert("Error", "Sesi admin tidak ditemukan.");
      return;
    }

    setIsSubmitting(true);
    try {
      await publishNewArticle({
        ...form,
        author: admin.name,
        tags: form.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      });

      Alert.alert("Sukses!", "Artikel berhasil dipublikasikan.", [{ text: "OK", onPress: () => router.back() }]);
    } catch (error: any) {
      Alert.alert("Error", `Gagal mempublikasikan: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <Ionicons name="close" size={28} color="#333" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-800">Artikel Baru</Text>
        <TouchableOpacity onPress={handlePublish} disabled={isSubmitting} className="p-2">
          {isSubmitting ? <ActivityIndicator color="#0BBEBB" /> : <Ionicons name="checkmark-done" size={28} color="#0BBEBB" />}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <View className="space-y-5">
          {/* Judul Artikel */}
          <View>
            <Text className="text-base text-gray-600 mb-2">Judul</Text>
            <TextInput value={form.title} onChangeText={(e) => setForm({ ...form, title: e })} placeholder="Judul artikel" className="border border-gray-300 p-4 rounded-xl text-base" />
          </View>

          {/* URL Gambar */}
          <View>
            <Text className="text-base text-gray-600 mb-2">URL Gambar</Text>
            <TextInput value={form.imageUrl} onChangeText={(e) => setForm({ ...form, imageUrl: e })} placeholder="https://example.com/image.jpg" className="border border-gray-300 p-4 rounded-xl text-base" />
          </View>

          {/* Konten Utama */}
          <View>
            <Text className="text-base text-gray-600 mb-2">Konten</Text>
            <TextInput value={form.content} onChangeText={(e) => setForm({ ...form, content: e })} placeholder="Isi lengkap artikel..." multiline className="border border-gray-300 p-4 rounded-xl text-base h-48" style={{ textAlignVertical: 'top' }} />
          </View>
          
          {/* Kategori */}
          <View>
            <Text className="text-base text-gray-600 mb-2">Kategori</Text>
            <View className="border border-gray-300 rounded-xl">
              <Picker selectedValue={form.category} onValueChange={(val) => setForm({ ...form, category: val })} style={{ height: 56 }}>
                {categories.map((cat) => <Picker.Item key={cat} label={cat.charAt(0).toUpperCase() + cat.slice(1)} value={cat} />)}
              </Picker>
            </View>
          </View>

          {/* Tags */}
          <View>
            <Text className="text-base text-gray-600 mb-2">Tags (pisahkan dengan koma)</Text>
            <TextInput value={form.tags} onChangeText={(e) => setForm({ ...form, tags: e })} placeholder="diet, sehat, olahraga" className="border border-gray-300 p-4 rounded-xl text-base" />
          </View>

          {/* Tombol Publikasi */}
          <TouchableOpacity onPress={handlePublish} disabled={isSubmitting} className={`py-4 rounded-xl items-center mt-4 ${isSubmitting ? 'bg-gray-400' : 'bg-primary-500'}`}>
            <Text className="text-white font-bold text-lg">{isSubmitting ? 'Mempublikasikan...' : 'Publikasikan'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateArticleScreen;