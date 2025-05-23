import React, { useState, useEffect, useRef } from 'react';
import {Image} from "expo-image";
import { 
  ImageBackground, 
  StyleSheet, 
  View, 
  TouchableOpacity, 
  Text,
  Animated,
  Easing
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackButton from '@/app/misc/BackButton';
import NextButton from '@/app/misc/NextButton';
import { NavigationProp } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const Guide1 = ({ navigation }: { navigation: NavigationProp<any> }) => {
  const bgImage = require('@/assets/images/guia1.jpeg');
  const [mode, setMode] = useState<'read' | 'listen' | null>(null);
  
  // Tutorial states
  const [tutorialStep, setTutorialStep] = useState(0);
  const [toucanEnabled, setToucanEnabled] = useState(true);
  
  // Animation values
  const toucanPosition = useRef(new Animated.ValueXY({ x: wp('30%'), y: hp('10%') })).current;
  const bubbleOpacity = useRef(new Animated.Value(0)).current;
  const elementHighlight = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        // Load learning mode
        const storedMode = await AsyncStorage.getItem('mode');
        setMode(storedMode === 'read' || storedMode === 'listen' ? storedMode : 'listen');
        
        // Check toucan preferences
        const toucanStatus = await AsyncStorage.getItem('toucanGuideEnabled');
        setToucanEnabled(toucanStatus !== 'false');
        
        // Check if the toucan should be shown
        // We'll check both level mapping completion and level 1 tutorial
        const levelMappingCompleted = await AsyncStorage.getItem('levelMappingTutorialCompleted');
        const level1Tutorial = await AsyncStorage.getItem('level1TutorialCompleted');
        
        // Start tutorial if toucan is enabled and either:
        // 1. This is the first time seeing guide 1 (level1Tutorial is not true), OR
        // 2. The user just came from level mapping (levelMappingCompleted is true)
        if (toucanStatus !== 'false' && 
            (level1Tutorial !== 'true' || levelMappingCompleted === 'true')) {
          // If the user just completed the level mapping tutorial, we should show the toucan
          // as a continuation of that flow
          const tutorialStartDelay = levelMappingCompleted === 'true' ? 1000 : 0;
          
          // Delay the tutorial start to make it feel like a continuous flow
          setTimeout(() => {
            startTutorial();
          }, tutorialStartDelay);
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };
    
    fetchSettings();
  }, []);
  
  const startTutorial = () => {
    setTutorialStep(1);
    
    // Start with intro animation
    Animated.sequence([
      Animated.timing(toucanPosition, {
        toValue: { x: wp('80%'), y: hp('-10%') },
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(bubbleOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  };
  
  const advanceTutorial = () => {
    // Reset animations
    bubbleOpacity.setValue(0);
    elementHighlight.setValue(0);
    
    // Move to next step
    const nextStep = tutorialStep + 1;
    setTutorialStep(nextStep);
    
    // Different animations based on tutorial step
    switch (nextStep) {
      case 2: // Point to the guide image
        Animated.parallel([
          Animated.timing(toucanPosition, {
            toValue: { x: wp('80%'), y: hp('20%') },
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(bubbleOpacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
            delay: 800,
          }),
          Animated.loop(
            Animated.sequence([
              Animated.timing(elementHighlight, {
                toValue: 1,
                duration: 800,
                useNativeDriver: false,
              }),
              Animated.timing(elementHighlight, {
                toValue: 0.2,
                duration: 800,
                useNativeDriver: false,
              }),
            ]),
            { iterations: 3 }
          ),
        ]).start();
        break;
      case 3: // Point to Next button
        Animated.parallel([
          Animated.timing(toucanPosition, {
            toValue: { x: wp('65%'), y: hp('25%') },
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(bubbleOpacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
            delay: 800,
          }),
          Animated.loop(
            Animated.sequence([
              Animated.timing(elementHighlight, {
                toValue: 1,
                duration: 800,
                useNativeDriver: false,
              }),
              Animated.timing(elementHighlight, {
                toValue: 0.2,
                duration: 800,
                useNativeDriver: false,
              }),
            ]),
            { iterations: 3 }
          ),
        ]).start();
        break;
      case 4: // Final message
        Animated.parallel([
          Animated.timing(toucanPosition, {
            toValue: { x: wp('80%'), y: hp('20%') },
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(bubbleOpacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
            delay: 800,
          }),
        ]).start();
        break;
      case 5: // Save state and complete tutorial
        completeTutorial();
        break;
    }
  };
  
  const completeTutorial = async () => {
    try {
      // Mark the tutorial as completed
      await AsyncStorage.setItem('level1TutorialCompleted', 'true');
      
      // Important: If we just came from level mapping, mark that we're now moving to level 1
      // This helps create a continuous flow of the toucan guide
      await AsyncStorage.setItem('movingToLevel1', 'true');
      
      setTutorialStep(0);
      
      // Animate toucan to final position
      Animated.parallel([
        Animated.timing(bubbleOpacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(toucanPosition, {
          toValue: { x: wp('80%'), y: hp('-10%') },
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start();
    } catch (error) {
      console.error('Error saving tutorial state:', error);
    }
  };
  
  const handleToucanPress = () => {
    if (tutorialStep > 0) {
      advanceTutorial();
    } else {
      // Normal toucan behavior when not in tutorial
      // Show helpful tips about this level
      startTutorial();
    }
  };
  
  // Navigate to level 1 and ensure the toucan follows
  const handleNextButtonPress = async () => {
    if (tutorialStep === 3) {
      // If we're in the tutorial pointing at the next button,
      // mark that we're transitioning to level_1
      await AsyncStorage.setItem('movingToLevel1', 'true');
      advanceTutorial();
    }
    
    // Navigate to level 1
    navigation.navigate(mode === 'listen' ? 'Level1Listen' : 'Level1');
  };
  
  // Get tutorial message based on current step
  const getTutorialMessage = () => {
    switch (tutorialStep) {
      case 1:
        return '¡Bienvenido al Nivel 1! Aquí aprenderás palabras básicas en BriBri.';
      case 2:
        return 'Esta es la guía del nivel. Mira las imágenes y lee el texto para aprender el vocabulario.';
      case 3:
        return 'Cuando estés listo, presiona el botón "Siguiente" para comenzar el ejercicio.';
      case 4:
        return '¡Perfecto! Ahora que conoces cómo funciona el juego, ¡vamos a aprender BriBri!';
      default:
        return '';
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {/* Background Image */}
        <ImageBackground 
          source={bgImage} 
          style={styles.bgImage}
          imageStyle={{ resizeMode: 'contain' }}
        >
          {/* Main content highlight during tutorial */}
          {tutorialStep === 2 && (
            <Animated.View
              style={[
                styles.contentHighlight,
                { opacity: elementHighlight }
              ]}
            />
          )}
        </ImageBackground>
        
        {/* Toucan Guide with animated position */}
        {toucanEnabled && (
          <Animated.View 
            style={[
              styles.toucanContainer,
              { 
                transform: [
                  { translateX: toucanPosition.x },
                  { translateY: toucanPosition.y }
                ] 
              }
            ]}
          >
            <Animated.View style={[
              styles.speechBubble, 
              { opacity: bubbleOpacity }
            ]}>
              <Text style={styles.speechText}>{getTutorialMessage()}</Text>
              {tutorialStep > 0 && tutorialStep < 5 && (
                <Text style={styles.tapToContinue}>Tócame para continuar</Text>
              )}
            </Animated.View>

            <TouchableOpacity 
              onPress={handleToucanPress}
              activeOpacity={0.7}
            >
              <Image
                source={require('@/assets/images/toucan_happy.gif')} 
                style={styles.toucanImage}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </Animated.View>
        )}
        
        {/* Back Button */}
        <View style={styles.buttonsBackContainer}>
          <BackButton navigation={navigation} />
        </View>
        
        {/* Next Button with highlight during tutorial */}
        <View style={styles.buttonsNextContainer}>
          {tutorialStep === 3 && (
            <Animated.View
              style={[
                styles.nextButtonHighlight,
                { opacity: elementHighlight }
              ]}
            />
          )}
          {/* Custom Next button that calls our custom handler */}
          <TouchableOpacity onPress={handleNextButtonPress} style={styles.button}>
            <Image
              source={require('@/assets/images/atras.png')}
              style={styles.adelante}
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffff',
    justifyContent: 'center',
  },
  bgImage: {
    position: 'absolute',
    alignSelf: 'center',
    width: wp('100%'),
    height: hp('135%'),
    top: hp('-23%'),
  },
  buttonsBackContainer: {
    bottom: hp('53%'),
    right: wp('3%'),
    zIndex: 5,
  },
  buttonsNextContainer: {
    top: hp('47.5%'),
    left: wp('1.2%'),
    zIndex: 5,
  },
  button: {
    position: 'absolute',
    bottom: 20,
    right: 10,
    zIndex: 1,
  },
  adelante: {
    width: 70,
    height: 40,
    transform: [{ rotate: '180deg' }, { translateX: 0 }, { translateY: 1 }],
    resizeMode: 'stretch',
  },
  // Toucan Guide styles
  toucanContainer: {
    position: 'absolute',
    zIndex: 10,
  },
  toucanImage: {
    width: wp('20%'),
    height: hp('20%'),
  },
  speechBubble: {
    position: 'absolute',
    top: -hp('12%'),
    right: wp('5%'),
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 10,
    borderWidth: 2,
    borderColor: '#FFD700',
    width: wp('45%'),
    minHeight: hp('10%'),
    zIndex: 11,
  },
  speechText: {
    fontSize: hp('1.8%'),
    color: '#333',
    textAlign: 'center',
  },
  tapToContinue: {
    fontSize: hp('1.5%'),
    color: '#888',
    textAlign: 'center',
    marginTop: 5,
    fontStyle: 'italic',
  },
  contentHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,0,0.2)',
    borderRadius: 15,
  },
  nextButtonHighlight: {
    position: 'absolute',
    width: wp('15%'),
    height: hp('15%'),
    backgroundColor: 'rgba(255,255,0,0.3)',
    borderRadius: 15,
    zIndex: 4,
  },
});

export default Guide1;