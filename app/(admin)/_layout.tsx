import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const AdminTabLayout = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#0BBEBB',
          tabBarInactiveTintColor: '#666876',
          tabBarShowLabel: true,
          tabBarStyle: {
            backgroundColor: '#FFFFFF',
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Dashboard',
            tabBarIcon: ({ color, focused, size }) => (
              <Ionicons 
                name={focused ? 'grid' : 'grid-outline'} 
                size={size}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="manage-articles"
          options={{
            title: 'Artikel',
            tabBarIcon: ({ color, focused, size }) => (
              <Ionicons 
                name={focused ? 'document-text' : 'document-text-outline'}
                size={size}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="manage-users"
          options={{
            title: 'Pengguna',
            tabBarIcon: ({ color, focused, size }) => (
              <Ionicons
                name={focused ? 'people' : 'people-outline'}
                size={size}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="edit-disease-info"
          options={{
            title: 'diases info',
            tabBarIcon: ({ color, focused, size }) => (
              <Ionicons
                name={focused ? 'medkit' : 'medkit-outline'}
                size={size}
                color={color}
              />
            ),
          }}
        />
      </Tabs>
    </GestureHandlerRootView>
  );
};

export default AdminTabLayout;