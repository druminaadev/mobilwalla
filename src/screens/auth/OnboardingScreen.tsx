import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { OnboardingFlow } from '../onboarding';

export default function OnboardingScreen() {
  const navigation = useNavigation();

  const handleComplete = () => {
    navigation.navigate('Login' as never);
  };

  const handleSignIn = () => {
    navigation.navigate('Login' as never);
  };

  return (
    <OnboardingFlow
      onComplete={handleComplete}
      onSignIn={handleSignIn}
    />
  );
}
