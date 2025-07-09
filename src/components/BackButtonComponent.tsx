import Fontsize from '@/constants/Fontsize';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Pressable } from 'react-native';

export default function BackButtonComponent({color,size}: { color?: string,size?: number }) {
  const textColor = useThemeColor({}, 'text');

  return (
    <Pressable
      android_ripple={{ color: 'transparent' }}
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
      }}
      onPress={() => router.back()}
    >
      <Ionicons
        name="chevron-back"
        size={size ? size : Fontsize.FontSizes['4xl'] * 1.4}
        color={color ? color : textColor}
      />
    </Pressable>
  );
}
