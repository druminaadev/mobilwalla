import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { designTokens } from '../../screens/home/theme/tokens';

interface GlassContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const GlassContainer: React.FC<GlassContainerProps> = ({ children, style }) => {
  return <View style={[styles.container, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: designTokens.colors.glass,
    borderWidth: 1,
    borderColor: designTokens.colors.glassBorder,
    borderTopLeftRadius: designTokens.borderRadius.lg,
    borderTopRightRadius: designTokens.borderRadius.lg,
    padding: designTokens.spacing.lg,
    ...designTokens.shadows.card,
  },
});
