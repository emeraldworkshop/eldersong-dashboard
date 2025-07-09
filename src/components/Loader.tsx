// components/GlobalLoading.tsx
import { useAlertStore } from '@/store/alertStore';
import React from 'react';
import { View, ActivityIndicator, StyleSheet, Modal } from 'react-native';

const Loader = () => {
  const { loading } = useAlertStore();

  return (
    <Modal visible={loading} transparent animationType="fade">
      <View style={styles.overlay}>
        <ActivityIndicator size="large" color="red" />
      </View>
    </Modal>
  );
};

export default Loader;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
