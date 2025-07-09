// styles/colors.ts

const tintColorLight = '#272727';
const tintColorDark = '#EDEDED';

export const Colors = {
  light: {
    text: '#11181C',
    textSecondary: '#687076',
    background: '#FFFFFF',
    secondaryBackground: '#F4F6F8',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    border: '#D0D5DD',
    cardBackground: '#F8FAFC',
    buttonBackground: '#1E293B',
    buttonText: '#FFFFFF',
    inputBackground: '#F8FAFC',
    inputBorder: '#CBD5E1',
    error: '#D32F2F',
    success: '#2E7D32',
    warning: '#F57C00',
  },
  dark: {
    text: '#ECEDEE',
    textSecondary: '#9BA1A6',
    background: '#000000',
    secondaryBackground: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    border: '#30363D',
    cardBackground: '#1C1E21',
    buttonBackground: '#3B82F6',
    buttonText: '#FFFFFF',
    inputBackground: '#2C2E33',
    inputBorder: '#3A3D42',
    error: '#EF5350',
    success: '#4CAF50',
    warning: '#FFA726',
  },
};

export default Colors;
