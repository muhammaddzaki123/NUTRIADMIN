// app/(admin)/manage-users/index.tsx

import { databases, config } from '@/lib/appwrite';
import { useAppwrite } from '@/lib/useAppwrite';
import { Models, Query } from 'react-native-appwrite';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';

// Tipe gabungan untuk user dan ahli gizi
interface AppUser extends Models.Document {
  name: string;
  email: string;
  userType: 'user' | 'nutritionist';
  disease?: string;
  specialization?: string;
}

// Fungsi untuk mengambil semua pengguna dan ahli gizi
const fetchAllUsers = async () => {
  try {
    const [users, nutritionists] = await Promise.all([
      databases.listDocuments(config.databaseId!, config.usersProfileCollectionId!),
      databases.listDocuments(config.databaseId!, config.ahligiziCollectionId!),
    ]);

    // Gabungkan dan beri label userType
    const allUsers: AppUser[] = [
      ...users.documents.map(doc => ({ ...doc, userType: 'user' })) as AppUser[],
      ...nutritionists.documents.map(doc => ({ ...doc, userType: 'nutritionist' })) as AppUser[],
    ];

    // Urutkan berdasarkan tanggal pembuatan
    return allUsers.sort((a, b) => new Date(b.$createdAt).getTime() - new Date(a.$createdAt).getTime());
  } catch (error) {
    console.error("Gagal mengambil daftar pengguna:", error);
    throw error;
  }
};

// Komponen untuk setiap item dalam daftar
const UserListItem = ({ item }: { item: AppUser }) => (
  <View className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-4">
    <View className="flex-row items-center">
      <View className={`w-12 h-12 rounded-full justify-center items-center ${item.userType === 'user' ? 'bg-blue-100' : 'bg-green-100'}`}>
        <Ionicons 
          name={item.userType === 'user' ? 'person-outline' : 'fitness-outline'} 
          size={24} 
          color={item.userType === 'user' ? '#3B82F6' : '#10B981'} 
        />
      </View>
      <View className="ml-4 flex-1">
        <Text className="text-lg font-bold text-gray-800" numberOfLines={1}>{item.name}</Text>
        <Text className="text-sm text-gray-600">{item.email}</Text>
        <View className={`px-2 py-1 rounded-full self-start mt-2 ${item.userType === 'user' ? 'bg-blue-200' : 'bg-green-200'}`}>
          <Text className={`text-xs font-semibold ${item.userType === 'user' ? 'text-blue-800' : 'text-green-800'}`}>
            {item.userType === 'user' ? 'Pengguna' : 'Ahli Gizi'}
          </Text>
        </View>
      </View>
    </View>
    {item.disease && (
      <Text className="text-sm text-gray-500 mt-2 pt-2 border-t border-gray-100">Penyakit: {item.disease}</Text>
    )}
    {item.specialization && (
      <Text className="text-sm text-gray-500 mt-2 pt-2 border-t border-gray-100">Spesialisasi: {item.specialization}</Text>
    )}
  </View>
);

const ManageUsersScreen = () => {
  const router = useRouter();
  const { data: users, loading, refetch } = useAppwrite({ fn: fetchAllUsers });

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      {/* Header Halaman */}
      <View className="flex-row items-center justify-between bg-white px-4 py-4 shadow-sm">
        <Text className="text-2xl font-bold text-gray-900">Manajemen Pengguna</Text>
        <View className="flex-row">
          <TouchableOpacity
            onPress={() => router.push('./add-user')}
            className="bg-blue-500 p-2 rounded-full flex-row items-center mr-2"
          >
            <Ionicons name="person-add-outline" size={20} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push('./add-nutritionist')}
            className="bg-green-500 p-2 rounded-full flex-row items-center"
          >
            <Ionicons name="add" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#0BBEBB" />
          <Text>Memuat data pengguna...</Text>
        </View>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item.$id}
          renderItem={({ item }) => <UserListItem item={item} />}
          contentContainerStyle={{ padding: 16 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => (
            <View className="flex-1 justify-center items-center mt-20">
              <Text className="text-gray-500">Tidak ada pengguna atau ahli gizi.</Text>
            </View>
          )}
          onRefresh={refetch}
          refreshing={loading}
        />
      )}
    </SafeAreaView>
  );
};

export default ManageUsersScreen;