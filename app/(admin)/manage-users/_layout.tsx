// app/(admin)/manage-users/_layout.tsx

import { Stack } from 'expo-router';
import React from 'react';
import { StatusBar } from 'expo-status-bar';

/**
 * Layout untuk grup manajemen pengguna.
 * Menggunakan Stack Navigator untuk navigasi antara daftar pengguna,
 * form tambah pengguna, dan form tambah ahli gizi.
 */
const UserManagementLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen
          name="index" // Merujuk ke app/(admin)/manage-users/index.tsx
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="add-user" // Merujuk ke app/(admin)/manage-users/add-user.tsx
          options={{
            headerShown: false,
            presentation: 'modal', // Tampil sebagai modal dari bawah
          }}
        />
        <Stack.Screen
          name="add-nutritionist" // Merujuk ke app/(admin)/manage-users/add-nutritionist.tsx
          options={{
            headerShown: false,
            presentation: 'modal',
          }}
        />
      </Stack>

      <StatusBar backgroundColor="#F3F4F6" style="dark" />
    </>
  );
};

export default UserManagementLayout;