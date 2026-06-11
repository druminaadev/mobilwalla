import React from 'react';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { View, StyleSheet } from 'react-native';

/**
 * Decorative wave/curve shape between text and image in OfferCard
 * Creates smooth organic transition with accent stroke
 */
interface DecorativeWaveProps {
    width: number;
    height: number;
}

export const DecorativeWave: React.FC<DecorativeWaveProps> = ({ width, height }) => {
    const styles = StyleSheet.create({
        container: {
            position: 'absolute',
            right: 0,
            top: '50%',
            transform: [{ translateY: -height / 2 }],
        },
    });

    return (
        <View style={styles.container}>
            <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
                <Defs>
                    <LinearGradient id="waveGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
                        <Stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.8" />
                    </LinearGradient>
                </Defs>

                {/* Main wave path */}
                <Path
                    d={`M ${width * 0.3} 0 
             Q ${width * 0.5} ${height * 0.15} ${width * 0.6} ${height * 0.3}
             Q ${width * 0.7} ${height * 0.5} ${width * 0.8} ${height * 0.7}
             Q ${width * 0.85} ${height * 0.85} ${width} ${height}
             L ${width} 0
             Z`}
                    fill="url(#waveGrad)"
                    stroke="#0E6663"
                    strokeWidth="2"
                    strokeOpacity="0.25"
                />

                {/* Accent curve detail */}
                <Path
                    d={`M ${width * 0.35} 0 
             Q ${width * 0.5} ${height * 0.2} ${width * 0.65} ${height * 0.4}
             Q ${width * 0.75} ${height * 0.6} ${width * 0.9} ${height}`}
                    fill="none"
                    stroke="#0E6663"
                    strokeWidth="1.5"
                    strokeOpacity="0.15"
                />
            </Svg>
        </View>
    );
};
