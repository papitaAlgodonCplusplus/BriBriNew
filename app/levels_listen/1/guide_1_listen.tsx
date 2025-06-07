import BackButton from '@/app/misc/BackButton';
import NextButton from '@/app/misc/NextButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationProp } from '@react-navigation/native';
import { Audio } from 'expo-av';
import React, { useEffect, useState } from 'react';
import { Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const GuideListen = ({ navigation }: { navigation: NavigationProp<any> }) => {
  const bgImage = require('@/assets/images/guia1.jpeg');

  const [mode, setMode] = useState<'read' | 'listen' | null>(null);
  const [playbackSpeed, setPlaybackSpeed] = useState<'normal' | 'slow'>('normal');

  useEffect(() => {
    const fetchMode = async () => {
      const storedMode = await AsyncStorage.getItem('mode');
      setMode(storedMode === 'read' || storedMode === 'listen' ? storedMode : 'listen');
    };
    fetchMode();
  }, []);

  // Load speed preference from storage
  useEffect(() => {
    const loadSpeedPreference = async () => {
      try {
        const savedSpeed = await AsyncStorage.getItem('audioPlaybackSpeed');
        if (savedSpeed === 'slow' || savedSpeed === 'normal') {
          setPlaybackSpeed(savedSpeed);
        }
      } catch (error) {
        console.error('Error loading speed preference:', error);
      }
    };

    loadSpeedPreference();
  }, []);

  // Draggable elements are used here only to retrieve the audio files.
  const draggableElements = [
    {
      id: 1,
      name: 'nolo_nkuo',
      audio: require('@/assets/audios/nolo_nkuo_caminito_de_la_casa.wav'),
    },
    {
      id: 2,
      name: 'nolo_kibi',
      audio: require('@/assets/audios/nolo_kibi_camino_antes_de_la_casa.wav'),
    },
    {
      id: 3,
      name: 'ale',
      audio: require('@/assets/audios/ale_alero.wav'),
    },
    {
      id: 4,
      name: 'kapo',
      audio: require('@/assets/audios/kapo_hamaca.wav'),
    },
  ];

  // Audio boxes positioned similarly to the visual objects in level_1.tsx
  const audioBoxesData = [
    {
      id: 1,
      name: 'obj_ale',
      style: {
        position: 'absolute' as 'absolute',
        left: wp('24%'),
        top: hp('53%'),
        width: wp('8%'),
        height: hp('8%'),
        borderWidth: 3,
        borderColor: 'red',
        backgroundColor: 'rgba(255, 0, 0, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
      },
      audioName: 'ale'
    },
    {
      id: 2,
      name: 'obj_nolo_nkuo',
      style: {
        position: 'absolute' as 'absolute',
        left: wp('9%'),
        top: hp('99%'),
        width: wp('12%'),
        height: hp('8%'),
        borderWidth: 3,
        borderColor: 'yellow',
        backgroundColor: 'rgba(255, 255, 0, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
      },
      audioName: 'nolo_nkuo'
    },
    {
      id: 3,
      name: 'obj_kapo',
      style: {
        position: 'absolute' as 'absolute',
        left: wp('53%'),
        top: hp('108%'),
        width: wp('12%'),
        height: hp('8%'),
        borderWidth: 3,
        borderColor: 'orange',
        backgroundColor: 'rgba(255, 165, 0, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
      },
      audioName: 'kapo'
    },
    {
      id: 4,
      name: 'obj_nolo_kibi',
      style: {
        position: 'absolute' as 'absolute',
        left: wp('42%'),
        top: hp('100%'),
        width: wp('12%'),
        height: hp('7%'),
        borderWidth: 3,
        borderColor: 'green',
        backgroundColor: 'rgba(0, 255, 0, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
      },
      audioName: 'nolo_kibi'
    }
  ];

  // Function to play audio with speed control
  const playSound = async (audioName: string) => {
    const element = draggableElements.find(e => e.name === audioName);
    if (!element) return;

    try {
      const { sound } = await Audio.Sound.createAsync(element.audio);

      // Set playback rate based on speed setting
      const rate = playbackSpeed === 'slow' ? 0.7 : 1.0;
      await sound.setRateAsync(rate, true); // true preserves pitch

      await sound.playAsync();

      // Clean up sound object after playback
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync();
        }
      });
    } catch (error) {
      console.error('Error playing sound', error);
    }
  };

  // Toggle playback speed function
  const togglePlaybackSpeed = async () => {
    const newSpeed = playbackSpeed === 'normal' ? 'slow' : 'normal';
    setPlaybackSpeed(newSpeed);

    try {
      await AsyncStorage.setItem('audioPlaybackSpeed', newSpeed);
    } catch (error) {
      console.error('Error saving speed preference:', error);
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ImageBackground
          source={bgImage}
          style={styles.bgImage}
          imageStyle={{ resizeMode: 'contain' }}
        >

          {/* Speed Control Button */}
          <TouchableOpacity
            style={styles.speedButton}
            onPress={togglePlaybackSpeed}
          >
            <View style={[
              styles.speedButtonContent,
              { backgroundColor: playbackSpeed === 'slow' ? '#4CAF50' : '#2196F3' }
            ]}>
              <Image
                source={playbackSpeed === 'slow'
                  ? require('@/assets/images/audio.png')  // You'll need to add this icon
                  : require('@/assets/images/audio.png') // You'll need to add this icon
                }
                style={styles.speedIcon}
                resizeMode="contain"
              />
              <Text style={styles.speedText}>
                {playbackSpeed === 'slow' ? 'Lento' : 'Normal'}
              </Text>
            </View>
          </TouchableOpacity>

          {/* Audio boxes overlay on the background */}
          {audioBoxesData.map((box) => (
            <TouchableOpacity
              key={box.id}
              style={box.style}
              onPress={() => playSound(box.audioName)}
            >
              <Image source={require('@/assets/images/audio.png')} style={styles.audioIcon} />
            </TouchableOpacity>
          ))}
        </ImageBackground>

        <View style={styles.buttonsBackContainer}>
          <BackButton navigation={navigation} />
        </View>

        <View style={styles.buttonsNextContainer}>
          <NextButton navigation={navigation} nextName="Level1Listen" />
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
    zIndex: -1,
    position: 'absolute',
    alignSelf: 'center',
    width: wp('100%'),
    height: hp('135%'),
    top: hp('-23%'),
  },
  audioIcon: {
    width: wp('10%'),
    height: hp('6%'),
    resizeMode: 'contain',
  },
  buttonsBackContainer: {
    bottom: hp('53%'),
    right: wp('3%'),
  },
  buttonsNextContainer: {
    top: hp('47.5%'),
    left: wp('1.2%'),
  },
  speedButton: {
    position: 'absolute',
    top: hp('35%'),
    resizeMode: 'contain',
    right: wp('10%'),
    zIndex: 30,
  },
  speedButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('1%'),
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'white',
  },
  speedIcon: {
    width: wp('4%'),
    height: hp('4%'),
    marginRight: wp('1%'),
  },
  speedText: {
    color: 'white',
    fontSize: hp('2%'),
    fontWeight: 'bold',
  },
});

export default GuideListen;