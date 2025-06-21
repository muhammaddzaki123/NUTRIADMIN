// app/(admin)/_layout.tsx

import { Tabs } from 'expo-router';
import { Image, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons'; // Menggunakan Ionicons untuk ikon

// Komponen kustom untuk ikon tab
const TabIcon = ({ iconName, color, focused, title }: { iconName: keyof typeof Ionicons.glyphMap; color: string; focused: boolean; title:string }) => {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', gap: 2 }}>
      <Ionicons name={iconName} size={24} color={color} />
      <Text style={{ color: color, fontSize: 12, fontWeight: focused ? '600' : '400' }}>
        {title}
      </Text>
    </View>
  );
};

const AdminTabLayout = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: false, // Header akan diatur di setiap halaman secara individual
          tabBarShowLabel: false,
          tabBarActiveTintColor: '#0BBEBB', // Warna ikon aktif
          tabBarInactiveTintColor: '#666876', // Warna ikon tidak aktif
          tabBarStyle: {
            backgroundColor: '#FFFFFF',
            borderTopWidth: 1,
            borderTopColor: '#E5E7EB',
            height: 84,
            paddingBottom: 10,
          },
        }}
      >
        <Tabs.Screen
          name="index" // Merujuk ke app/(admin)/index.tsx
          options={{
            title: 'Dashboard',
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                iconName={focused ? 'grid' : 'grid-outline'}
                color={color}
                focused={focused}
                title="Dashboard"
              />
            ),
          }}
        />
        <Tabs.Screen
          name="manage-articles" // Merujuk ke app/(admin)/manage-articles/
          options={{
            title: 'Artikel',
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                iconName={focused ? 'document-text' : 'document-text-outline'}
                color={color}
                focused={focused}
                title="Artikel"
              />
            ),
          }}
        />
      </Tabs>
    </GestureHandlerRootView>
  );
};

export default AdminTabLayout;