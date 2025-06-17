// app/(admin)/index.tsx

import { logout } from '@/lib/appwrite';
import { useGlobalContext } from '@/lib/global-provider';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

// Komponen untuk kartu statistik
const StatCard = ({ iconName, title, value, color }: { iconName: keyof typeof Ionicons.glyphMap; title: string; value: string; color: string }) => (
  <View className="flex-1 bg-white p-4 rounded-2xl shadow-md shadow-black/10 items-center mx-2">
    <Ionicons name={iconName} size={32} color={color} />
    <Text className="text-3xl font-bold mt-2 text-gray-800">{value}</Text>
    <Text className="text-sm text-gray-500 mt-1">{title}</Text>
  </View>
);

const AdminDashboard = () => {
  const { admin, refetch } = useGlobalContext();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      await refetch(); // Panggil refetch untuk membersihkan state global
      // Setelah logout, root layout akan otomatis mengarahkan ke halaman sign-in
    } catch (error: any) {
      Alert.alert("Error Logout", error.message);
    }
  };

  // Contoh data statistik (bisa diambil dari database nanti)
  const stats = {
    users: '120',
    articles: '25',
    nutritionists: '15',
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      {/* Header Halaman */}
      <View className="flex-row items-center justify-between bg-white px-4 py-4 shadow-sm">
        <View>
          <Text className="text-lg text-gray-500">Selamat Datang,</Text>
          <Text className="text-2xl font-bold text-gray-900">{admin?.name || 'Admin'}</Text>
        </View>
        <TouchableOpacity 
          onPress={handleLogout} 
          className="p-2 bg-red-100 rounded-full"
        >
          <Ionicons name="log-out-outline" size={28} color="#EF4444" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text className="text-xl font-semibold text-gray-700 mb-4">Ringkasan Sistem</Text>

        {/* Baris Pertama Kartu Statistik */}
        <View className="flex-row justify-around mb-4">
          <StatCard
            iconName="people-outline"
            title="Total Pengguna"
            value={stats.users}
            color="#3B82F6"
          />
          <StatCard
            iconName="document-text-outline"
            title="Total Artikel"
            value={stats.articles}
            color="#10B981"
          />
        </View>

        {/* Baris Kedua Kartu Statistik */}
        <View className="flex-row justify-around mb-8">
           <StatCard
            iconName="fitness-outline"
            title="Total Ahli Gizi"
            value={stats.nutritionists}
            color="#F97316"
          />
        </View>

        {/* Quick Actions */}
        <Text className="text-xl font-semibold text-gray-700 mb-4">Aksi Cepat</Text>
        <View className="space-y-3">
          <TouchableOpacity 
            className="bg-blue-500 p-4 rounded-xl shadow-lg shadow-blue-500/30 mb-3"
            onPress={() => router.push('./manage-articles')}
          >
            <Text className="text-white text-center font-bold text-base">Buat Artikel Baru</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            className="bg-green-500 p-4 rounded-xl shadow-lg shadow-green-500/30"
            onPress={() => router.push('./manage-users')}
          >
            <Text className="text-white text-center font-bold text-base">Tambah Pengguna Baru</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

export default AdminDashboard;