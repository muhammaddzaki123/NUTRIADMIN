// app/(admin)/manage-articles/_layout.tsx

import { Stack } from 'expo-router';
import React from 'react';
import { StatusBar } from 'expo-status-bar';

/**
 * Layout untuk grup manajemen artikel.
 * Menggunakan Stack Navigator untuk memungkinkan navigasi
 * antara halaman daftar artikel, halaman buat, dan halaman edit.
 */
const ArticleManagementLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen
          name="index" // Merujuk ke app/(admin)/manage-articles/index.tsx
          options={{
            headerShown: false, // Header akan kita buat kustom di dalam halaman
          }}
        />
        <Stack.Screen
          name="create" // Merujuk ke app/(admin)/manage-articles/create.tsx
          options={{
            headerShown: false,
            // Opsi untuk membuat halaman muncul dari bawah (modal)
            presentation: 'modal', 
          }}
        />
        <Stack.Screen
          name="[id]" // Merujuk ke app/(admin)/manage-articles/[id].tsx
          options={{
            headerShown: false,
            presentation: 'modal',
          }}
        />
      </Stack>

      {/* Pastikan gaya status bar konsisten */}
      <StatusBar backgroundColor="#F3F4F6" style="dark" />
    </>
  );
};

export default ArticleManagementLayout;