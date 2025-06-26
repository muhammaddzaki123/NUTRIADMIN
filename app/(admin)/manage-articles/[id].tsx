// app/(admin)/manage-articles/[id].tsx

import {
  getArticleById,
  updateArticle,
} from '@/lib/appwrite';
import { CreateArticleData } from '@/types/article';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

type ArticleCategory = CreateArticleData['category'];

const EditArticleScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  
  const [form, setForm] = useState({
    title: '',
    description: '',
    content: '',
    category: 'nutrisi' as ArticleCategory,
    tags: '',
    author: '',
    isPublished: true,
  });
  
  const [imageAsset, setImageAsset] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories: ArticleCategory[] = ['nutrisi', 'diet', 'kesehatan', 'hipertensi', 'diabetes', 'kanker'];

  useEffect(() => {
    const fetchArticle = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const articleData = await getArticleById(id);
        if (articleData) {
          setForm({
            title: articleData.title,
            description: articleData.description,
            content: articleData.content,
            category: articleData.category,
            tags: articleData.tags.join(', '),
            author: articleData.author,
            isPublished: articleData.isPublished,
          });
          setCurrentImageUrl(articleData.image);
        }
      } catch (error) {
        Alert.alert("Error", "Gagal memuat data artikel.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchArticle();
  }, [id]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      // aspect: [16, 9],
      quality: 0.7,
    });
    if (!result.canceled) {
      setImageAsset(result.assets[0]);
    }
  };

  const handleUpdate = async () => {
    if (!id) return;
    if (!form.title || !form.content || !form.author) {
      Alert.alert("Input Tidak Lengkap", "Judul, Konten, dan Penulis wajib diisi.");
      return;
    }
    setIsSubmitting(true);
    try {
      const updatePayload: Partial<CreateArticleData> = {
        ...form,
        tags: form.tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag),
        imageFile: imageAsset ? {
          name: imageAsset.fileName || `article_${Date.now()}.jpg`,
          type: imageAsset.mimeType,
          uri: imageAsset.uri,
          size: imageAsset.fileSize,
        } : undefined,
        image: currentImageUrl || '',
      };
      
      await updateArticle(id, updatePayload);
      Alert.alert("Sukses!", "Artikel berhasil diperbarui.", [{ text: "OK", onPress: () => router.back() }]);
    } catch (error: any) {
      Alert.alert("Error", `Gagal memperbarui: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()} className="p-2"><Ionicons name="close" size={28} color="#333" /></TouchableOpacity>
        <Text className="text-xl font-bold text-gray-800">Edit Artikel</Text>
        <TouchableOpacity onPress={handleUpdate} disabled={isSubmitting} className="p-2">
          {isSubmitting ? <ActivityIndicator color="#0BBEBB" /> : <Ionicons name="checkmark-done" size={28} color="#0BBEBB" />}
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" className="mt-16" />
      ) : (
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <View className="space-y-6">
          <View>
            <Text className="text-base text-gray-600 mb-2">Gambar Utama Artikel</Text>
            <TouchableOpacity onPress={pickImage} className="border border-dashed border-gray-400 p-2 rounded-xl items-center justify-center h-48 bg-gray-50">
              <Image 
                source={{ uri: imageAsset ? imageAsset.uri : currentImageUrl || undefined }} 
                className="w-full h-full rounded-xl" 
                resizeMode="cover" 
              />
              <View className="absolute bg-black/40 p-2 rounded-full">
                <Ionicons name="camera-outline" size={24} color="white" />
              </View>
            </TouchableOpacity>
          </View>
          
          <View>
            <Text className="text-base text-gray-600 mb-2">Judul Artikel</Text>
            <TextInput 
              value={form.title} 
              onChangeText={(e) => setForm({ ...form, title: e })} 
              className="border border-gray-300 p-4 rounded-xl text-base text-black"
              placeholderTextColor="#9CA3AF"
            />
          </View>
          
          <View>
            <Text className="text-base text-gray-600 mb-2">Penulis</Text>
            <TextInput
                value={form.author}
                onChangeText={(e) => setForm({ ...form, author: e })}
                className="border border-gray-300 p-4 rounded-xl text-base text-black"
                placeholderTextColor="#9CA3AF"
            />
          </View>

          <View>
            <Text className="text-base text-gray-600 mb-2">Deskripsi</Text>
            <TextInput 
              value={form.description} 
              onChangeText={(e) => setForm({ ...form, description: e })} 
              multiline 
              className="border border-gray-300 p-4 rounded-xl text-base h-24 text-black" 
              style={{ textAlignVertical: 'top' }}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View>
            <Text className="text-base text-gray-600 mb-2">Konten</Text>
            <TextInput 
              value={form.content} 
              onChangeText={(e) => setForm({ ...form, content: e })} 
              multiline 
              className="border border-gray-300 p-4 rounded-xl text-base h-48 text-black" 
              style={{ textAlignVertical: 'top' }}
              placeholderTextColor="#9CA3AF"
            />
          </View>

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

          <View>
            <Text className="text-base text-gray-600 mb-2">Tags (pisahkan dengan koma)</Text>
            <TextInput 
              value={form.tags} 
              onChangeText={(e) => setForm({ ...form, tags: e })} 
              className="border border-gray-300 p-4 rounded-xl text-base text-black"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View className="flex-row items-center justify-between p-4 bg-gray-50 rounded-xl">
            <Text className="text-base text-gray-600">Publikasikan Artikel</Text>
            <Switch
              trackColor={{ false: "#767577", true: "#81d4fa" }}
              thumbColor={form.isPublished ? "#0BBEBB" : "#f4f3f4"}
              onValueChange={(val) => setForm({...form, isPublished: val})}
              value={form.isPublished}
            />
          </View>
        </View>
      </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default EditArticleScreen;