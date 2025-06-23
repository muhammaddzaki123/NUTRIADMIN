// app/(admin)/index.tsx

import { getArticlesCount, getLoginLogs, getNutritionistsCount, getUsersCount, logout } from '@/lib/appwrite'; // Tambahkan fungsi baru
import { useGlobalContext } from '@/lib/global-provider';
import { useAppwrite } from '@/lib/useAppwrite';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Models } from 'react-native-appwrite';

// Komponen StatCard dan LogListItem tidak perlu diubah

const StatCard = ({ iconName, title, value, color }: { iconName: keyof typeof Ionicons.glyphMap; title: string; value: string; color: string }) => (
  <View className="flex-1 bg-white p-4 rounded-2xl shadow-md shadow-black/10 items-center mx-2">
    <Ionicons name={iconName} size={32} color={color} />
    <Text className="text-3xl font-bold mt-2 text-gray-800">{value}</Text>
    <Text className="text-sm text-gray-500 mt-1">{title}</Text>
  </View>
);

const LogListItem = ({ item }: { item: Models.Document }) => (
  <View className="bg-white p-3 mb-3 rounded-lg flex-row items-center justify-between shadow-sm border border-gray-100">
    <View className="flex-row items-center flex-1">
      <Ionicons 
        name={item.userType === 'user' ? 'person-circle-outline' : 'fitness-outline'} 
        size={32} 
        color={item.userType === 'user' ? '#3B82F6' : '#10B981'}
        className="mr-3"
      />
      <View>
        <Text className="font-bold text-base">{item.name}</Text>
        <Text className="text-xs text-gray-600">{item.email}</Text>
      </View>
    </View>
    <Text className="text-xs text-gray-400 pl-2">
      {new Date(item.$createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
    </Text>
  </View>
);

const AdminDashboard = () => {
  const { admin } = useGlobalContext();
  const router = useRouter();

  // Mengambil data statistik secara dinamis
  const { data: usersCount, loading: usersLoading, refetch: refetchUsers } = useAppwrite({ fn: getUsersCount });
  const { data: articlesCount, loading: articlesLoading, refetch: refetchArticles } = useAppwrite({ fn: getArticlesCount });
  const { data: nutritionistsCount, loading: nutritionistsLoading, refetch: refetchNutritionists } = useAppwrite({ fn: getNutritionistsCount });
  const { data: loginLogs, loading: logsLoading, refetch: refetchLogs } = useAppwrite({ fn: getLoginLogs });

  const isContentLoading = usersLoading || articlesLoading || nutritionistsLoading || logsLoading;

  const handleRefresh = async () => {
    await Promise.all([
      refetchUsers(),
      refetchArticles(),
      refetchNutritionists(),
      refetchLogs(),
    ]);
  };

  const handleLogout = async () => {
    // fungsi handleLogout tetap sama
    await logout();
    router.replace('/sign-in');
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      {/* Header Halaman */}
      <View className="flex-row items-center justify-between bg-white px-4 py-4 shadow-sm">
        <View>
          <Text className="text-lg text-gray-500">Selamat Datang,</Text>
          <Text className="text-2xl font-bold text-gray-900">{admin?.name || 'Admin'}</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} className="p-2 bg-red-100 rounded-full">
          <Ionicons name="log-out-outline" size={28} color="#EF4444" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        contentContainerStyle={{ padding: 16 }}
        refreshControl={<RefreshControl refreshing={isContentLoading} onRefresh={handleRefresh} />}
      >
        <Text className="text-xl font-semibold text-gray-700 mb-4">Ringkasan Sistem</Text>

        {/* Bagian Statistik dengan data dinamis */}
        <View className="flex-row justify-around mb-4">
          <StatCard iconName="people-outline" title="Total Pengguna" value={usersCount?.toString() || '0'} color="#3B82F6" />
          <StatCard iconName="document-text-outline" title="Total Artikel" value={articlesCount?.toString() || '0'} color="#10B981" />
        </View>
        <View className="flex-row justify-around mb-8">
           <StatCard iconName="fitness-outline" title="Total Ahli Gizi" value={nutritionistsCount?.toString() || '0'} color="#F97316" />
        </View>

        {/* Aksi Cepat */}
        <Text className="text-xl font-semibold text-gray-700 mb-4">Aksi Cepat</Text>
        <View className="space-y-3">
          <TouchableOpacity className="bg-blue-500 p-4 rounded-xl shadow-lg shadow-blue-500/30 mb-3" onPress={() => router.push('/(admin)/manage-articles/create')}>
            <Text className="text-white text-center font-bold text-base">Buat Artikel Baru</Text>
          </TouchableOpacity>
          <TouchableOpacity className="bg-green-500 p-4 rounded-xl shadow-lg shadow-green-500/30" onPress={() => router.push('/(admin)/manage-users/add-user')}>
            <Text className="text-white text-center font-bold text-base">Tambah Pengguna Baru</Text>
          </TouchableOpacity>
        </View>
        
        {/* Aktivitas Login Terakhir */}
        <View className="mt-8">
          <Text className="text-xl font-semibold text-gray-700 mb-4">Aktivitas Login Terakhir</Text>
          
          {logsLoading && !loginLogs?.length ? (
            <ActivityIndicator size="large" color="#0BBEBB" />
          ) : (
            loginLogs && loginLogs.length > 0 ? (
              loginLogs.map((log) => <LogListItem key={log.$id} item={log} />)
            ) : (
              <View className="items-center justify-center p-4 bg-white rounded-lg">
                <Ionicons name="shield-checkmark-outline" size={32} color="gray" />
                <Text className="text-gray-500 mt-2">Belum ada aktivitas login.</Text>
              </View>
            )
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

export default AdminDashboard;