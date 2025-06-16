// app/(auth)/sign-in.tsx

import { signInAdmin } from '@/lib/appwrite';
import { useGlobalContext } from '@/lib/global-provider';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, SafeAreaView, StyleSheet } from 'react-native';

export default function SignInScreen() {
  const router = useRouter();
  const { refetch } = useGlobalContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Email dan password harus diisi.");
      return;
    }

    setIsSubmitting(true);
    try {
      // --- PERBAIKAN UTAMA DI SINI ---
      // Kirim password dalam bentuk teks biasa (plain text).
      // Fungsi signInAdmin yang akan melakukan hashing.
      await signInAdmin(email, password);
      // JANGAN LAKUKAN HASHING DI SINI: const hashedPassword = hashPassword(password);

      // Panggil refetch untuk memperbarui state global dan redirect
      await refetch();
      router.replace('/(admin)'); // Redirect ke dashboard admin setelah berhasil

    } catch (error: any) {
      Alert.alert("Error Login", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Admin Login</Text>
      
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
        onPress={handleLogin}
        disabled={isSubmitting}
        style={[styles.button, { backgroundColor: isSubmitting ? 'gray' : '#0BBEBB' }]}
      >
        <Text style={styles.buttonText}>
          {isSubmitting ? 'Logging In...' : 'Login'}
        </Text>
      </TouchableOpacity>

       <TouchableOpacity onPress={() => router.push('/register')}>
        <Text style={styles.link}>Buat akun admin baru</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

// Gaya dasar untuk halaman
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: 'white' },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 30, color: '#1a202c' },
  input: { borderWidth: 1, borderColor: '#CBD5E0', padding: 15, borderRadius: 10, marginBottom: 15, fontSize: 16 },
  button: { padding: 15, borderRadius: 10, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  link: { marginTop: 20, color: '#0BBEBB', textAlign: 'center', fontWeight: '600' }
});