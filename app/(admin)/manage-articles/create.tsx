// app/(admin)/manage-articles/create.tsx

import { config, getFilePreview, publishNewArticle, uploadFile } from '@/lib/appwrite';
import { useGlobalContext } from '@/lib/global-provider';
import { CreateArticleData } from '@/types/article';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
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


type ArticleCategory = CreateArticleData['category'];

const CreateArticleScreen = () => {
  const router = useRouter();
  const { admin } = useGlobalContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [imageAsset, setImageAsset] = useState<ImagePicker.ImagePickerAsset | null>(null);

  const [form, setForm] = useState({
    title: '',
    description: '',
    content: '',
    category: 'nutrisi' as ArticleCategory,
    tags: '',
    author: '',
  });

  const categories: ArticleCategory[] = ['nutrisi', 'diet', 'kesehatan', 'hipertensi', 'diabetes', 'kanker'];

  const pickImage = async () => {
  const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (permissionResult.granted === false) {
    Alert.alert("Izin Diperlukan", "Anda perlu memberikan izin akses ke galeri untuk memilih gambar.");
    return;
  }

let result = await ImagePicker.launchImageLibraryAsync({
  mediaTypes: ImagePicker.MediaTypeOptions.Images,
  allowsEditing: true,
  quality: 1,
});

  if (!result.canceled) {
    setImageAsset(result.assets[0]);
  }
};

  const handlePublish = async () => {
    if (!form.title || !form.content || !form.category || !form.author) {
      Alert.alert("Input Tidak Lengkap", "Judul, Konten, Kategori dan Penulis wajib diisi.");
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
      const fileToUpload = {
        name: imageAsset.fileName || `article_${Date.now()}.jpg`,
        type: imageAsset.mimeType,
        uri: imageAsset.uri,
        size: imageAsset.fileSize,
      };

      const uploadedFile = await uploadFile(fileToUpload, config.storageBucketId!);
      const image = getFilePreview(config.storageBucketId!, uploadedFile.$id).href;

      await publishNewArticle({
        ...form,
        tags: form.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        image: image,
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
            <TextInput 
              value={form.title} 
              onChangeText={(e) => setForm({ ...form, title: e })} 
              placeholder="Contoh: Manfaat Sarapan Pagi" 
              className="border border-gray-300 p-4 rounded-xl text-base text-black" 
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* Penulis Artikel */}
          <View>
            <Text className="text-base text-gray-600 mb-2">Penulis Artikel</Text>
            <TextInput
                value={form.author}
                onChangeText={(e) => setForm({ ...form, author: e })}
                placeholder="Masukkan nama penulis"
                className="border border-gray-300 p-4 rounded-xl text-base text-black"
                placeholderTextColor="#9CA3AF"
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
              className="border border-gray-300 p-4 rounded-xl text-base h-24 text-black" 
              style={{ textAlignVertical: 'top' }}
              placeholderTextColor="#9CA3AF"
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
              className="border border-gray-300 p-4 rounded-xl text-base h-48 text-black" 
              style={{ textAlignVertical: 'top' }}
              placeholderTextColor="#9CA3AF"
            />
          </View>
          
          {/* Kategori */}
          <View>
            <Text className="text-base text-gray-600 mb-2">Kategori</Text>
            <View className="border border-gray-300 rounded-xl">
              <Picker 
                selectedValue={form.category} 
                onValueChange={(val: ArticleCategory) => setForm({ ...form, category: val })} 
                style={{ height: 56, color: '#000000' }} 
                dropdownIconColor="#0BBEBB"
              >
                {categories.map((cat) => (
                  <Picker.Item 
                    key={cat} 
                    label={cat.charAt(0).toUpperCase() + cat.slice(1)} 
                    value={cat}
                    color="#000000"
                  />
                ))}
              </Picker>
            </View>
          </View>

          {/* Tags */}
          <View>
            <Text className="text-base text-gray-600 mb-2">Tags (pisahkan dengan koma)</Text>
            <TextInput 
              value={form.tags} 
              onChangeText={(e) => setForm({ ...form, tags: e })} 
              placeholder="diet, sehat, olahraga" 
              className="border border-gray-300 p-4 rounded-xl text-base text-black"
              placeholderTextColor="#9CA3AF"
            />
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