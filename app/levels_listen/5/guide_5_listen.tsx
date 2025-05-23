import React, { useState, useEffect } from 'react';
import { ImageBackground, StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackButton from '@/app/misc/BackButton';
import NextButton from '@/app/misc/NextButton';
import { NavigationProp } from '@react-navigation/native';
import { Audio } from 'expo-av';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const Guide5Listen = ({ navigation }: { navigation: NavigationProp<any> }) => {
    const bgImage = require('@/assets/images/guia5.png');

    const [mode, setMode] = useState<'read' | 'listen' | null>(null);

    useEffect(() => {
        const fetchMode = async () => {
            const storedMode = await AsyncStorage.getItem('mode');
            setMode(storedMode === 'read' || storedMode === 'listen' ? storedMode : 'listen');
        };
        fetchMode();
    }, []);

    // Audio elements for the listen mode, based on level_5 visualObjects
    const draggableElements = [
        {
            id: 1,
            name: 'chane',
            audio: require('@/assets/audios/chane.wav'),
        },
        {
            id: 2,
            name: 'tiska',
            audio: require('@/assets/audios/tska.wav'),
        },
        {
            id: 3,
            name: 'kowolo',
            audio: require('@/assets/audios/kowolo.wav'),
        },
        {
            id: 4,
            name: 'ko_klowok',
            audio: require('@/assets/audios/ko_klowok.wav'),
        },
    ];

    // Audio boxes positioned to match visual objects in level_5.tsx
    const audioBoxesData = [
        { 
            id: 1, 
            name: 'obj_chane', 
            style: {
                position: 'absolute',
                left: wp('69%'),
                top: hp('19%'),
                width: wp('5%'),
                height: hp('4%'),
                borderWidth: 3,
                borderColor: '#ede430',
                backgroundColor: 'rgba(237, 228, 48, 0.3)',
                justifyContent: 'center',
                alignItems: 'center',
            },
            audioName: 'chane'
        },
        { 
            id: 2, 
            name: 'obj_tiska', 
            style: {
                position: 'absolute',
                left: wp('81.7%'),
                top: hp('56%'),
                width: wp('7%'),
                height: hp('4%'),
                borderWidth: 3,
                borderColor: '#603f91',
                backgroundColor: 'rgba(96, 63, 145, 0.3)',
                justifyContent: 'center',
                alignItems: 'center',
            },
            audioName: 'tiska'
        },
        { 
            id: 3, 
            name: 'obj_kowolo', 
            style: {
                position: 'absolute',
                left: wp('78%'),
                top: hp('43%'),
                width: wp('5%'),
                height: hp('4%'),
                borderWidth: 3,
                borderColor: '#68e033',
                backgroundColor: 'rgba(104, 224, 51, 0.3)',
                justifyContent: 'center',
                alignItems: 'center',
            },
            audioName: 'kowolo'
        },
        { 
            id: 4, 
            name: 'obj_klowok', 
            style: {
                position: 'absolute',
                left: wp('77%'),
                top: hp('30%'),
                width: wp('7%'),
                height: hp('4%'),
                borderWidth: 3,
                borderColor: '#e4191c',
                backgroundColor: 'rgba(228, 25, 28, 0.3)',
                justifyContent: 'center',
                alignItems: 'center',
            },
            audioName: 'ko_klowok'
        }
    ];

    // Function to play audio
    const playSound = async (audioName: string) => {
        const element = draggableElements.find(e => e.name === audioName);
        if (!element) return;
        
        try {
            const { sound } = await Audio.Sound.createAsync(element.audio);
            await sound.playAsync();
        } catch (error) {
            console.error('Error playing sound', error);
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

                    <View style={styles.buttonsBackContainer}>
                        <BackButton navigation={navigation} />
                    </View>
                    
                    <View style={styles.buttonsNextContainer}>
                        <NextButton navigation={navigation} nextName="Level5Listen" />
                    </View>
                </ImageBackground>
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffff',
    },
    bgImage: {
        flex: 1,
        width: wp('100%'),
        height: hp('115%'),
        right: wp('4%'),
    },
    audioIcon: {
        width: wp('8%'),
        height: hp('4%'),
        resizeMode: 'contain',
    },
    buttonsBackContainer: {
        position: 'absolute',
        top: hp('0%'),
        left: wp('0%'),
        resizeMode: 'cover',
    },
    buttonsNextContainer: {
        position: 'absolute',
        bottom: hp('0%'),
        right: wp('0%'),
    }
});

export default Guide5Listen;