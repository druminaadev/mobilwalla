import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface PercentBadgeProps {
    value: number;
}

export const PercentBadge: React.FC<PercentBadgeProps> = ({ value }) => {
    const styles = StyleSheet.create({
        container: {
            backgroundColor: '#F9A826',
            width: 20,
            height: 20,
            borderRadius: 10,
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            bottom: -8,
            right: -8,
        },
        text: {
            fontSize: 10,
            fontWeight: '700',
            color: '#FFFFFF',
        },
    });

    return (
        <View style={styles.container}>
            <Text style={styles.text}>%</Text>
        </View>
    );
};
