import { FontAwesome } from '@expo/vector-icons';
import React, { useRef } from 'react';
import { Animated, Text, TouchableOpacity, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { formatTimestamp } from '../utils/date';

export interface NotificationItemProps {
  id: string;
  type: 'chat' | 'article' | 'recall';
  title: string;
  description: string;
  timestamp: string;
  onPress: () => void;
  onDelete: () => void;
  read?: boolean;
}

const getIcon = (type: 'chat' | 'article' | 'recall'): { name: "comment" | "newspaper-o" | "bell"; color: string } => {
  switch (type) {
    case 'chat':
      return { name: "comment", color: '#1CD6CE' };
    case 'article':
      return { name: "newspaper-o", color: '#4B7BE5' };
    case 'recall':
      return { name: "bell", color: '#FFA41B' };
    default:
      return { name: "bell", color: '#1CD6CE' };
  }
};

const NotificationItem: React.FC<NotificationItemProps> = ({
  id,
  type,
  title,
  description,
  timestamp,
  onPress,
  onDelete,
  read = false,
}) => {
  const formattedTime = formatTimestamp(timestamp);
  const icon = getIcon(type);
  
  // Animation for opening/closing
  const fadeAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  // Render right actions (delete button)
  const renderRightActions = () => {
    return (
      <TouchableOpacity 
        onPress={onDelete}
        className="bg-red-500 w-20 h-full justify-center items-center"
      >
        <FontAwesome name="trash" size={24} color="white" />
      </TouchableOpacity>
    );
  };

  return (
    <Swipeable
      renderRightActions={renderRightActions}
      overshootRight={false}
    >
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{
            translateY: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [50, 0]
            })
          }]
        }}
      >
        <TouchableOpacity
          onPress={onPress}
          className={`flex-row items-center bg-white rounded-xl p-4 my-1 mx-2 shadow-sm border ${!read ? 'border-blue-200' : 'border-gray-100'}`}
        >
          <View className="mr-4 w-10 h-10 rounded-full bg-gray-50 items-center justify-center">
            <FontAwesome 
              name={icon.name} 
              size={20} 
              color={icon.color}
            />
          </View>
          
          {!read && (
            <View className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-blue-500" />
          )}
          
          <View className="flex-1">
            <Text className={`${!read ? 'font-rubik-bold' : 'font-rubik-medium'} text-base text-gray-900`}>
              {title}
            </Text>
            <Text className="font-rubik text-sm text-gray-600 mt-1">
              {description}
            </Text>
            <Text className="font-rubik text-xs text-gray-400 mt-1">
              {formattedTime}
            </Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    </Swipeable>
  );
};

export default NotificationItem;