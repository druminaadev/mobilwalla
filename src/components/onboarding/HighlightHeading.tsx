import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { OB } from '../../constants/onboarding';

interface Props {
  parts: { text: string; highlight: boolean }[][];
}

export default function HighlightHeading({ parts }: Props) {
  return (
    <Text style={styles.heading}>
      {parts.map((line, li) => (
        <React.Fragment key={li}>
          {line.map((seg, si) => (
            <Text key={si} style={seg.highlight ? styles.gold : styles.dark}>
              {seg.text}
            </Text>
          ))}
          {li < parts.length - 1 ? '\n' : ''}
        </React.Fragment>
      ))}
    </Text>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 34,
    fontWeight: '700',
    lineHeight: 42,
    textAlign: 'center',
    color: OB.textPrimary,
  },
  dark: { color: OB.textPrimary },
  gold: { color: OB.gold },
});
