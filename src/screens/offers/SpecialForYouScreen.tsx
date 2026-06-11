import React, { useCallback, useRef } from 'react';
import {
  View,
  SafeAreaView,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Text,
  ListRenderItemInfo,
  StatusBar,
  Animated,
  Image,
  Dimensions,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ArrowLeft, Tag, Clock, Sparkles } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 40;

interface Offer {
  id: string;
  title: string;
  discount: number;
  description: string;
  validUntil: string;
  image: any;
  code: string;
  color: string;
}

type Props = NativeStackScreenProps<any, 'SpecialForYou'>;

const OFFERS_DATA: Offer[] = [
  {
    id: '1',
    title: 'Flash Weekend Sale',
    discount: 40,
    description: 'All hair services',
    validUntil: '2 days left',
    code: 'WEEKEND40',
    color: '#FF6B9D',
    image: require('@assets/images/hair-color.webp'),
  },
  {
    id: '2',
    title: 'New Customer Special',
    discount: 30,
    description: 'First booking discount',
    validUntil: '5 days left',
    code: 'WELCOME30',
    color: '#6C63FF',
    image: require('@assets/images/salon.webp'),
  },
  {
    id: '3',
    title: 'Spa & Wellness',
    discount: 25,
    description: 'Relax & rejuvenate',
    validUntil: '7 days left',
    code: 'SPA25',
    color: '#26C6DA',
    image: require('@assets/images/beautician-with-brush-applies-white-moisturizing-mask-face-young-girl-client-spa-beauty-salon_343596-4247.webp'),
  },
  {
    id: '4',
    title: 'Bridal Package',
    discount: 20,
    description: 'Complete bridal makeover',
    validUntil: '10 days left',
    code: 'BRIDAL20',
    color: '#FF9F43',
    image: require('@assets/images/bridal.webp'),
  },
];

export default function SpecialForYouScreen({ navigation }: Props) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scrollY = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleBackPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleClaimOffer = useCallback((offer: Offer) => {
    console.log(`Claimed offer: ${offer.code}`);
  }, []);

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const renderOfferCard = useCallback(
    ({ item, index }: ListRenderItemInfo<Offer>) => {
      const inputRange = [-1, 0, CARD_WIDTH * index, CARD_WIDTH * (index + 2)];
      const scale = scrollY.interpolate({
        inputRange,
        outputRange: [1, 1, 1, 0.95],
        extrapolate: 'clamp',
      });

      return (
        <Animated.View style={[styles.cardWrapper, { transform: [{ scale }] }]}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => handleClaimOffer(item)}
            style={styles.card}
          >
            <Image source={item.image} style={styles.cardImage} />
            
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.85)']}
              style={styles.gradient}
            />

            <View style={styles.cardContent}>
              <View style={[styles.badge, { backgroundColor: item.color }]}>
                <Sparkles size={12} color="#fff" />
                <Text style={styles.badgeText}>EXCLUSIVE</Text>
              </View>

              <View style={[styles.discountCircle, { borderColor: item.color }]}>
                <Text style={styles.discountValue}>{item.discount}%</Text>
                <Text style={styles.discountLabel}>OFF</Text>
              </View>

              <View style={styles.cardBottom}>
                <View style={styles.cardInfo}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardDesc}>{item.description}</Text>
                  
                  <View style={styles.cardMeta}>
                    <View style={styles.metaItem}>
                      <Clock size={12} color="#fff" />
                      <Text style={styles.metaText}>{item.validUntil}</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <Tag size={12} color="#fff" />
                      <Text style={styles.metaText}>{item.code}</Text>
                    </View>
                  </View>
                </View>

                <TouchableOpacity
                  style={[styles.claimBtn, { backgroundColor: item.color }]}
                  onPress={() => handleClaimOffer(item)}
                >
                  <Text style={styles.claimBtnText}>Claim Now</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </Animated.View>
      );
    },
    [scrollY, handleClaimOffer]
  );

  const keyExtractor = useCallback((item: Offer) => item.id, []);

  const listHeaderComponent = useCallback(
    () => (
      <View style={styles.headerSpace}>
        <Text style={styles.heading}>Special Offers</Text>
        <Text style={styles.subheading}>
          Exclusive deals just for you
        </Text>
      </View>
    ),
    []
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <ArrowLeft size={22} color="#1A1B2E" strokeWidth={2.5} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Special Offers</Text>
          <View style={styles.headerSpacer} />
        </View>
      </Animated.View>

      <View style={styles.floatingBack}>
        <TouchableOpacity style={styles.floatingBackBtn} onPress={handleBackPress}>
          <ArrowLeft size={22} color="#1A1B2E" strokeWidth={2.5} />
        </TouchableOpacity>
      </View>

      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <Animated.FlatList
          data={OFFERS_DATA}
          renderItem={renderOfferCard}
          keyExtractor={keyExtractor}
          ListHeaderComponent={listHeaderComponent}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
        />
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FC',
  },
  container: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    backgroundColor: '#fff',
    paddingTop: 50,
    paddingBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1B2E',
  },
  headerSpacer: {
    width: 40,
  },
  floatingBack: {
    position: 'absolute',
    top: 50,
    left: 16,
    zIndex: 50,
  },
  floatingBackBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  listContent: {
    paddingTop: 100,
    paddingBottom: 40,
  },
  headerSpace: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  heading: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1A1B2E',
    marginBottom: 8,
  },
  subheading: {
    fontSize: 16,
    color: '#64748B',
    fontWeight: '500',
  },
  cardWrapper: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  card: {
    height: 380,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  cardImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  gradient: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  cardContent: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  badge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  discountCircle: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  discountValue: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    lineHeight: 32,
  },
  discountLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 1,
  },
  cardBottom: {
    gap: 16,
  },
  cardInfo: {
    gap: 8,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
  },
  cardMeta: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '600',
  },
  claimBtn: {
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  claimBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.5,
  },
});
