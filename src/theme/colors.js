import { Platform } from 'react-native';

export const colors = {
  // Brand Emerald & Forest Greens (Blinkit / Instacart modern style)
  primary: '#059669',          // Vibrant Fresh Emerald
  primaryDark: '#047857',      // Deep Forest Green
  primaryLight: '#D1FAE5',     // Mint cream background
  primaryMuted: '#ECFDF5',     // Ultra soft tint
  primaryGlow: 'rgba(5, 150, 105, 0.15)',

  // Amber / Saffron for Hot Deals & Ratings
  secondary: '#F59E0B',        // Warm Amber / Golden Honey
  secondaryDark: '#D97706',
  secondaryLight: '#FEF3C7',   // Soft Butter Cream
  secondaryGlow: 'rgba(245, 158, 11, 0.18)',

  // Royal Purple / Violet for Exclusive & Organic
  accent: '#8B5CF6',
  accentLight: '#EDE9FE',

  // Bright Coral Red for Favorites & Urgent Badges
  danger: '#EF4444',
  dangerLight: '#FEE2E2',
  dangerDark: '#DC2626',

  // Background & Surfaces
  background: '#F8FAFC',       // Clean cool neutral
  backgroundAlt: '#F1F5F9',
  surface: '#FFFFFF',          // Pure Card White
  surfaceHover: '#F8FAFC',
  surfaceGlass: 'rgba(255, 255, 255, 0.92)',

  // Text Hierarchy
  text: '#0F172A',             // Dark Slate
  textSecondary: '#475569',    // Slate Muted
  textLight: '#94A3B8',        // Cool Gray Placeholder
  textWhite: '#FFFFFF',

  // Borders & Dividers
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  borderFocus: '#10B981',

  // Status
  success: '#10B981',
  successLight: '#DCFCE7',
  warning: '#F59E0B',
  info: '#3B82F6',

  // Base
  white: '#FFFFFF',
  black: '#000000',
  shadow: '#0F172A',
};

export const typography = {
  fontFamily: Platform.select({
    ios: 'System',
    android: 'sans-serif-medium',
    default: 'sans-serif',
  }),
  fontFamilyBold: Platform.select({
    ios: 'System',
    android: 'sans-serif-bold',
    default: 'sans-serif',
  }),
  h1: 28,
  h2: 22,
  h3: 18,
  body: 15,
  caption: 13,
  small: 11,
};
