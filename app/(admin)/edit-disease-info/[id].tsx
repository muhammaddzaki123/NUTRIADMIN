import { getDiseaseInfoById, updateDiseaseInfo } from '@/lib/appwrite';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const EditDiseaseInfoScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams(); // Mengambil id dari URL

  // State untuk menyimpan data
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchDiseaseInfo = async () => {
      // --- PERBAIKAN DI SINI ---
      // Hanya jalankan jika 'id' sudah ada dan valid (bukan undefined)
      if (id && typeof id === 'string') {
        try {
          setLoading(true);
          const data = await getDiseaseInfoById(id);
          setTitle(data.title);
          // Format JSON agar mudah dibaca di TextInput
          setContent(JSON.stringify(JSON.parse(data.content), null, 2));
        } catch (error) {
          Alert.alert("Error", "Gagal mengambil data.");
        } finally {
          setLoading(false);
        }
      } else {
        // Jika karena suatu alasan id tidak ada, hentikan loading
        setLoading(false);
        Alert.alert("Error", "ID Dokumen tidak ditemukan.");
      }
    };
    
    fetchDiseaseInfo();
  }, [id]); // Jalankan efek ini ketika 'id' berubah

  const handleSaveChanges = async () => {
    // Pastikan id adalah string sebelum menyimpan
    if (typeof id !== 'string') return; 

    try {
      setIsSaving(true);
      // Validasi bahwa konten adalah JSON yang valid sebelum menyimpan
      JSON.parse(content); 
      await updateDiseaseInfo(id, { title, content });
      Alert.alert("Sukses", "Data berhasil diperbarui.");
      router.back();
    } catch (error) {
      Alert.alert("Error", "Gagal menyimpan. Pastikan format JSON pada konten sudah benar.");
      console.error("Save error:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0BBEBB" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="flex-row items-center bg-white px-4 py-4 shadow-sm">
        <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
            <Ionicons name="arrow-back" size={28} color="black" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-900 ml-4">Edit Info Penyakit</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text className="text-lg font-semibold text-gray-700 mb-2">Judul</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          className="bg-white p-4 rounded-lg border border-gray-300 text-base"
        />

        <Text className="text-lg font-semibold text-gray-700 mt-6 mb-2">Konten (Format JSON)</Text>
        <TextInput
          value={content}
          onChangeText={setContent}
          multiline
          className="bg-white p-4 rounded-lg border border-gray-300 text-base h-96"
          textAlignVertical="top"
          autoCapitalize="none"
          spellCheck={false}
        />

        <TouchableOpacity
          onPress={handleSaveChanges}
          disabled={isSaving}
          className={`mt-8 py-4 rounded-lg ${isSaving ? 'bg-gray-400' : 'bg-blue-500'}`}
        >
          {isSaving ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-center font-bold text-lg">Simpan Perubahan</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditDiseaseInfoScreen;