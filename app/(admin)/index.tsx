import {
  getAllArticles,
  getAllNutritionists,
  getAllUsers,
  getArticlesCount,
  getNutritionistsCount,
  getUsersCount,
  logout
} from '@/lib/appwrite';
import { useGlobalContext } from '@/lib/global-provider';
import { useAppwrite } from '@/lib/useAppwrite';
import { formatDiseaseName } from '@/utils/format';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Models } from 'react-native-appwrite';

const StatCard = ({ iconName, title, value, color }: { iconName: keyof typeof Ionicons.glyphMap; title: string; value: string; color: string }) => (
  <View className="flex-1 bg-white p-4 rounded-2xl shadow-md shadow-black/10 items-center mx-2">
    <Ionicons name={iconName} size={32} color={color} />
    <Text className="text-3xl font-bold mt-2 text-gray-800">{value}</Text>
    <Text className="text-sm text-gray-500 mt-1">{title}</Text>
  </View>
);

const AdminDashboard = () => {
  const { admin } = useGlobalContext();
  const router = useRouter();

  // Mengambil data hitungan
  const { data: usersCount, refetch: refetchUsersCount } = useAppwrite({ fn: getUsersCount });
  const { data: articlesCount, refetch: refetchArticlesCount } = useAppwrite({ fn: getArticlesCount });
  const { data: nutritionistsCount, refetch: refetchNutritionistsCount } = useAppwrite({ fn: getNutritionistsCount });
  
  // Mengambil semua data untuk rincian
  const { data: allUsers, loading: usersLoading, refetch: refetchAllUsers } = useAppwrite({ fn: getAllUsers });
  const { data: allArticles, loading: articlesLoading, refetch: refetchAllArticles } = useAppwrite({ fn: getAllArticles });
  const { data: allNutritionists, loading: nutritionistsLoading, refetch: refetchAllNutritionists } = useAppwrite({ fn: getAllNutritionists });

  const isContentLoading = usersLoading || articlesLoading || nutritionistsLoading;

  const handleRefresh = async () => {
    await Promise.all([
      refetchUsersCount(),
      refetchArticlesCount(),
      refetchNutritionistsCount(),
      refetchAllUsers(),
      refetchAllArticles(),
      refetchAllNutritionists(),
    ]);
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/sign-in');
  };

  // Fungsi generik untuk memproses dan menampilkan alert rincian
  const formatAndShowAlert = (title: string, data: Models.Document[] | null, groupBy: string, defaultCategory: string) => {
    if (!data) {
      Alert.alert("Info", "Data belum siap, silakan coba lagi sesaat.");
      return;
    }

    const counts = data.reduce((acc: Record<string, number>, item: Models.Document & { [key: string]: any }) => {
      const categoryValue = item[groupBy] as string;
      const category = categoryValue ? formatDiseaseName(categoryValue) : defaultCategory;
      
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});

    let message = `Berikut adalah rincian ${title.toLowerCase()} berdasarkan ${groupBy}:\n\n`;
    const sortedKeys = Object.keys(counts).sort();
    
    if (sortedKeys.length === 0) {
      message = `Belum ada data untuk ditampilkan.`;
    } else {
      for (const key of sortedKeys) {
        message += `• ${key}: ${counts[key]}\n`;
      }
    }
    Alert.alert(title, message);
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

        {/* Bagian Statistik Interaktif */}
        <View className="flex-row justify-around mb-4">
          <TouchableOpacity onPress={() => formatAndShowAlert("Ringkasan Pengguna", allUsers, "disease", "Lainnya")} className="flex-1">
            <StatCard iconName="people-outline" title="Total Pengguna" value={usersCount?.toString() || '0'} color="#3B82F6" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => formatAndShowAlert("Ringkasan Artikel", allArticles, "category", "Umum")} className="flex-1">
            <StatCard iconName="document-text-outline" title="Total Artikel" value={articlesCount?.toString() || '0'} color="#10B981" />
          </TouchableOpacity>
        </View>
        <View className="flex-row justify-around mb-8">
            <TouchableOpacity onPress={() => formatAndShowAlert("Ringkasan Ahli Gizi", allNutritionists, "specialization", "Umum")} className="flex-1">
              <StatCard iconName="fitness-outline" title="Total Ahli Gizi" value={nutritionistsCount?.toString() || '0'} color="#F97316" />
            </TouchableOpacity>
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
        
      </ScrollView>
    </SafeAreaView>
  );
};

export default AdminDashboard;