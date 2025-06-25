import { getAllDiseaseInfo } from '@/lib/appwrite';
import { useAppwrite } from '@/lib/useAppwrite';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const DiseaseInfoListScreen = () => {
  const router = useRouter();
  const { data: diseaseInfos, loading, refetch } = useAppwrite({ fn: getAllDiseaseInfo });

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      className="bg-white p-4 rounded-lg shadow-sm mb-4 border border-gray-200 flex-row justify-between items-center"
      // Rute ini tetap valid karena merupakan path absolut dari root aplikasi
      onPress={() => router.push(`/(admin)/edit-disease-info/${item.$id}`)}
    >
      <View>
        <Text className="text-lg font-bold text-gray-800">{item.title}</Text>
        <Text className="text-sm text-gray-500">ID: {item.diseaseId}</Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color="#6B7280" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="flex-row items-center bg-white px-4 py-4 shadow-sm">
        <Text className="text-2xl font-bold text-gray-900">Kelola Info Penyakit</Text>
      </View>

      {loading && !diseaseInfos?.length ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#0BBEBB" />
        </View>
      ) : (
        <FlatList
          data={diseaseInfos}
          keyExtractor={(item) => item.$id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16 }}
          onRefresh={refetch}
          refreshing={loading}
          ListEmptyComponent={() => (
            <View className="flex-1 justify-center items-center mt-20">
              <Ionicons name="sad-outline" size={48} color="gray" />
              <Text className="text-gray-500 mt-4">Data tidak ditemukan.</Text>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
};

export default DiseaseInfoListScreen;