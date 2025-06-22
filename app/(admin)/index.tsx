// app/(admin)/index.tsx

import { getLoginLogs, logout } from '@/lib/appwrite'; // Tambahkan getLoginLogs
import { useGlobalContext } from '@/lib/global-provider';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList, // Import FlatList
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAppwrite } from '@/lib/useAppwrite'; // Import useAppwrite
import { Models } from 'react-native-appwrite';

// Komponen untuk setiap item log
const LogListItem = ({ item }: { item: Models.Document }) => (
  <View className="bg-white p-3 mb-3 rounded-lg flex-row items-center justify-between shadow-sm">
    <View className="flex-row items-center">
      <Ionicons 
        name={item.userType === 'user' ? 'person-circle-outline' : 'fitness-outline'} 
        size={32} 
        color={item.userType === 'user' ? '#3B82F6' : '#10B981'}
        className="mr-3"
      />
      <View>
        <Text className="font-bold text-base">{item.name}</Text>
        <Text className="text-sm text-gray-600">{item.email}</Text>
      </View>
    </View>
    <Text className="text-xs text-gray-400">
      {new Date(item.timestamp).toLocaleString('id-ID')}
    </Text>
  </View>
);

const AdminDashboard = () => {
  const { admin, refetch: refetchAdmin } = useGlobalContext();
  const router = useRouter();
  
  // Menggunakan hook useAppwrite untuk mengambil data log
  const { data: loginLogs, loading: logsLoading, refetch: refetchLogs } = useAppwrite({ fn: getLoginLogs });

  const handleLogout = async () => {
    try {
      await logout();
      await refetchAdmin();
    } catch (error: any) {
      Alert.alert("Error Logout", error.message);
    }
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

      {/* Konten Utama Halaman */}
      <View className="flex-1">
        <Text className="text-xl font-semibold text-gray-700 mt-4 mb-2 px-4">Aktivitas Login Terakhir</Text>

        {logsLoading ? (
          <ActivityIndicator size="large" color="#0BBEBB" className="mt-8" />
        ) : (
          <FlatList
            data={loginLogs}
            keyExtractor={(item) => item.$id}
            renderItem={({ item }) => <LogListItem item={item} />}
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={() => (
              <View className="items-center justify-center mt-20">
                <Text className="text-gray-500">Belum ada aktivitas login yang tercatat.</Text>
              </View>
            )}
            onRefresh={refetchLogs}
            refreshing={logsLoading}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default AdminDashboard;