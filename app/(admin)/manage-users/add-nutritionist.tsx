// app/(admin)/manage-users/add-nutritionist.tsx

import { createNewNutritionist } from '@/lib/appwrite';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
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

const AddNutritionistScreen = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    specialization: '',
  });

  const handleCreate = async () => {
    // Pengecekan diubah menjadi !form.specialization
    if (!form.name || !form.email || !form.password || !form.specialization) {
      Alert.alert("Input Tidak Lengkap", "Semua kolom wajib diisi.");
      return;
    }

    setIsSubmitting(true);
    try {
      // PERUBAHAN 2: Hapus .toLowerCase() karena form.specialization sudah bernilai benar
      await createNewNutritionist({
        ...form
      });

      Alert.alert(
        "Sukses!",
        "Ahli gizi baru berhasil dibuat.",
        [{ text: "OK", onPress: () => router.back() }]
      );

    } catch (error: any) {
      console.error("Gagal membuat ahli gizi:", error);
      Alert.alert("Error", `Gagal membuat ahli gizi: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // PERUBAHAN 1: Ubah menjadi array objek { label, value }
  const specializations = [
    { label: 'Pilih spesialisasi', value: '' },
    { label: 'Diabetes Melitus', value: 'diabetes_melitus' },
    { label: 'Hipertensi', value: 'hipertensi' },
    { label: 'Kanker', value: 'kanker' }
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <Ionicons name="close" size={28} color="#333" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-800">Tambah Ahli Gizi</Text>
        <TouchableOpacity onPress={handleCreate} disabled={isSubmitting} className="p-2">
          {isSubmitting ? <ActivityIndicator color="#0BBEBB" /> : <Ionicons name="checkmark-done" size={28} color="#0BBEBB" />}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <View className="space-y-5">
          <View>
            <Text className="text-base text-gray-600 mb-2">Nama Lengkap</Text>
            <TextInput value={form.name} onChangeText={(e) => setForm({ ...form, name: e })} placeholder="Masukkan nama lengkap" className="border border-gray-300 p-4 rounded-xl text-base" />
          </View>
          <View>
            <Text className="text-base text-gray-600 mb-2">Email</Text>
            <TextInput value={form.email} onChangeText={(e) => setForm({ ...form, email: e })} placeholder="Contoh: ahligizi@example.com" keyboardType="email-address" autoCapitalize="none" className="border border-gray-300 p-4 rounded-xl text-base" />
          </View>
          <View>
            <Text className="text-base text-gray-600 mb-2">Password</Text>
            <TextInput value={form.password} onChangeText={(e) => setForm({ ...form, password: e })} placeholder="Buat password" secureTextEntry className="border border-gray-300 p-4 rounded-xl text-base" />
          </View>
          <View>
            <Text className="text-base text-gray-600 mb-2">Spesialisasi</Text>
            <View className="border border-gray-300 rounded-xl">
              {/* PERUBAHAN 3: Render Picker dari array objek */}
              <Picker selectedValue={form.specialization} onValueChange={(val) => setForm({ ...form, specialization: val })} style={{ height: 56 }}>
                {specializations.map((s) => <Picker.Item key={s.value} label={s.label} value={s.value} />)}
              </Picker>
            </View>
          </View>
          <TouchableOpacity onPress={handleCreate} disabled={isSubmitting} className={`py-4 rounded-xl items-center mt-4 ${isSubmitting ? 'bg-gray-400' : 'bg-green-500'}`}>
            <Text className="text-white font-bold text-lg">{isSubmitting ? 'Membuat Akun...' : 'Buat Akun Ahli Gizi'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddNutritionistScreen;
