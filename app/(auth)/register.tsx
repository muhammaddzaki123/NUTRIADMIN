// app/register.tsx

import { registerAdmin } from '@/lib/appwrite';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, SafeAreaView, StyleSheet } from 'react-native';

export default function RegisterScreen() {
  const router = useRouter();
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
      // Panggil fungsi register dengan password teks biasa
      await registerAdmin(name, email, password);
      
      Alert.alert(
        "Sukses", 
        "Akun admin berhasil dibuat. Silakan login.",
        [{ text: "OK", onPress: () => router.push('./sign-in') }]
      );

    } catch (error: any) {
      Alert.alert("Error Registrasi", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Registrasi Admin Baru</Text>
      
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
        style={[styles.button, { backgroundColor: isSubmitting ? 'gray' : '#0BBEBB' }]}
      >
        <Text style={styles.buttonText}>
          {isSubmitting ? 'Mendaftarkan...' : 'Daftar'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('./sign-in')}>
        <Text style={styles.link}>Sudah punya akun? Login di sini</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

// Gaya dasar untuk halaman
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: 'gray', padding: 15, borderRadius: 10, marginBottom: 15, fontSize: 16 },
  button: { padding: 15, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  link: { marginTop: 20, color: '#0BBEBB', textAlign: 'center' }
});