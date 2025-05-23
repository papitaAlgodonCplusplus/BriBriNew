import React, { useState, useEffect } from 'react';
import { ImageBackground, StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackButton from '@/app/misc/BackButton';
import NextButton from '@/app/misc/NextButton';
import { NavigationProp } from '@react-navigation/native';
import { Audio } from 'expo-av';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const Guide3Listen = ({ navigation }: { navigation: NavigationProp<any> }) => {
    const bgImage = require('@/assets/images/guia3.png');

    const [mode, setMode] = useState<'read' | 'listen' | null>(null);

    useEffect(() => {
        const fetchMode = async () => {
            const storedMode = await AsyncStorage.getItem('mode');
            setMode(storedMode === 'read' || storedMode === 'listen' ? storedMode : 'listen');
        };
        fetchMode();
    }, []);

    // Audio elements for the listen mode
    const draggableElements = [
        {
            id: 1,
            name: 'u_tto',
            audio: require('@/assets/audios/utto.wav'),
        },
        {
            id: 2,
            name: 'uko',
            audio: require('@/assets/audios/uko.wav'),
        },
        {
            id: 3,
            name: 'u_tso_pabakok',
            audio: require('@/assets/audios/utsi.wav'),
        },
        {
            id: 4,
            name: 'u_tsi',
            audio: require('@/assets/audios/utsi.wav'),
        },
        {
            id: 5,
            name: 'pabakok',
            audio: require('@/assets/audios/utsi.wav'),
        },
        {
            id: 6,
            name: 'etsok',
            audio: require('@/assets/audios/etsok.wav'),
        },
    ];

    const audioBoxesData = [
        { 
            id: 1, 
            name: 'obj_u_tto', 
            style: {
                position: 'absolute',
                left: wp('6.5%'),
                top: hp('71%'),
                width: wp('5%'),
                height: hp('5%'),
                borderWidth: 3,
                borderColor: '#e4191c',
                backgroundColor: 'rgba(228, 25, 28, 0.3)',
                justifyContent: 'center',
                alignItems: 'center',
            },
            audioName: 'u_tto'
        },
        { 
            id: 2, 
            name: 'obj_uko', 
            style: {
                position: 'absolute',
                left: wp('65%'),
                top: hp('50.5%'),
                width: wp('5%'),
                height: hp('5%'),
                borderWidth: 3,
                borderColor: '#e94d1f',
                backgroundColor: 'rgba(233, 77, 31, 0.3)',
                justifyContent: 'center',
                alignItems: 'center',
            },
            audioName: 'uko'
        },
        { 
            id: 3, 
            name: 'obj_u_tso_pabakok', 
            style: {
                position: 'absolute',
                left: wp('56%'),
                top: hp('14%'),
                width: wp('15%'),
                height: hp('5%'),
                borderWidth: 3,
                borderColor: '#0046e3',
                backgroundColor: 'rgba(0, 70, 227, 0.3)',
                justifyContent: 'center',
                alignItems: 'center',
            },
            audioName: 'u_tso_pabakok'
        },
        { 
            id: 4, 
            name: 'obj_u_tsi', 
            style: {
                position: 'absolute',
                left: wp('48.5%'),
                top: hp('78%'),
                width: wp('5%'),
                height: hp('5%'),
                borderWidth: 3,
                borderColor: '#e6175c',
                backgroundColor: 'rgba(230, 23, 92, 0.3)',
                justifyContent: 'center',
                alignItems: 'center',
            },
            audioName: 'u_tsi'
        },
        { 
            id: 5, 
            name: 'obj_pabakok', 
            style: {
                position: 'absolute',
                left: wp('29%'),
                top: hp('29%'),
                width: wp('15%'),
                height: hp('5%'),
                borderWidth: 3,
                borderColor: '#ede430',
                backgroundColor: 'rgba(237, 228, 48, 0.3)',
                justifyContent: 'center',
                alignItems: 'center',
            },
            audioName: 'pabakok'
        },
        { 
            id: 6, 
            name: 'obj_etsok', 
            style: {
                position: 'absolute',
                left: wp('65%'),
                top: hp('40%'),
                width: wp('8%'),
                height: hp('5%'),
                borderWidth: 3,
                borderColor: '#68e033',
                backgroundColor: 'rgba(104, 224, 51, 0.3)',
                justifyContent: 'center',
                alignItems: 'center',
            },
            audioName: 'etsok'
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
                        <NextButton navigation={navigation} nextName="Level3Listen" />
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
        height: hp('90%'),
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

export default Guide3Listen;