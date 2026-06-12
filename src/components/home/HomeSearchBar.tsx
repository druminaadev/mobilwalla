import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { useSharedValue, withSequence, withSpring } from 'react-native-reanimated';
import { Search } from 'lucide-react-native';
import { colors } from '../../constants/colors';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../types/navigation';

type NavigationProp = NativeStackNavigationProp<HomeStackParamList, 'Home'>;

export const HomeSearchBar = () => {
  const navigation = useNavigation<NavigationProp>();
  const searchScale = useSharedValue(1);

  const handleSearchPress = () => {
    searchScale.value = withSequence(withSpring(0.98), withSpring(1));
    setTimeout(() => navigation.navigate('Search'), 100);
  };

  return (
    <View style={styles.searchStickyContainer}>
      <Animated.View style={[styles.searchRow, { transform: [{ scale: searchScale }] }]}>
        <TouchableOpacity style={styles.searchBar} activeOpacity={0.9} onPress={handleSearchPress}>
          <Search size={20} color={colors.primary} />
          <Text style={styles.searchPlaceholder}>Search salons, services...</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterBtn}>
          <Text style={styles.filterIcon}>⌘</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  searchStickyContainer: { backgroundColor: '#fff', paddingBottom: 12, zIndex: 10 },
  searchRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 12 },
  searchBar: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: colors.gray50, height: 50, borderRadius: 16, paddingHorizontal: 16, gap: 10 },
  searchPlaceholder: { flex: 1, fontSize: 15, color: colors.textTertiary, fontWeight: '500' },
  filterBtn: { width: 50, height: 50, borderRadius: 16, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center' },
  filterIcon: { color: colors.white, fontSize: 20, fontWeight: '800' },
});
