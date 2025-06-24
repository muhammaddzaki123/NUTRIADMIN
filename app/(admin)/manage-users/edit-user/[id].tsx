// app/(admin)/manage-users/edit-user/[id].tsx

import { getUserById, updateUser, updateUserPassword } from '@/lib/appwrite';
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
  const { id } = useLocalSearchParams<{ id: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPasswordSubmitting, setIsPasswordSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [password, setPassword] = useState('');

  const [form, setForm] = useState({
    name: '',
    email: '',
    age: '',
    gender: '',
    disease: '',
  });

  useEffect(() => {
    const fetchUserData = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const userData = await getUserById(id);
        if (userData) {
          setForm({
            name: userData.name,
            email: userData.email, // Email tidak bisa diedit
            age: userData.age ? userData.age.toString() : '',
            gender: userData.gender,
            disease: userData.disease,
          });
        }
      } catch (error) {
        Alert.alert("Error", "Gagal memuat data pengguna.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserData();
  }, [id]);

  const handleUpdate = async () => {
    if (!form.name || !form.age || !form.gender || !form.disease) {
      Alert.alert("Input Tidak Lengkap", "Semua kolom wajib diisi kecuali email.");
      return;
    }
    setIsSubmitting(true);
    try {
      await updateUser(id!, {
        name: form.name,
        age: form.age,
        gender: form.gender,
        disease: form.disease,
      });
      Alert.alert("Sukses!", "Data pengguna berhasil diperbarui.", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error: any) {
      Alert.alert("Error", `Gagal memperbarui: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordUpdate = async () => {
    if (password.length < 8) {
      Alert.alert("Error", "Password baru harus terdiri dari minimal 8 karakter.");
      return;
    }
    setIsPasswordSubmitting(true);
    try {
      await updateUserPassword(id!, password);
      Alert.alert("Sukses!", "Password pengguna berhasil diperbarui.");
      setPassword(''); // Kosongkan field setelah berhasil
    } catch (error: any) {
      Alert.alert("Error", `Gagal memperbarui password: ${error.message}`);
    } finally {
      setIsPasswordSubmitting(false);
    }
  };

  const diseases = [
    { label: 'Pilih penyakit', value: '' },
    { label: 'Diabetes Melitus', value: 'diabetes_melitus' },
    { label: 'Hipertensi', value: 'hipertensi' },
    { label: 'Kanker', value: 'kanker' },
    { label: 'Tidak Ada', value: 'tidak_ada' },
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
          <View>
            <Text className="text-base text-gray-600 mb-2">Nama Lengkap</Text>
            <TextInput value={form.name} onChangeText={(e) => setForm({ ...form, name: e })} className="border border-gray-300 p-4 rounded-xl text-base" />
          </View>
          <View>
            <Text className="text-base text-gray-600 mb-2">Email (Tidak dapat diubah)</Text>
            <TextInput value={form.email} editable={false} className="border border-gray-300 p-4 rounded-xl text-base bg-gray-100 text-gray-500" />
          </View>
          <View className="flex-row justify-between">
            <View className="flex-1 mr-2">
              <Text className="text-base text-gray-600 mb-2">Usia</Text>
              <TextInput value={form.age} onChangeText={(e) => setForm({ ...form, age: e })} keyboardType="numeric" className="border border-gray-300 p-4 rounded-xl text-base" />
            </View>
            <View className="flex-1 ml-2">
              <Text className="text-base text-gray-600 mb-2">Jenis Kelamin</Text>
              <View className="border border-gray-300 rounded-xl">
                <Picker selectedValue={form.gender} onValueChange={(val) => setForm({ ...form, gender: val })} style={{ height: 56 }}>
                  <Picker.Item label="Pilih" value="" />
                  <Picker.Item label="Laki-laki" value="Laki-laki" />
                  <Picker.Item label="Perempuan" value="Perempuan" />
                </Picker>
              </View>
            </View>
          </View>
          <View>
            <Text className="text-base text-gray-600 mb-2">Riwayat Penyakit</Text>
            <View className="border border-gray-300 rounded-xl">
              <Picker selectedValue={form.disease} onValueChange={(val) => setForm({ ...form, disease: val })} style={{ height: 56 }}>
                {diseases.map((d) => <Picker.Item key={d.value} label={d.label} value={d.value} />)}
              </Picker>
            </View>
          </View>
          <TouchableOpacity onPress={handleUpdate} disabled={isSubmitting} className={`py-4 rounded-xl items-center mt-4 ${isSubmitting ? 'bg-gray-400' : 'bg-blue-500'}`}>
            <Text className="text-white font-bold text-lg">{isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan Detail'}</Text>
          </TouchableOpacity>
        </View>

        {/* Bagian Ganti Password */}
        <View className="mt-8 pt-6 border-t border-gray-200">
          <Text className="text-xl font-bold text-gray-800 mb-4">Ganti Password</Text>
          <View>
            <Text className="text-base text-gray-600 mb-2">Password Baru</Text>
            <TextInput 
              value={password}
              onChangeText={setPassword}
              placeholder="Masukkan password baru (min. 8 karakter)"
              secureTextEntry
              className="border border-gray-300 p-4 rounded-xl text-base"
            />
          </View>
          <TouchableOpacity 
            onPress={handlePasswordUpdate} 
            disabled={isPasswordSubmitting || password.length < 8} 
            className={`py-4 rounded-xl items-center mt-4 ${(isPasswordSubmitting || password.length < 8) ? 'bg-gray-400' : 'bg-red-500'}`}
          >
            {isPasswordSubmitting ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-bold text-lg">Ubah Password</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditUserScreen;