import React from 'react';
import Svg, { Circle } from 'react-native-svg';
import { View, StyleSheet } from 'react-native';

/**
 * Subtle dotted pattern background decoration
 * Placed at top center and bottom left
 */
interface DecorativeDotsProps {
    width: number;
    height: number;
    position: 'top' | 'bottom-left';
}

export const DecorativeDots: React.FC<DecorativeDotsProps> = ({ width, height, position }) => {
    const styles = StyleSheet.create({
        container: {
            position: 'absolute',
            opacity: 0.12,
        },
        topContainer: {
            top: 0,
            left: '50%',
            transform: [{ translateX: -width / 2 }],
        },
        bottomLeftContainer: {
            bottom: 0,
            left: 0,
        },
    });

    const dotSize = 6;
    const spacing = 18;
    const rows = Math.ceil(height / spacing) + 1;
    const cols = Math.ceil(width / spacing) + 1;
    const dots: { x: number; y: number }[] = [];

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            dots.push({
                x: j * spacing + spacing / 2,
                y: i * spacing + spacing / 2,
            });
        }
    }

    return (
        <View
            style={[
                styles.container,
                position === 'top' ? styles.topContainer : styles.bottomLeftContainer,
            ]}
        >
            <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
                {dots.map((dot, index) => (
                    <Circle
                        key={`dot-${index}`}
                        cx={dot.x}
                        cy={dot.y}
                        r={dotSize / 2}
                        fill="#0E6663"
                    />
                ))}
            </Svg>
        </View>
    );
};
