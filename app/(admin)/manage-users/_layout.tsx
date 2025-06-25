import { Stack } from 'expo-router';
import React from 'react';
import { StatusBar } from 'expo-status-bar';

const UserManagementLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="add-user"
          options={{
            headerShown: false,
            presentation: 'modal', 
          }}
        />
        <Stack.Screen
          name="add-nutritionist" 
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