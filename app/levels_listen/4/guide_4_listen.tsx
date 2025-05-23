import React, { useState, useEffect } from 'react';
import { ImageBackground, StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackButton from '@/app/misc/BackButton';
import NextButton from '@/app/misc/NextButton';
import { NavigationProp } from '@react-navigation/native';
import { Audio } from 'expo-av';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const Guide4Listen = ({ navigation }: { navigation: NavigationProp<any> }) => {
    const bgImage = require('@/assets/images/guia4.png');

    const [mode, setMode] = useState<'read' | 'listen' | null>(null);

    useEffect(() => {
        const fetchMode = async () => {
            const storedMode = await AsyncStorage.getItem('mode');
            setMode(storedMode === 'read' || storedMode === 'listen' ? storedMode : 'listen');
        };
        fetchMode();
    }, []);

    // Audio elements for the listen mode, based on level_4 visualObjects
    const draggableElements = [
        {
            id: 1,
            name: 'kochane',
            audio: require('@/assets/audios/kochane.wav'),
        },
        {
            id: 2,
            name: 'kokata',
            audio: require('@/assets/audios/kokata.wav'),
        },
        {
            id: 3,
            name: 'kowolo',
            audio: require('@/assets/audios/kowolo.wav'),
        },
        {
            id: 4,
            name: 'klowok',
            audio: require('@/assets/audios/klowok.wav'),
        },
    ];

    // Audio boxes positioned to match visual objects in level_4.tsx
    const audioBoxesData = [
        { 
            id: 1, 
            name: 'obj_kochane', 
            style: {
                position: 'absolute',
                left: wp('10%'),
                top: hp('62%'),
                width: wp('7%'),
                height: hp('5%'),
                borderWidth: 3,
                borderColor: '#e4191c',
                backgroundColor: 'rgba(228, 25, 28, 0.3)',
                justifyContent: 'center',
                alignItems: 'center',
            },
            audioName: 'kochane'
        },
        { 
            id: 2, 
            name: 'obj_kokata', 
            style: {
                position: 'absolute',
                left: wp('46%'),
                top: hp('51%'),
                width: wp('5%'),
                height: hp('5%'),
                borderWidth: 3,
                borderColor: '#68e033',
                backgroundColor: 'rgba(104, 224, 51, 0.3)',
                justifyContent: 'center',
                alignItems: 'center',
            },
            audioName: 'kokata'
        },
        { 
            id: 3, 
            name: 'obj_kowolo', 
            style: {
                position: 'absolute',
                left: wp('46%'),
                top: hp('38%'),
                width: wp('5%'),
                height: hp('5%'),
                borderWidth: 3,
                borderColor: '#ede430',
                backgroundColor: 'rgba(237, 228, 48, 0.3)',
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
                left: wp('43%'),
                top: hp('14%'),
                width: wp('5%'),
                height: hp('5%'),
                borderWidth: 3,
                borderColor: '#603f91',
                backgroundColor: 'rgba(96, 63, 145, 0.3)',
                justifyContent: 'center',
                alignItems: 'center',
            },
            audioName: 'klowok'
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
                        <NextButton navigation={navigation} nextName="Level4Listen" />
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
        width: wp('80%'),
        height: hp('85%'),
    },
    audioIcon: {
        width: wp('8%'),
        height: hp('4%'),
        resizeMode: 'contain',
    },
    buttonsBackContainer: {
        position: 'absolute',
        top: hp('-4%'),
        left: wp('-7%'),
        resizeMode: 'cover',
    },
    buttonsNextContainer: {
        position: 'absolute',
        bottom: hp('-1%'),
        right: wp('-5%'),
    }
});

export default Guide4Listen;