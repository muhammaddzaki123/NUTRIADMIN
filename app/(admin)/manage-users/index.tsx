// app/(admin)/manage-users/index.tsx

import { config, databases, deleteNutritionist, deleteUser } from '@/lib/appwrite';
import { useAppwrite } from '@/lib/useAppwrite';
// PERUBAHAN 1: Impor fungsi formatDiseaseName
import { formatDiseaseName } from '@/utils/format';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Models } from 'react-native-appwrite';

interface AppAccount extends Models.Document {
  name: string;
  email: string;
  disease?: string;
  specialization?: string;
}

type ActiveTab = 'users' | 'nutritionists';

// PERUBAHAN 2: Format disease dan specialization di dalam komponen
const UserListItem = ({ item, type, onDelete }: { item: AppAccount; type: ActiveTab; onDelete: () => void; }) => (
  <View className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-4">
    <View className="flex-row items-center">
      <View className={`w-12 h-12 rounded-full justify-center items-center ${type === 'users' ? 'bg-blue-100' : 'bg-green-100'}`}>
        <Ionicons 
          name={type === 'users' ? 'person-outline' : 'fitness-outline'} 
          size={24} 
          color={type === 'users' ? '#3B82F6' : '#10B981'} 
        />
      </View>
      <View className="ml-4 flex-1">
        <Text className="text-lg font-bold text-gray-800" numberOfLines={1}>{item.name}</Text>
        <Text className="text-sm text-gray-600">{item.email}</Text>
        <View className={`px-2 py-1 rounded-full self-start mt-2 ${type === 'users' ? 'bg-blue-200' : 'bg-green-200'}`}>
          <Text className={`text-xs font-semibold ${type === 'users' ? 'text-blue-800' : 'text-green-800'}`}>
            {type === 'users' ? 'Pengguna' : 'Ahli Gizi'}
          </Text>
        </View>
      </View>
      <TouchableOpacity onPress={onDelete} className="bg-red-100 p-2 rounded-full">
        <Ionicons name="trash-outline" size={20} color="#EF4444" />
      </TouchableOpacity>
    </View>
    {item.disease && (
      <Text className="text-sm text-gray-500 mt-2 pt-2 border-t border-gray-100">Penyakit: {formatDiseaseName(item.disease)}</Text>
    )}
    {item.specialization && (
      <Text className="text-sm text-gray-500 mt-2 pt-2 border-t border-gray-100">Spesialisasi: {formatDiseaseName(item.specialization)}</Text>
    )}
  </View>
);

const ManageUsersScreen = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ActiveTab>('users');
  
  const [selectedDisease, setSelectedDisease] = useState<string | null>(null);
  const [selectedSpecialization, setSelectedSpecialization] = useState<string | null>(null);

  const { data: usersResponse, loading: usersLoading, refetch: refetchUsers } = useAppwrite({ 
    fn: () => databases.listDocuments<AppAccount>(config.databaseId!, config.usersProfileCollectionId!)
  });

  const { data: nutritionistsResponse, loading: nutritionistsLoading, refetch: refetchNutritionists } = useAppwrite({ 
    fn: () => databases.listDocuments<AppAccount>(config.databaseId!, config.ahligiziCollectionId!)
  });
  
  // PERUBAHAN 3: Ubah cara filter dibuat untuk memisahkan label dan value
  const diseaseFilters = useMemo(() => {
    if (!usersResponse?.documents) return [];
    const allDiseases = usersResponse.documents
      .map(user => user.disease)
      .filter((disease): disease is string => !!disease);
    const uniqueDiseases = Array.from(new Set(allDiseases));
    return [
        { label: 'Semua', value: null },
        ...uniqueDiseases.map(disease => ({ label: formatDiseaseName(disease), value: disease }))
    ];
  }, [usersResponse]);

  const specializationFilters = useMemo(() => {
    if (!nutritionistsResponse?.documents) return [];
    const allSpecializations = nutritionistsResponse.documents
      .map(n => n.specialization)
      .filter((spec): spec is string => !!spec);
    const uniqueSpecs = Array.from(new Set(allSpecializations));
    return [
        { label: 'Semua', value: null },
        ...uniqueSpecs.map(spec => ({ label: formatDiseaseName(spec), value: spec }))
    ];
  }, [nutritionistsResponse]);

  const displayedData = useMemo(() => {
    if (activeTab === 'users') {
      if (!selectedDisease) {
        return usersResponse?.documents || [];
      }
      return usersResponse?.documents.filter(user => user.disease === selectedDisease) || [];
    }
    
    if (activeTab === 'nutritionists') {
      if (!selectedSpecialization) {
        return nutritionistsResponse?.documents || [];
      }
      return nutritionistsResponse?.documents.filter(n => n.specialization === selectedSpecialization) || [];
    }
    
    return [];
  }, [activeTab, selectedDisease, usersResponse, selectedSpecialization, nutritionistsResponse]);

  useEffect(() => {
    setSelectedDisease(null);
    setSelectedSpecialization(null);
  }, [activeTab]);

  const isLoading = usersLoading || nutritionistsLoading;
  const refetchData = activeTab === 'users' ? refetchUsers : refetchNutritionists;

  const handleDelete = (account: AppAccount) => {
    const accountType = activeTab === 'users' ? 'pengguna' : 'ahli gizi';
    Alert.alert(
      `Hapus Akun ${accountType}`,
      `Apakah Anda yakin ingin menghapus akun "${account.name}"? Tindakan ini tidak dapat dibatalkan.`,
      [
        { text: "Batal", style: "cancel" },
        { 
          text: "Hapus", 
          onPress: async () => {
            try {
              if (activeTab === 'users') {
                await deleteUser(account.$id);
              } else {
                await deleteNutritionist(account.$id);
              }
              Alert.alert("Sukses", `Akun ${accountType} telah dihapus.`);
              refetchData();
            } catch (error) {
              Alert.alert("Error", `Gagal menghapus akun ${accountType}.`);
            }
          },
          style: "destructive" 
        },
      ]
    );
  };

  const FilterCard = ({ title, isActive, onPress }: { title: string; isActive: boolean; onPress: () => void; }) => (
    <TouchableOpacity
      onPress={onPress}
      className={`px-4 py-2 rounded-full mr-2 border ${isActive ? 'bg-primary-500 border-primary-500' : 'bg-white border-gray-300'}`}
    >
      <Text className={`font-semibold capitalize ${isActive ? 'text-white' : 'text-gray-700'}`}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="bg-white px-4 pt-4 shadow-sm">
        <View className="flex-row items-center justify-between">
            <Text className="text-2xl font-bold text-gray-900">Manajemen Akun</Text>
            <View className="flex-row">
              <TouchableOpacity onPress={() => router.push('/(admin)/manage-users/add-user')} className="bg-blue-500 p-2 rounded-full mr-2">
                  <Ionicons name="person-add-outline" size={20} color="white" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.push('/(admin)/manage-users/add-nutritionist')} className="bg-green-500 p-2 rounded-full">
                  <Ionicons name="add" size={24} color="white" />
              </TouchableOpacity>
            </View>
        </View>

        <View className="flex-row mt-4">
            <TouchableOpacity onPress={() => setActiveTab('users')} className={`flex-1 items-center py-3 border-b-2 ${activeTab === 'users' ? 'border-primary-500' : 'border-transparent'}`}>
                <Text className={`font-semibold ${activeTab === 'users' ? 'text-primary-500' : 'text-gray-500'}`}>Pengguna</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setActiveTab('nutritionists')} className={`flex-1 items-center py-3 border-b-2 ${activeTab === 'nutritionists' ? 'border-primary-500' : 'border-transparent'}`}>
                <Text className={`font-semibold ${activeTab === 'nutritionists' ? 'text-primary-500' : 'text-gray-500'}`}>Ahli Gizi</Text>
            </TouchableOpacity>
        </View>
      </View>
      
      {/* PERUBAHAN 4: Logika render filter disesuaikan */}
      {activeTab === 'users' && diseaseFilters.length > 1 && (
        <View className="px-4 pt-3 bg-white pb-3 border-b border-gray-200">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {diseaseFilters.map((filter) => 
              <FilterCard 
                key={filter.value || 'semua'} 
                title={filter.label}
                isActive={selectedDisease === filter.value}
                onPress={() => setSelectedDisease(filter.value)}
              />
            )}
          </ScrollView>
        </View>
      )}

      {activeTab === 'nutritionists' && specializationFilters.length > 1 && (
        <View className="px-4 pt-3 bg-white pb-3 border-b border-gray-200">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {specializationFilters.map((filter) => 
              <FilterCard 
                key={filter.value || 'semua'} 
                title={filter.label}
                isActive={selectedSpecialization === filter.value}
                onPress={() => setSelectedSpecialization(filter.value)}
              />
            )}
          </ScrollView>
        </View>
      )}

      {isLoading && !displayedData?.length ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#0BBEBB" />
          <Text className="mt-2 text-gray-600">Memuat data...</Text>
        </View>
      ) : (
        <FlatList
          data={displayedData}
          keyExtractor={(item) => item.$id}
          renderItem={({ item }) => <UserListItem item={item} type={activeTab} onDelete={() => handleDelete(item)} />}
          contentContainerStyle={{ padding: 16 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => (
            <View className="flex-1 justify-center items-center mt-20">
              <Ionicons name="people-circle-outline" size={48} color="gray" />
              <Text className="text-gray-500 mt-4 text-lg">Tidak ada data untuk ditampilkan.</Text>
            </View>
          )}
          onRefresh={refetchData}
          refreshing={isLoading}
        />
      )}
    </SafeAreaView>
  );
};

export default ManageUsersScreen;
