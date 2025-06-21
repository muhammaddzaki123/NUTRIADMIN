// app/(admin)/manage-users/add-user.tsx

import { createNewUser } from '@/lib/appwrite';
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

const AddUserScreen = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State untuk setiap field dalam form
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    gender: '',
    disease: 'Pilih penyakit', // Nilai awal untuk Picker
  });

  const handleCreateUser = async () => {
    // Validasi input
    if (!form.name || !form.email || !form.password || !form.age || !form.gender || form.disease === 'Pilih penyakit') {
      Alert.alert("Input Tidak Lengkap", "Semua kolom wajib diisi.");
      return;
    }

    setIsSubmitting(true);
    try {
      await createNewUser({
        ...form,
        disease: form.disease.toLowerCase(), // Simpan dalam format lowercase
      });

      Alert.alert(
        "Sukses!",
        "Pengguna baru berhasil dibuat.",
        [{ text: "OK", onPress: () => router.back() }] // Kembali ke halaman daftar
      );

    } catch (error: any) {
      console.error("Gagal membuat pengguna:", error);
      Alert.alert("Error", `Gagal membuat pengguna: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const diseases = ['Pilih penyakit', 'Diabetes', 'Hipertensi', 'Kanker'];

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header Halaman */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <Ionicons name="close" size={28} color="#333" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-800">Tambah Pengguna Baru</Text>
        <TouchableOpacity
          onPress={handleCreateUser}
          disabled={isSubmitting}
          className="p-2"
        >
          {isSubmitting ? (
            <ActivityIndicator color="#0BBEBB" />
          ) : (
            <Ionicons name="checkmark-done" size={28} color="#0BBEBB" />
          )}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <View className="space-y-5">
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
          
          {/* Email */}
          <View>
            <Text className="text-base text-gray-600 mb-2">Email</Text>
            <TextInput
              value={form.email}
              onChangeText={(e) => setForm({ ...form, email: e })}
              placeholder="Contoh: user@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              className="border border-gray-300 p-4 rounded-xl text-base"
            />
          </View>

          {/* Password */}
          <View>
            <Text className="text-base text-gray-600 mb-2">Password</Text>
            <TextInput
              value={form.password}
              onChangeText={(e) => setForm({ ...form, password: e })}
              placeholder="Buat password untuk pengguna"
              secureTextEntry
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
                {diseases.map((d) => <Picker.Item key={d} label={d} value={d} />)}
              </Picker>
            </View>
          </View>

          {/* Tombol Buat Akun */}
          <TouchableOpacity
            onPress={handleCreateUser}
            disabled={isSubmitting}
            className={`py-4 rounded-xl items-center mt-4 ${isSubmitting ? 'bg-gray-400' : 'bg-blue-500'}`}
          >
            <Text className="text-white font-bold text-lg">
              {isSubmitting ? 'Membuat Akun...' : 'Buat Akun Pengguna'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddUserScreen;