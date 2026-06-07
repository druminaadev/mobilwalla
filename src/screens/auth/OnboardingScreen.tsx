import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, Pressable, FlatList, ViewToken } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    image: require('../../../assets/salon1.jpg'),
    title: 'Discover Premium Salons',
    description: 'Find the best salons near you with expert stylists and quality services',
  },
  {
    id: '2',
    image: require('../../../assets/salon2.jpg'),
    title: 'Book Your Appointment',
    description: 'Easy online booking with flexible time slots that fit your schedule',
  },
  {
    id: '3',
    image: require('../../../assets/salon3.jpg'),
    title: 'Transform Your Look',
    description: 'Experience premium beauty services and unleash your confidence',
  },
];

export default function OnboardingScreen() {
  const navigation = useNavigation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index || 0);
    }
  }).current;

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      navigation.navigate('Login' as never);
    }
  };

  const handleSkip = () => {
    navigation.navigate('Login' as never);
  };

  const renderSlide = ({ item }: { item: typeof slides[0] }) => (
    <View style={styles.slide}>
      <Image source={item.image} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </Pressable>
        <View style={styles.pagination}>
          {slides.map((_, index) => (
            <View key={index} style={[styles.dot, index === currentIndex && styles.activeDot]} />
          ))}
        </View>
      </View>

      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
      />

      <Pressable onPress={handleNext} style={styles.button}>
        <LinearGradient colors={['#FF5C8A', '#FF8BA7']} style={styles.gradient}>
          <Text style={styles.buttonText}>
            {currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
          </Text>
        </LinearGradient>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, paddingTop: 48 },
  skipText: { fontSize: 16, color: '#64748B' },
  pagination: { flexDirection: 'row', gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#E2E8F0' },
  activeDot: { backgroundColor: '#FF5C8A', width: 24 },
  slide: { width, flex: 1 },
  image: { width, height: '50%', resizeMode: 'cover' },
  content: { padding: 32, alignItems: 'center' },
  title: { fontSize: 28, fontWeight: '800', color: '#1A1B2E', marginBottom: 16, textAlign: 'center' },
  description: { fontSize: 16, color: '#64748B', textAlign: 'center', lineHeight: 24 },
  button: { margin: 16, marginBottom: 32 },
  gradient: { padding: 16, borderRadius: 12, alignItems: 'center' },
  buttonText: { fontSize: 16, fontWeight: '700', color: '#fff' },
});
