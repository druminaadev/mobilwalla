import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  FadeOut,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withRepeat,
} from 'react-native-reanimated';
import { colors } from '../../constants/colors';

export const SkeletonLoader = () => {
  const sv = useSharedValue(0.3);

  useEffect(() => {
    sv.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 800 }),
        withTiming(0.3, { duration: 800 })
      ),
      -1,
      true
    );
  }, [sv]);

  const style = useAnimatedStyle(() => ({ opacity: sv.value }));

  return (
    <Animated.View exiting={FadeOut.duration(400)} style={{ flex: 1, width: '100%' }}>
      <Animated.View style={[styles.skeletonContainer, style]}>
        <View style={styles.skeletonBanner} />
        <View style={styles.skeletonRow}>
          {[1, 2, 3, 4].map(i => <View key={i} style={styles.skeletonCircle} />)}
        </View>
        <View style={styles.skeletonCard} />
        <View style={styles.skeletonCard} />
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  skeletonContainer: { flex: 1, padding: 16 },
  skeletonBanner: { width: '100%', height: 190, backgroundColor: colors.gray200, borderRadius: 20, marginBottom: 24 },
  skeletonRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 32 },
  skeletonCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: colors.gray200 },
  skeletonCard: { width: '100%', height: 120, backgroundColor: colors.gray200, borderRadius: 16, marginBottom: 16 },
});
