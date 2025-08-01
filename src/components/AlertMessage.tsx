// components/AlertMessage.tsx
import React, { useEffect } from 'react';
import { Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAlertStore } from '@/store/alertStore';


const AlertMessage = () => {
  const { visible, message, type, duration, hideAlert } = useAlertStore();
  const slideAnim = new Animated.Value(-100);

  const COLORS = {
    info: '#2D9CDB',
    success: '#27AE60',
    error: '#EB5757',
    warning: '#F2C94C',
  };

  const ICONS: Record<'info' | 'success' | 'error' | 'warning', React.ComponentProps<typeof Feather>['name']> = {
    info: 'info',
    success: 'check-circle',
    error: 'x-circle',
    warning: 'alert-triangle',
  };

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
      }).start();

      const timer = setTimeout(() => {
        Animated.timing(slideAnim, {
          toValue: -100,
          duration: 300,
          useNativeDriver: true,
        }).start(() => hideAlert());
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.container, {
      transform: [{ translateY: slideAnim }],
      backgroundColor: COLORS[type]
    }]}>
      <Feather name={ICONS[type] ? ICONS[type]:'info'} size={20} color="#fff" style={styles.icon} />
      <Text style={styles.text}>{message}</Text>
      <TouchableOpacity onPress={hideAlert}>
        <Feather name="x" size={18} color="#fff" />
      </TouchableOpacity>
    </Animated.View>
  );
};

export default AlertMessage;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    padding: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 999,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  text: {
    color: '#fff',
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
  },
  icon: {
    marginRight: 4,
  },
});
