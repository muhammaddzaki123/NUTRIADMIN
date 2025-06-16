// app/(admin)/manage-articles/index.tsx

import { getArticles } from '@/lib/appwrite'; // Kita perlu menambahkan ini di appwrite.ts versi admin
import { useAppwrite } from '@/lib/useAppwrite';
import { Article } from '@/types/article';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

// Komponen untuk setiap item dalam daftar artikel
const ArticleListItem = ({ item, onEdit, onDelete }: { item: Article; onEdit: () => void; onDelete: () => void; }) => (
  <View className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-4">
    <View>
      <Text className="text-lg font-bold text-gray-800" numberOfLines={1}>{item.title}</Text>
      <Text className="text-sm text-gray-500 mt-1">
        Kategori: <Text className="font-semibold">{item.category}</Text>
      </Text>
      <Text className="text-sm text-gray-500">
        Penulis: {item.author}
      </Text>
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
  // Menggunakan hook useAppwrite untuk mengambil data artikel
  const { data: articles, loading, refetch } = useAppwrite({ fn: getArticles });

  const handleDelete = (id: string) => {
    Alert.alert(
      "Hapus Artikel",
      "Apakah Anda yakin ingin menghapus artikel ini? Tindakan ini tidak dapat dibatalkan.",
      [
        { text: "Batal", style: "cancel" },
        { 
          text: "Hapus", 
          onPress: async () => {
            // Logika untuk menghapus artikel akan ditambahkan di sini
            // await deleteArticle(id);
            // refetch();
            Alert.alert("Info", "Fitur hapus belum diimplementasikan.");
          },
          style: "destructive" 
        },
      ]
    );
  };

  const handleEdit = (id: string) => {
    // Navigasi ke halaman edit dengan membawa ID artikel
    router.push(`./manage-articles/${id}`);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      {/* Header Halaman */}
      <View className="flex-row items-center justify-between bg-white px-4 py-4 shadow-sm">
        <Text className="text-2xl font-bold text-gray-900">Manajemen Artikel</Text>
        <TouchableOpacity
          onPress={() => router.push('/(admin)/manage-articles/create')}
          className="bg-primary-500 p-2 rounded-full flex-row items-center"
        >
          <Ionicons name="add" size={24} color="white" />
          <Text className="text-white font-semibold mr-1">Buat Baru</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#0BBEBB" />
          <Text>Memuat artikel...</Text>
        </View>
      ) : (
        <FlatList
          data={articles as Article[]}
          keyExtractor={(item) => item.$id}
          renderItem={({ item }) => (
            <ArticleListItem 
              item={item} 
              onEdit={() => handleEdit(item.$id)}
              onDelete={() => handleDelete(item.$id)} 
            />
          )}
          contentContainerStyle={{ padding: 16 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => (
            <View className="flex-1 justify-center items-center mt-20">
              <Text className="text-gray-500">Belum ada artikel yang dibuat.</Text>
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