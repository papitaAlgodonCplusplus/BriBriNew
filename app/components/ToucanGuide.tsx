// app/components/ToucanGuide.tsx
import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import {Image} from "expo-image";

type ToucanMood = 'idle' | 'happy' | 'thinking' | 'speaking';

interface ToucanGuideProps {
  mood?: ToucanMood;
  message?: string;
  onPress?: () => void;
  position?: { bottom?: number; top?: number; left?: number; right?: number };
}

const ToucanGuide: React.FC<ToucanGuideProps> = ({ 
  mood = 'idle', 
  message, 
  onPress,
  position = { bottom: 20, right: 20 } 
}) => {
  const [isGuideEnabled, setIsGuideEnabled] = useState<boolean>(true);
  const [showMessage, setShowMessage] = useState<boolean>(!!message);
  const bounceAnim = useRef(new Animated.Value(0)).current;

  // Get toucan images based on mood
  const getToucanImage = () => {
    switch (mood) {
      case 'happy':
        return require('@/assets/images/toucan_happy.gif');
      case 'thinking':
        return require('@/assets/images/toucan_thinking.png');
      case 'speaking':
        return require('@/assets/images/toucan_speaking.png');
      case 'idle':
      default:
        return require('@/assets/images/toucan_happy.gif');
    }
  };

  useEffect(() => {
    const checkGuideEnabled = async () => {
      try {
        const guideEnabled = await AsyncStorage.getItem('toucanGuideEnabled');
        setIsGuideEnabled(guideEnabled !== 'false'); // Default to true if not set
      } catch (error) {
        console.error('Error checking guide status:', error);
      }
    };

    checkGuideEnabled();

    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    setShowMessage(!!message);

    if (message) {
      const timer = setTimeout(() => {
        setShowMessage(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [message]);

  if (!isGuideEnabled) return null;

  const handlePress = () => {
    if (message) {
      setShowMessage(!showMessage);
    }

    if (onPress) {
      onPress();
    }
  };

  const translateY = bounceAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10],
  });

  return (
    <View style={[styles.container, position]}>
      {showMessage && (
        <View style={styles.messageContainer}>
          <Text style={styles.messageText}>{message}</Text>
        </View>
      )}

      <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
        <Animated.View
          style={{
            transform: [{ translateY }],
          }}
        >
          <Image
            source={getToucanImage()}
            style={styles.toucanImage}
          />
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 100,
  },
  toucanImage: {
    width: wp('15%'),
    height: hp('15%'),
  },
  messageContainer: {
    position: 'absolute',
    bottom: hp('15%'),
    right: 0,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    borderWidth: 2,
    borderColor: '#FFD700',
    width: wp('40%'),
    minHeight: hp('10%'),
    zIndex: 101,
  },
  messageText: {
    fontSize: hp('2%'),
    color: '#333',
  },
});

export default ToucanGuide;