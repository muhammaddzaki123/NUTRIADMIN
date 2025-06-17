// app/(admin)/manage-articles/create.tsx

import { publishNewArticle, uploadFile, getFilePreview, config } from '@/lib/appwrite';
import { useGlobalContext } from '@/lib/global-provider';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import {
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Pastikan Picker diimpor
import { CreateArticleData } from '@/types/article'; // Impor tipe data


type ArticleCategory = CreateArticleData['category'];

const CreateArticleScreen = () => {
  const router = useRouter();
  const { admin } = useGlobalContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State untuk menampung data gambar yang dipilih
  const [imageAsset, setImageAsset] = useState<ImagePicker.ImagePickerAsset | null>(null);

  const [form, setForm] = useState({
    title: '',
    description: '',
    content: '',
    category: 'nutrisi' as ArticleCategory,
    tags: '',
  });

  const categories: ArticleCategory[] = ['nutrisi', 'diet', 'kesehatan', 'hipertensi', 'diabetes', 'kanker'];

  // Fungsi untuk membuka galeri gambar
  const pickImage = async () => {
    // Meminta izin akses ke galeri
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("Izin Diperlukan", "Anda perlu memberikan izin akses ke galeri untuk memilih gambar.");
      return;
    }
  
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.7, // Kompresi gambar untuk menghemat ukuran
    });

    if (!result.canceled) {
      setImageAsset(result.assets[0]);
    }
  };

  const handlePublish = async () => {
    // Validasi input
    if (!form.title || !form.content || !form.category) {
      Alert.alert("Input Tidak Lengkap", "Judul, Konten, dan Kategori wajib diisi.");
      return;
    }
    if (!imageAsset) {
      Alert.alert("Input Tidak Lengkap", "Silakan pilih gambar untuk artikel.");
      return;
    }
    if (!admin) {
      Alert.alert("Error", "Sesi admin tidak ditemukan. Silakan login kembali.");
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Siapkan file untuk diunggah ke Appwrite
      const fileToUpload = {
        name: imageAsset.fileName || `article_${Date.now()}.jpg`,
        type: imageAsset.mimeType,
        uri: imageAsset.uri,
        size: imageAsset.fileSize,
      };

      // 2. Unggah file dan dapatkan URL publiknya
      const uploadedFile = await uploadFile(fileToUpload, config.storageBucketId!);
      const image = getFilePreview(config.storageBucketId!, uploadedFile.$id).href;

      // 3. Panggil fungsi publishNewArticle dengan data lengkap, termasuk image
      await publishNewArticle({
        ...form,
        author: admin.name,
        tags: form.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        image: image, // Gunakan URL dari gambar yang baru diunggah
        isPublished: true,
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
      {/* Header Halaman */}
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
        <View className="space-y-6">
          {/* Image Picker */}
          <View>
            <Text className="text-base text-gray-600 mb-2">Gambar Utama Artikel</Text>
            <TouchableOpacity onPress={pickImage} className="border border-dashed border-gray-400 p-4 rounded-xl items-center justify-center h-48 bg-gray-50">
              {imageAsset ? (
                <Image source={{ uri: imageAsset.uri }} className="w-full h-full rounded-xl" resizeMode="cover" />
              ) : (
                <View className="items-center">
                  <Ionicons name="cloud-upload-outline" size={40} color="gray" />
                  <Text className="text-gray-500 mt-2">Ketuk untuk Pilih Gambar</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Judul Artikel */}
          <View>
            <Text className="text-base text-gray-600 mb-2">Judul Artikel</Text>
            <TextInput value={form.title} onChangeText={(e) => setForm({ ...form, title: e })} placeholder="Contoh: Manfaat Sarapan Pagi" className="border border-gray-300 p-4 rounded-xl text-base" />
          </View>

          {/* Deskripsi Singkat */}
          <View>
            <Text className="text-base text-gray-600 mb-2">Deskripsi Singkat</Text>
            <TextInput value={form.description} onChangeText={(e) => setForm({ ...form, description: e })} placeholder="Ringkasan singkat dari isi artikel" multiline className="border border-gray-300 p-4 rounded-xl text-base h-24" style={{ textAlignVertical: 'top' }} />
          </View>

          {/* Konten Utama */}
          <View>
            <Text className="text-base text-gray-600 mb-2">Konten Utama</Text>
            <TextInput value={form.content} onChangeText={(e) => setForm({ ...form, content: e })} placeholder="Tulis isi lengkap artikel di sini..." multiline className="border border-gray-300 p-4 rounded-xl text-base h-48" style={{ textAlignVertical: 'top' }} />
          </View>
          
          {/* Kategori */}
          <View>
            <Text className="text-base text-gray-600 mb-2">Kategori</Text>
            <View className="border border-gray-300 rounded-xl">
              <Picker selectedValue={form.category} onValueChange={(val: ArticleCategory) => setForm({ ...form, category: val })} style={{ height: 56 }}>
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