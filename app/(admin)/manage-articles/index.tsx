// app/(admin)/manage-articles/index.tsx

import { getArticles, deleteArticle } from '@/lib/appwrite';
import { useAppwrite } from '@/lib/useAppwrite';
import { Article } from '@/types/article';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

// Komponen untuk setiap item dalam daftar artikel
// Dipindahkan ke luar komponen utama untuk performa yang lebih baik
const ArticleListItem = ({ item, onEdit, onDelete }: { item: Article; onEdit: () => void; onDelete: () => void; }) => (
  <View className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-4">
    <View className="flex-row items-center">
      <Image
        source={{ uri: item.image }}
        className="w-20 h-20 rounded-lg bg-gray-200"
        resizeMode="cover"
      />
      <View className="flex-1 ml-4">
        <Text className="text-lg font-bold text-gray-800" numberOfLines={2}>{item.title}</Text>
        <Text className="text-sm text-gray-500 mt-1 capitalize">
          Kategori: <Text className="font-semibold">{item.category}</Text>
        </Text>
        <Text className="text-sm text-gray-500">
          Penulis: {item.author}
        </Text>
      </View>
    </View>
    <View className="flex-row justify-end mt-4 pt-3 border-t border-gray-100">
      <TouchableOpacity onPress={onEdit} className="mr-4 bg-blue-100 p-2 rounded-full">
        <Ionicons name="pencil-outline" size={20} color="#3B82F6" />
      </TouchableOpacity>
      <TouchableOpacity onPress={onDelete} className="bg-red-100 p-2 rounded-full">
        <Ionicons name="trash-outline" size={20} color="#EF4444" />
      </TouchableOpacity>
    </View>
  </View>
);

const ManageArticlesScreen = () => {
  const router = useRouter();
  const { data: articles, loading, refetch } = useAppwrite({ fn: getArticles });

  const handleDelete = (article: Article) => {
    Alert.alert(
      "Hapus Artikel",
      `Apakah Anda yakin ingin menghapus artikel "${article.title}"? Tindakan ini tidak dapat dibatalkan.`,
      [
        { text: "Batal", style: "cancel" },
        { 
          text: "Hapus", 
          onPress: async () => {
            try {
              // Menggunakan `article.image` sesuai dengan struktur data yang benar
              await deleteArticle(article.$id, article.image);
              Alert.alert("Sukses", "Artikel telah dihapus.");
              refetch(); // Muat ulang daftar artikel
            } catch (error) {
              Alert.alert("Error", "Gagal menghapus artikel.");
            }
          },
          style: "destructive" 
        },
      ]
    );
  };

  const handleEdit = (id: string) => {
    // Navigasi ke halaman edit dengan membawa ID artikel
    router.push(`/(admin)/manage-articles/${id}`);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      {/* Header Halaman */}
      <View className="flex-row items-center justify-between bg-white px-4 py-4 shadow-sm">
        <Text className="text-2xl font-bold text-gray-900">Manajemen Artikel</Text>
        <TouchableOpacity
          onPress={() => router.push('/(admin)/manage-articles/create')}
          className="bg-primary-500 py-2 px-4 rounded-full flex-row items-center"
        >
          <Ionicons name="add" size={20} color="white" />
          <Text className="text-white font-semibold ml-2">Buat Baru</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#0BBEBB" />
          <Text className="mt-2 text-gray-600">Memuat artikel...</Text>
        </View>
      ) : (
        <FlatList
          data={articles}
          keyExtractor={(item) => item.$id}
          renderItem={({ item }) => (
            <ArticleListItem 
              item={item} 
              onEdit={() => handleEdit(item.$id)}
              onDelete={() => handleDelete(item)}
            />
          )}
          contentContainerStyle={{ padding: 16 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => (
            <View className="flex-1 justify-center items-center mt-20">
              <Ionicons name="documents-outline" size={48} color="gray" />
              <Text className="text-gray-500 mt-4 text-lg">Belum ada artikel.</Text>
              <Text className="text-gray-400">Tekan tombol 'Buat Baru' untuk memulai.</Text>
            </View>
          )}
          onRefresh={refetch}
          refreshing={loading}
        />
      )}
    </SafeAreaView>
  );
};

export default ManageArticlesScreen;
