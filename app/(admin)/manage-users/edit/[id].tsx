// File: app/(admin)/manage-users/edit/[id].tsx

import { getUserById, updateUser } from '@/lib/appwrite';
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

const EditUserScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>(); // Mengambil ID dari URL

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State untuk form
  const [form, setForm] = useState({
    name: '',
    email: '', // Email tidak akan diedit, hanya ditampilkan
    age: '',
    gender: '',
    disease: '',
  });

  // Mengambil data pengguna saat halaman dimuat
  useEffect(() => {
    if (!id) return;
    const fetchUser = async () => {
      setIsLoading(true);
      try {
        const userData = await getUserById(id);
        if (userData) {
          setForm({
            name: userData.name,
            email: userData.email,
            age: userData.age?.toString() || '',
            gender: userData.gender,
            disease: userData.disease,
          });
        }
      } catch (error) {
        Alert.alert("Error", "Gagal memuat data pengguna.");
        router.back();
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, [id, router]);

  const handleUpdate = async () => {
    if (!id) return;
    if (!form.name || !form.age || !form.gender || !form.disease) {
      Alert.alert("Input Tidak Lengkap", "Nama, Usia, Jenis Kelamin, dan Penyakit wajib diisi.");
      return;
    }

    setIsSubmitting(true);
    try {
      const { email, ...updateData } = form; // Email tidak diikutsertakan dalam update
      await updateUser(id, updateData);
      Alert.alert(
        "Sukses!",
        "Data pengguna berhasil diperbarui.",
        [{ text: "OK", onPress: () => router.back() }]
      );
    } catch (error: any) {
      Alert.alert("Error", `Gagal memperbarui pengguna: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const diseases = [
    { label: 'Pilih penyakit', value: '' },
    { label: 'Diabetes Melitus', value: 'diabetes_melitus' },
    { label: 'Hipertensi', value: 'hipertensi' },
    { label: 'Kanker', value: 'kanker' }
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
        <Text className="text-xl font-bold text-gray-800">Edit Pengguna</Text>
        <TouchableOpacity onPress={handleUpdate} disabled={isSubmitting} className="p-2">
          {isSubmitting ? <ActivityIndicator color="#0BBEBB" /> : <Ionicons name="checkmark-done" size={28} color="#0BBEBB" />}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <View className="space-y-5">
          {/* Email (read-only) */}
          <View>
            <Text className="text-base text-gray-600 mb-2">Email</Text>
            <TextInput
              value={form.email}
              editable={false}
              className="border border-gray-200 bg-gray-100 text-gray-500 p-4 rounded-xl text-base"
            />
          </View>

          {/* Nama Lengkap */}
          <View>
            <Text className="text-base text-gray-600 mb-2">Nama Lengkap</Text>
            <TextInput
              value={form.name}
              onChangeText={(e) => setForm({ ...form, name: e })}
              placeholder="Masukkan nama lengkap pengguna"
              className="border border-gray-300 p-4 rounded-xl text-base"
            />
          </View>

          {/* Usia & Jenis Kelamin */}
          <View className="flex-row justify-between">
            <View className="flex-1 mr-2">
              <Text className="text-base text-gray-600 mb-2">Usia</Text>
              <TextInput
                value={form.age}
                onChangeText={(e) => setForm({ ...form, age: e })}
                placeholder="Tahun"
                keyboardType="numeric"
                className="border border-gray-300 p-4 rounded-xl text-base"
              />
            </View>
            <View className="flex-1 ml-2">
              <Text className="text-base text-gray-600 mb-2">Jenis Kelamin</Text>
              <View className="border border-gray-300 rounded-xl">
                 <Picker
                    selectedValue={form.gender}
                    onValueChange={(val) => setForm({ ...form, gender: val })}
                    style={{ height: 56 }}
                  >
                    <Picker.Item label="Pilih" value="" />
                    <Picker.Item label="Laki-laki" value="Laki-laki" />
                    <Picker.Item label="Perempuan" value="Perempuan" />
                  </Picker>
              </View>
            </View>
          </View>

          {/* Riwayat Penyakit */}
          <View>
            <Text className="text-base text-gray-600 mb-2">Riwayat Penyakit</Text>
            <View className="border border-gray-300 rounded-xl">
              <Picker
                selectedValue={form.disease}
                onValueChange={(val) => setForm({ ...form, disease: val })}
                style={{ height: 56 }}
              >
                {diseases.map((d) => <Picker.Item key={d.value} label={d.label} value={d.value} />)}
              </Picker>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditUserScreen;