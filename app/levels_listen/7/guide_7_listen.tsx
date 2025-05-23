import React, { useState, useEffect } from 'react';
import { ImageBackground, StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackButton from '@/app/misc/BackButton';
import NextButton from '@/app/misc/NextButton';
import { NavigationProp } from '@react-navigation/native';
import { Audio } from 'expo-av';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const Guide7Listen = ({ navigation }: { navigation: NavigationProp<any> }) => {
    const bgImage = require('@/assets/images/guia7.png');

    const [mode, setMode] = useState<'read' | 'listen' | null>(null);

    useEffect(() => {
        const fetchMode = async () => {
            const storedMode = await AsyncStorage.getItem('mode');
            setMode(storedMode === 'read' || storedMode === 'listen' ? storedMode : 'listen');
        };
        fetchMode();
    }, []);

    // Audio elements for the listen mode, based on level_7 visualObjects
    const draggableElements = [
        {
            id: 1,
            name: 'ajko_ko',
            audio: require('@/assets/audios/ko.wav'),
        },
        {
            id: 2,
            name: 'sabak_dule',
            audio: require('@/assets/audios/sabak_dule.wav'),
        },
        {
            id: 3,
            name: 'kula',
            audio: require('@/assets/audios/kula.wav'),
        },
        {
            id: 4,
            name: 'to_ta',
            audio: require('@/assets/audios/to.wav'),
        },
        {
            id: 5,
            name: 'sku',
            audio: require('@/assets/audios/sku.wav'),
        },
        {
            id: 6,
            name: 'tska_tka',
            audio: require('@/assets/audios/tska.wav'),
        },
        {
            id: 7,
            name: 'kule',
            audio: require('@/assets/audios/kule.wav'),
        },
        {
            id: 8,
            name: 'skou',
            audio: require('@/assets/audios/sku.wav'),
        },
        {
            id: 9,
            name: 'tcho_tka',
            audio: require('@/assets/audios/tska.wav'),
        },
        {
            id: 10,
            name: 'u',
            audio: require('@/assets/audios/u.wav'),
        },
    ];

    // Audio boxes positioned to match visual objects in level_7.tsx
    const audioBoxesData = [
        { 
            id: 1, 
            name: 'obj_ajko_ko', 
            style: {
                position: 'absolute',
                left: wp('10%'),
                top: hp('90%'),
                width: wp('7%'),
                height: hp('5%'),
                borderWidth: 3,
                borderColor: '#0046e3',
                backgroundColor: 'rgba(0, 70, 227, 0.3)',
                justifyContent: 'center',
                alignItems: 'center',
            },
            audioName: 'ajko_ko'
        },
        { 
            id: 2, 
            name: 'obj_sabak_dule', 
            style: {
                position: 'absolute',
                left: wp('32%'),
                top: hp('90%'),
                width: wp('10%'),
                height: hp('5%'),
                borderWidth: 3,
                borderColor: '#603f91',
                backgroundColor: 'rgba(96, 63, 145, 0.3)',
                justifyContent: 'center',
                alignItems: 'center',
            },
            audioName: 'sabak_dule'
        },
        { 
            id: 3, 
            name: 'obj_kula', 
            style: {
                position: 'absolute',
                left: wp('62%'),
                top: hp('90%'),
                width: wp('7%'),
                height: hp('5%'),
                borderWidth: 3,
                borderColor: '#e6175c',
                backgroundColor: 'rgba(230, 23, 92, 0.3)',
                justifyContent: 'center',
                alignItems: 'center',
            },
            audioName: 'kula'
        },
        { 
            id: 4, 
            name: 'obj_to_ta', 
            style: {
                position: 'absolute',
                left: wp('67%'),
                top: hp('48%'),
                width: wp('7%'),
                height: hp('5%'),
                borderWidth: 3,
                borderColor: '#d92a73',
                backgroundColor: 'rgba(217, 42, 115, 0.3)',
                justifyContent: 'center',
                alignItems: 'center',
            },
            audioName: 'to_ta'
        },
        { 
            id: 5, 
            name: 'obj_sku', 
            style: {
                position: 'absolute',
                left: wp('52%'),
                top: hp('32%'),
                width: wp('5%'),
                height: hp('5%'),
                borderWidth: 3,
                borderColor: '#48ac8f',
                backgroundColor: 'rgba(72, 172, 143, 0.3)',
                justifyContent: 'center',
                alignItems: 'center',
            },
            audioName: 'sku'
        },
        { 
            id: 6, 
            name: 'obj_tska_tka', 
            style: {
                position: 'absolute',
                left: wp('21%'),
                top: hp('90%'),
                width: wp('7%'),
                height: hp('5%'),
                borderWidth: 3,
                borderColor: '#e4191c',
                backgroundColor: 'rgba(228, 25, 28, 0.3)',
                justifyContent: 'center',
                alignItems: 'center',
            },
            audioName: 'tska_tka'
        },
        { 
            id: 7, 
            name: 'obj_kule', 
            style: {
                position: 'absolute',
                left: wp('45%'),
                top: hp('90%'),
                width: wp('7%'),
                height: hp('5%'),
                borderWidth: 3,
                borderColor: '#ede430',
                backgroundColor: 'rgba(237, 228, 48, 0.3)',
                justifyContent: 'center',
                alignItems: 'center',
            },
            audioName: 'kule'
        },
        { 
            id: 8, 
            name: 'obj_skou', 
            style: {
                position: 'absolute',
                left: wp('67%'),
                top: hp('72%'),
                width: wp('5%'),
                height: hp('5%'),
                borderWidth: 3,
                borderColor: '#e94d1f',
                backgroundColor: 'rgba(233, 77, 31, 0.3)',
                justifyContent: 'center',
                alignItems: 'center',
            },
            audioName: 'skou'
        },
        { 
            id: 9, 
            name: 'obj_tcho_tka', 
            style: {
                position: 'absolute',
                left: wp('60%'),
                top: hp('32%'),
                width: wp('9%'),
                height: hp('5%'),
                borderWidth: 3,
                borderColor: '#68e033',
                backgroundColor: 'rgba(104, 224, 51, 0.3)',
                justifyContent: 'center',
                alignItems: 'center',
            },
            audioName: 'tcho_tka'
        },
        { 
            id: 10, 
            name: 'obj_u', 
            style: {
                position: 'absolute',
                left: wp('27%'),
                top: hp('-5%'),
                width: wp('5%'),
                height: hp('5%'),
                borderWidth: 3,
                borderColor: '#99307a',
                backgroundColor: 'rgba(153, 48, 122, 0.3)',
                justifyContent: 'center',
                alignItems: 'center',
            },
            audioName: 'u'
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
                        <NextButton navigation={navigation} nextName="Level7Listen" />
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

export default Guide7Listen;