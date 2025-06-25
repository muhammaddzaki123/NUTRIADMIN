import { Stack } from 'expo-router';
import React from 'react';

// Layout ini hanya untuk grup info penyakit
export default function DiseaseInfoLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index" // Merujuk ke index.tsx di folder yang sama
        options={{ headerShown: false }} 
      />
      <Stack.Screen
        name="[id]" // Merujuk ke [id].tsx (halaman edit)
        options={{ 
          headerShown: false, 
          presentation: 'modal' // Tampil sebagai modal dari atas
        }} 
      />
    </Stack>
  );
}