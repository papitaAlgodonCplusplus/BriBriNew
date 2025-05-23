import React, { useState, useEffect } from 'react';
import { ImageBackground, StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackButton from '@/app/misc/BackButton';
import NextButton from '@/app/misc/NextButton';
import { NavigationProp } from '@react-navigation/native';
import { Audio } from 'expo-av';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const Guide6Listen = ({ navigation }: { navigation: NavigationProp<any> }) => {
    const bgImage = require('@/assets/images/guia6.png');

    const [mode, setMode] = useState<'read' | 'listen' | null>(null);

    useEffect(() => {
        const fetchMode = async () => {
            const storedMode = await AsyncStorage.getItem('mode');
            setMode(storedMode === 'read' || storedMode === 'listen' ? storedMode : 'listen');
        };
        fetchMode();
    }, []);

    // Audio elements for the listen mode, based on level_6 visualObjects
    const draggableElements = [
        {
            id: 1,
            name: 'iwo',
            audio: require('@/assets/audios/iwo.wav'),
        },
        {
            id: 2,
            name: 'kapokwa',
            audio: require('@/assets/audios/kapokua.wav'),
        },
        {
            id: 3,
            name: 'ak_wawe',
            audio: require('@/assets/audios/ak_wawe.wav'),
        },
        {
            id: 4,
            name: 'u_shu',
            audio: require('@/assets/audios/ushu.wav'),
        },
        {
            id: 5,
            name: 'ulok',
            audio: require('@/assets/audios/ulok.wav'),
        },
        {
            id: 6,
            name: 'ko',
            audio: require('@/assets/audios/ko.wav'),
        },
        {
            id: 7,
            name: 'u_kko',
            audio: require('@/assets/audios/ukko.wav'),
        },
    ];

    // Audio boxes positioned to match visual objects in level_6.tsx
    const audioBoxesData = [
        { 
            id: 1, 
            name: 'obj_iwo', 
            style: {
                position: 'absolute',
                left: wp('18%'),
                top: hp('71%'), // y + 10
                width: wp('5%'),
                height: hp('6%'),
                borderWidth: 3,
                borderColor: '#e4191c',
                backgroundColor: 'rgba(228, 25, 28, 0.3)',
                justifyContent: 'center',
                alignItems: 'center',
            },
            audioName: 'iwo'
        },
        { 
            id: 2, 
            name: 'obj_kapokwa', 
            style: {
                position: 'absolute',
                left: hp('126.5%'),
                top: hp('40%'), // y + 10
                width: wp('7%'),
                height: hp('6%'),
                borderWidth: 3,
                borderColor: '#ede430',
                backgroundColor: 'rgba(237, 228, 48, 0.3)',
                justifyContent: 'center',
                alignItems: 'center',
            },
            audioName: 'kapokwa'
        },
        { 
            id: 3, 
            name: 'obj_ak_wawe', 
            style: {
                position: 'absolute',
                left: wp('12.3%'),
                top: hp('46%'), // y + 10
                width: wp('8%'),
                height: hp('6%'),
                borderWidth: 3,
                borderColor: '#0046e3',
                backgroundColor: 'rgba(0, 70, 227, 0.3)',
                justifyContent: 'center',
                alignItems: 'center',
            },
            audioName: 'ak_wawe'
        },
        { 
            id: 4, 
            name: 'obj_u_shu', 
            style: {
                position: 'absolute',
                left: wp('33%'),
                top: hp('53%'), // y + 10
                width: wp('6%'),
                height: hp('6%'),
                borderWidth: 3,
                borderColor: '#603f91',
                backgroundColor: 'rgba(96, 63, 145, 0.3)',
                justifyContent: 'center',
                alignItems: 'center',
            },
            audioName: 'u_shu'
        },
        { 
            id: 5, 
            name: 'obj_ulok', 
            style: {
                position: 'absolute',
                left: wp('37%'),
                top: hp('28%'), // y + 10
                width: wp('5%'),
                height: hp('6%'),
                borderWidth: 3,
                borderColor: '#68e033',
                backgroundColor: 'rgba(104, 224, 51, 0.3)',
                justifyContent: 'center',
                alignItems: 'center',
            },
            audioName: 'ulok'
        },
        { 
            id: 6, 
            name: 'obj_ko', 
            style: {
                position: 'absolute',
                left: wp('60%'),
                top: hp('20%'), // y + 10
                width: wp('6%'),
                height: hp('6%'),
                borderWidth: 3,
                borderColor: '#e6175c',
                backgroundColor: 'rgba(230, 23, 92, 0.3)',
                justifyContent: 'center',
                alignItems: 'center',
            },
            audioName: 'ko'
        },
        { 
            id: 7, 
            name: 'obj_u_kko', 
            style: {
                position: 'absolute',
                left: wp('56.5%'),
                top: hp('1%'), // y + 10
                width: wp('6%'),
                height: hp('6%'),
                borderWidth: 3,
                borderColor: '#e94d1f',
                backgroundColor: 'rgba(233, 77, 31, 0.3)',
                justifyContent: 'center',
                alignItems: 'center',
            },
            audioName: 'u_kko'
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
                        <NextButton navigation={navigation} nextName="Level6Listen" />
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
        height: hp('92.5%'),
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

export default Guide6Listen;