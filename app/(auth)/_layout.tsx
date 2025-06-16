// app/(auth)/_layout.tsx

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';

/**
 * Layout untuk grup otentikasi.
 * Menggunakan Stack Navigator sederhana tanpa header.
 * Ini memungkinkan setiap halaman (login, register) untuk memiliki desainnya sendiri.
 */
const AuthLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen
          name="sign-in"
          options={{
            headerShown: false, // Sembunyikan header untuk halaman login
          }}
        />
        <Stack.Screen
          name="register"
          options={{
            headerShown: false, // Sembunyikan header untuk halaman register
          }}
        />
      </Stack>

      {/* Mengatur gaya status bar untuk semua layar di dalam grup auth.
        'light' cocok jika latar belakang halaman Anda cenderung gelap.
        Ganti menjadi 'dark' jika latar belakangnya terang.
      */}
      <StatusBar backgroundColor="#161622" style="light" />
    </>
  );
};

export default AuthLayout;