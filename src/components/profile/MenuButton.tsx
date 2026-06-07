import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { ChevronRight, LucideIcon } from 'lucide-react-native';
import { colors } from '@/constants/colors';

interface MenuButtonProps {
  icon: LucideIcon;
  label: string;
  onPress: () => void;
  badge?: number;
  isLogout?: boolean;
}

export const MenuButton: React.FC<MenuButtonProps> = ({ icon: Icon, label, onPress, badge, isLogout }) => {
  return (
    <TouchableOpacity
      style={[styles.container, isLogout && styles.logoutContainer]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, isLogout && styles.logoutIconContainer]}>
        <Icon size={20} color={isLogout ? '#EF4444' : colors.primary} />
      </View>
      
      <Text style={[styles.label, isLogout && styles.logoutLabel]}>{label}</Text>
      
      {badge && badge > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badge > 9 ? '9+' : badge}</Text>
        </View>
      )}
      
      {!isLogout && <ChevronRight size={20} color={colors.textSecondary} />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  logoutContainer: {
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#DBEAFE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  logoutIconContainer: {
    backgroundColor: '#FEE2E2',
  },
  label: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#0F172A',
  },
  logoutLabel: {
    color: '#EF4444',
  },
  badge: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    marginRight: 8,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: 'white',
  },
});
