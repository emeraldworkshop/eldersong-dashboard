// store/useAlertStore.ts
import { create } from 'zustand';

type AlertType = 'info' | 'success' | 'error' | 'warning';

interface AlertState {
  visible: boolean;
  type: AlertType;
  message: string;
  showAlert: (type: AlertType, message: string, duration?: number) => void;
  hideAlert: () => void;
  duration: number;

  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export const useAlertStore = create<AlertState>((set) => ({
  visible: false,
  type: 'info',
  message: '',
  duration: 3000,
  loading: false,

  showAlert: (type, message, duration = 3000) => {
    set({ visible: true, type, message, duration });
  },
  hideAlert: () => set({ visible: false }),

  setLoading: (loading: boolean) => {
    set({ loading: loading });
  },
}));
