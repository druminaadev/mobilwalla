import React, { useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    ImageSourcePropType,
    Animated,
} from 'react-native';
import { DecorativeWave } from './DecorativeWave';
import { PercentBadge } from './PercentBadge';
import { colors } from '@/constants/colors';
import { borderRadius, spacing } from '@/constants/spacing';

interface OfferCardProps {
    id: string;
    badge: string;
    discount: number;
    image: ImageSourcePropType;
    onPress?: () => void;
}

export const OfferCard = React.memo(
    ({ id, badge, discount, image, onPress }: OfferCardProps) => {
        const scaleAnim = useRef(new Animated.Value(1)).current;

        const handlePressIn = () => {
            Animated.spring(scaleAnim, {
                toValue: 0.96,
                useNativeDriver: true,
            }).start();
        };

        const handlePressOut = () => {
            Animated.spring(scaleAnim, {
                toValue: 1,
                useNativeDriver: true,
            }).start();
        };

        const handlePress = () => {
            handlePressOut();
            onPress?.();
        };

        return (
            <View
                style={styles.container}
                accessibilityRole="button"
                accessible={true}
                accessibilityLabel={`Special offer: ${badge}, ${discount}% discount`}
                accessibilityHint="Double tap to claim offer"
            >
                <View style={styles.shadowLayer} />

                <View style={styles.cardContent}>
                    <View style={styles.leftSection}>
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>{badge}</Text>
                        </View>

                        <Text style={styles.title}>Get Special Offer</Text>

                        <View style={styles.discountContainer}>
                            <View>
                                <Text style={styles.discountLabel}>Up to</Text>
                                <View style={styles.discountValueRow}>
                                    <Text style={styles.discountValue}>{discount}</Text>
                                    <View style={styles.percentBadgeContainer}>
                                        <PercentBadge value={discount} />
                                    </View>
                                </View>
                            </View>
                        </View>

                        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                            <TouchableOpacity
                                style={styles.claimButton}
                                onPress={handlePress}
                                onPressIn={handlePressIn}
                                onPressOut={handlePressOut}
                                activeOpacity={1}
                                accessibilityRole="button"
                                accessibilityLabel={`Claim ${discount}% discount offer`}
                            >
                                <Text style={styles.claimButtonText}>Claim</Text>
                            </TouchableOpacity>
                        </Animated.View>
                    </View>

                    <View style={styles.rightSection}>
                        <Image
                            source={image}
                            style={styles.image}
                            accessibilityRole="image"
                            accessibilityLabel="Salon or spa service image"
                        />
                        <DecorativeWave width={60} height={170} />
                    </View>
                </View>
            </View>
        );
    },
    (prevProps, nextProps) => {
        return (
            prevProps.id === nextProps.id &&
            prevProps.badge === nextProps.badge &&
            prevProps.discount === nextProps.discount &&
            prevProps.image === nextProps.image &&
            prevProps.onPress === nextProps.onPress
        );
    }
);

OfferCard.displayName = 'OfferCard';

const styles = StyleSheet.create({
    container: {
        marginHorizontal: spacing.lg,
        marginBottom: spacing.lg,
        borderRadius: borderRadius.xl,
        overflow: 'hidden',
    },
    shadowLayer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: colors.white,
        borderRadius: borderRadius.xl,
        shadowColor: '#000000',
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 3,
    },
    cardContent: {
        flexDirection: 'row',
        height: 170,
        backgroundColor: colors.white,
        borderRadius: borderRadius.xl,
        overflow: 'hidden',
    },
    leftSection: {
        width: '55%',
        padding: spacing.lg,
        justifyContent: 'space-between',
    },
    rightSection: {
        width: '45%',
        position: 'relative',
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
        borderTopRightRadius: borderRadius.xl,
        borderBottomRightRadius: borderRadius.xl,
        resizeMode: 'cover',
    },
    badge: {
        backgroundColor: colors.white,
        borderRadius: borderRadius.md,
        paddingHorizontal: 12,
        paddingVertical: 6,
        alignSelf: 'flex-start',
    },
    badgeText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#555555',
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#222222',
        marginTop: spacing.md,
        lineHeight: 30,
    },
    discountContainer: {
        marginTop: spacing.md,
    },
    discountLabel: {
        fontSize: 18,
        fontWeight: '500',
        color: '#444444',
    },
    discountValueRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        position: 'relative',
    },
    discountValue: {
        fontSize: 52,
        fontWeight: '800',
        color: '#111111',
        lineHeight: 58,
    },
    percentBadgeContainer: {
        position: 'relative',
        width: 36,
        height: 36,
        marginLeft: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    claimButton: {
        backgroundColor: '#0E6663',
        height: 46,
        width: 110,
        borderRadius: 23,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: spacing.md,
    },
    claimButtonText: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.white,
    },
});
