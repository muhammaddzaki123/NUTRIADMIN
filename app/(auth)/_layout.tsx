import { Redirect, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';

// Pastikan ini adalah Global Provider yang dikhususkan untuk Admin
import { useGlobalContext } from '@/lib/global-provider'; 

/**
 * Layout untuk grup otentikasi admin.
 * Fungsi utamanya adalah untuk melindungi rute:
 * - Jika admin sudah login, alihkan ke '/dashboard'.
 * - Jika belum, tampilkan halaman login atau register.
 */
const AuthLayoutAdmin = () => {
  // Mengambil status login dan loading dari konteks global admin
  const { isLogged, loading } = useGlobalContext();

  // Selama proses pengecekan sesi berlangsung, tampilkan loading indicator
  // untuk mencegah layar berkedip antara halaman login dan dashboard.
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#161622' }}>
        <ActivityIndicator size="large" color="#FFFFFF" />
      </View>
    );
  }

  // Jika pengecekan selesai dan admin sudah login, alihkan ke dashboard.
  if (!loading && isLogged) {
    // Pastikan '/dashboard' adalah halaman utama untuk admin Anda.
    return <Redirect href="/" />;
  }

  // Jika tidak ada sesi aktif, tampilkan navigator untuk halaman login/register.
  return (
    <>
      <Stack>
        <Stack.Screen
          name="sign-in"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          // Pastikan nama ini sesuai dengan nama file Anda,
          // misalnya 'sign-up.tsx' atau 'register.tsx'.
          name="sign-up" 
          options={{
            headerShown: false,
          }}
        />
      </Stack>

      {/* Mengatur gaya status bar untuk semua layar di dalam grup auth. */}
      <StatusBar backgroundColor="#161622" style="light" />
    </>
  );
};

export default AuthLayoutAdmin;
