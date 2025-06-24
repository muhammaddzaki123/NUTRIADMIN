// app/(admin)/manage-users/edit-nutritionist/[id].tsx

import { getNutritionistById, updateNutritionist } from '@/lib/appwrite';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
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

const EditNutritionistScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [form, setForm] = useState({
    name: '',
    email: '',
    gender: '',
    specialization: '',
  });

  useEffect(() => {
    const fetchNutritionistData = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const nutritionistData = await getNutritionistById(id);
        setForm({
          name: nutritionistData.name,
          email: nutritionistData.email, // Email tidak bisa diedit
          gender: nutritionistData.gender,
          specialization: nutritionistData.specialization,
        });
      } catch (error) {
        Alert.alert("Error", "Gagal memuat data ahli gizi.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchNutritionistData();
  }, [id]);

  const handleUpdate = async () => {
    if (!form.name || !form.gender || !form.specialization) {
      Alert.alert("Input Tidak Lengkap", "Semua kolom wajib diisi kecuali email.");
      return;
    }
    setIsSubmitting(true);
    try {
      await updateNutritionist(id!, {
        name: form.name,
        gender: form.gender,
        specialization: form.specialization,
      });
      Alert.alert("Sukses!", "Data ahli gizi berhasil diperbarui.", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error: any) {
      Alert.alert("Error", `Gagal memperbarui: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const specializations = [
    { label: 'Pilih spesialisasi', value: '' },
    { label: 'Diabetes Melitus', value: 'diabetes_melitus' },
    { label: 'Hipertensi', value: 'hipertensi' },
    { label: 'Kanker', value: 'kanker' },
  ];

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#0BBEBB" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <Ionicons name="close" size={28} color="#333" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-800">Edit Ahli Gizi</Text>
        <TouchableOpacity onPress={handleUpdate} disabled={isSubmitting} className="p-2">
          {isSubmitting ? <ActivityIndicator color="#0BBEBB" /> : <Ionicons name="checkmark-done" size={28} color="#0BBEBB" />}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <View className="space-y-5">
          <View>
            <Text className="text-base text-gray-600 mb-2">Nama Lengkap</Text>
            <TextInput value={form.name} onChangeText={(e) => setForm({ ...form, name: e })} className="border border-gray-300 p-4 rounded-xl text-base" />
          </View>
          <View>
            <Text className="text-base text-gray-600 mb-2">Email (Tidak dapat diubah)</Text>
            <TextInput value={form.email} editable={false} className="border border-gray-300 p-4 rounded-xl text-base bg-gray-100 text-gray-500" />
          </View>
          <View>
            <Text className="text-base text-gray-600 mb-2">Jenis Kelamin</Text>
            <View className="border border-gray-300 rounded-xl">
              <Picker selectedValue={form.gender} onValueChange={(val) => setForm({ ...form, gender: val })} style={{ height: 56 }}>
                <Picker.Item label="Pilih Jenis Kelamin" value="" />
                <Picker.Item label="Laki-laki" value="Laki-laki" />
                <Picker.Item label="Perempuan" value="Perempuan" />
              </Picker>
            </View>
          </View>
          <View>
            <Text className="text-base text-gray-600 mb-2">Spesialisasi</Text>
            <View className="border border-gray-300 rounded-xl">
              <Picker selectedValue={form.specialization} onValueChange={(val) => setForm({ ...form, specialization: val })} style={{ height: 56 }}>
                {specializations.map((s) => <Picker.Item key={s.value} label={s.label} value={s.value} />)}
              </Picker>
            </View>
          </View>
          <TouchableOpacity onPress={handleUpdate} disabled={isSubmitting} className={`py-4 rounded-xl items-center mt-4 ${isSubmitting ? 'bg-gray-400' : 'bg-green-500'}`}>
            <Text className="text-white font-bold text-lg">{isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditNutritionistScreen;