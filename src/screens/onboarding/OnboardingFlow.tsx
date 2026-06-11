import React, { useState, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { WelcomeScreen } from './WelcomeScreen';
import { SeamlessBookingScreen } from './SeamlessBookingScreen';
import { FavoriteSalonScreen } from './FavoriteSalonScreen';
import { InteractiveMapScreen } from './InteractiveMapScreen';

// Screen order per spec:
// 0 — Welcome
// 1 — Seamless Booking  (dot 0 active)
// 2 — Favorite Salon    (dot 1 active)
// 3 — Interactive Map   (dot 2 active)

interface OnboardingFlowProps {
  onComplete: () => void;
  onSignIn: () => void;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete, onSignIn }) => {
  const [screen, setScreen] = useState(0);
  const fade = useRef(new Animated.Value(1)).current;

  const go = (next: number) => {
    Animated.sequence([
      Animated.timing(fade, { toValue: 0, duration: 130, useNativeDriver: true }),
      Animated.timing(fade, { toValue: 1, duration: 180, useNativeDriver: true }),
    ]).start();
    setScreen(next);
  };

  const next = () => (screen < 3 ? go(screen + 1) : onComplete());
  const prev = () => (screen > 1 ? go(screen - 1) : undefined);

  const renderScreen = () => {
    switch (screen) {
      case 0:
        return <WelcomeScreen onGetStarted={() => go(1)} onSignIn={onSignIn} />;
      case 1:
        return (
          <SeamlessBookingScreen onNext={next} onPrevious={() => go(0)} onSkip={onComplete} />
        );
      case 2:
        return (
          <FavoriteSalonScreen onNext={next} onPrevious={prev} onSkip={onComplete} />
        );
      case 3:
        return <InteractiveMapScreen onNext={onComplete} onPrevious={prev} onSkip={onComplete} />;
      default:
        return null;
    }
  };

  return (
    <Animated.View style={[styles.root, { opacity: fade }]}>
      {renderScreen()}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1 },
});
