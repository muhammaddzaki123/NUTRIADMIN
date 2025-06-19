import { registerAdmin, signInAdmin } from '@/lib/appwrite'; // Menggunakan fungsi yang sudah diperbaiki
import { useGlobalContext } from "@/lib/global-provider"; // Asumsi ada global provider untuk admin
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, SafeAreaView, StyleSheet, ScrollView } from 'react-native';

export default function SignUpAdminScreen() {
  const router = useRouter();
  const { refetch } = useGlobalContext(); // Untuk refresh data admin setelah login
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert("Error", "Semua kolom harus diisi.");
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Daftarkan akun admin baru
      await registerAdmin(name, email, password);
      
      // 2. Jika berhasil, langsung coba login
      await signInAdmin(email, password);
      
      // 3. Refresh data global dan arahkan ke dashboard
      await refetch();
      router.replace('/'); // Arahkan ke halaman utama admin

    } catch (error: any) {
      // Menampilkan pesan error dari Appwrite
      Alert.alert("Error Registrasi", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
        <Text style={styles.title}>Registrasi Admin Baru</Text>
        <Text style={styles.subtitle}>Peringatan: Halaman ini hanya untuk development.</Text>
        
        <TextInput
          placeholder="Nama Lengkap"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />

        <TouchableOpacity
          onPress={handleRegister}
          disabled={isSubmitting}
          style={[styles.button, { backgroundColor: isSubmitting ? '#999' : '#0BBEBB' }]}
        >
          <Text style={styles.buttonText}>
            {isSubmitting ? 'Mendaftarkan...' : 'Daftar & Masuk'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/sign-in')}>
          <Text style={styles.link}>Sudah punya akun? Login di sini</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

// Anda bisa menyesuaikan style ini agar cocok dengan tema aplikasi admin Anda
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    padding: 20, 
    backgroundColor: '#161622' // Contoh warna latar belakang gelap
  },
  title: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    marginBottom: 10,
    color: 'white',
  },
  subtitle: {
    fontSize: 14,
    color: 'gray',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: { 
    backgroundColor: '#232533',
    color: 'white',
    borderWidth: 1, 
    borderColor: '#333', 
    padding: 15, 
    borderRadius: 10, 
    marginBottom: 15, 
    fontSize: 16 
  },
  button: { 
    padding: 15, 
    borderRadius: 10, 
    alignItems: 'center' 
  },
  buttonText: { 
    color: 'white', 
    fontWeight: 'bold', 
    fontSize: 16 
  },
  link: { 
    marginTop: 20, 
    color: '#0BBEBB', 
    textAlign: 'center',
    fontSize: 16
  }
});
