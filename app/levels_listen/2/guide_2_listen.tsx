import React, { useState, useEffect } from 'react';
import { ImageBackground, StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackButton from '@/app/misc/BackButton';
import NextButton from '@/app/misc/NextButton';
import { NavigationProp } from '@react-navigation/native';
import { Audio } from 'expo-av';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const GuideListen = ({ navigation }: { navigation: NavigationProp<any> }) => {
    const bgImage = require('@/assets/images/guia2.png');

    const [mode, setMode] = useState<'read' | 'listen' | null>(null);

    useEffect(() => {
        const fetchMode = async () => {
            const storedMode = await AsyncStorage.getItem('mode');
            setMode(storedMode === 'read' || storedMode === 'listen' ? storedMode : 'listen');
        };
        fetchMode();
    }, []);

    // Draggable elements now hold only audio information.
    const draggableElements = [
        { id: 1, name: 'tso_klowok', audio: require('@/assets/audios/tsoklowok.wav') },
        { id: 2, name: 'shkeki', audio: require('@/assets/audios/cahmulikata.wav') },
        { id: 3, name: 'tso', audio: require('@/assets/audios/tso.wav') },
        { id: 4, name: 'kule', audio: require('@/assets/audios/ikule.wav') },
        { id: 5, name: 'nak_kata', audio: require('@/assets/audios/nakkata.wav') },
        { id: 6, name: 'se', audio: require('@/assets/audios/se.wav') },
        { id: 7, name: 'seukuo', audio: require('@/assets/audios/cahmulikata.wav') },
        { id: 8, name: 'i_kule', audio: require('@/assets/audios/ikule.wav') },
        { id: 9, name: 'chamulikata', audio: require('@/assets/audios/cahmulikata.wav') },
    ];

    // Audio boxes positioned to match visual objects in level_2.tsx
    const audioBoxesData = [
        { 
            id: 1, 
            name: 'obj_tso_klowok', 
            style: {
                position: 'absolute',
                left: wp('4%'),
                top: hp('50%'),
                width: wp('5%'),
                height: hp('6%'),
                borderWidth: 3,
                borderColor: '#e4191c',
                backgroundColor: 'rgba(228, 25, 28, 0.3)',
                justifyContent: 'center',
                alignItems: 'center',
            },
            audioName: 'tso_klowok'
        },
        { 
            id: 2, 
            name: 'obj_shkeki', 
            style: {
                position: 'absolute',
                left: wp('11.5%'),
                top: hp('9.5%'),
                width: wp('11.67%'),
                height: hp('6.33%'),
                borderWidth: 3,
                borderColor: '#e94d1f',
                backgroundColor: 'rgba(233, 77, 31, 0.3)',
                justifyContent: 'center',
                alignItems: 'center',
            },
            audioName: 'shkeki'
        },
        { 
            id: 3, 
            name: 'obj_tso', 
            style: {
                position: 'absolute',
                left: wp('67.5%'),
                top: hp('24%'),
                width: wp('5%'),
                height: hp('5%'),
                borderWidth: 3,
                borderColor: '#48ac8f',
                backgroundColor: 'rgba(72, 172, 143, 0.3)',
                justifyContent: 'center',
                alignItems: 'center',
            },
            audioName: 'tso'
        },
        { 
            id: 4, 
            name: 'obj_kule', 
            style: {
                position: 'absolute',
                left: wp('39%'),
                top: hp('83.5%'),
                width: wp('5%'),
                height: hp('6%'),
                borderWidth: 3,
                borderColor: '#d92a73',
                backgroundColor: 'rgba(217, 42, 115, 0.3)',
                justifyContent: 'center',
                alignItems: 'center',
            },
            audioName: 'kule'
        },
        { 
            id: 5, 
            name: 'obj_nak_kata', 
            style: {
                position: 'absolute',
                left: wp('55.5%'),
                top: hp('69%'),
                width: wp('5%'),
                height: hp('6%'),
                borderWidth: 3,
                borderColor: '#68e033',
                backgroundColor: 'rgba(104, 224, 51, 0.3)',
                justifyContent: 'center',
                alignItems: 'center',
            },
            audioName: 'nak_kata'
        },
        { 
            id: 6, 
            name: 'obj_se', 
            style: {
                position: 'absolute',
                left: wp('11.5%'),
                top: hp('59%'),
                width: wp('8%'),
                height: hp('5.33%'),
                borderWidth: 3,
                borderColor: '#99307a',
                backgroundColor: 'rgba(153, 48, 122, 0.3)',
                justifyContent: 'center',
                alignItems: 'center',
            },
            audioName: 'se'
        },
        { 
            id: 7, 
            name: 'obj_seukuo', 
            style: {
                position: 'absolute',
                left: wp('31.5%'),
                top: hp('83.2%'),
                width: wp('6.67%'),
                height: hp('4.67%'),
                borderWidth: 3,
                borderColor: '#e6175c',
                backgroundColor: 'rgba(230, 23, 92, 0.3)',
                justifyContent: 'center',
                alignItems: 'center',
            },
            audioName: 'seukuo'
        },
        { 
            id: 8, 
            name: 'obj_i_kule', 
            style: {
                position: 'absolute',
                left: wp('5%'),
                top: hp('28%'),
                width: wp('8%'),
                height: hp('5%'),
                borderWidth: 3,
                borderColor: '#ede430',
                backgroundColor: 'rgba(237, 228, 48, 0.3)',
                justifyContent: 'center',
                alignItems: 'center',
            },
            audioName: 'i_kule'
        },
        { 
            id: 9, 
            name: 'obj_chamulikata', 
            style: {
                position: 'absolute',
                left: wp('18%'),
                top: hp('75%'),
                width: wp('7%'),
                height: hp('5%'),
                borderWidth: 3,
                borderColor: '#0046e3',
                backgroundColor: 'rgba(0, 70, 227, 0.3)',
                justifyContent: 'center',
                alignItems: 'center',
            },
            audioName: 'chamulikata'
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
                        <NextButton navigation={navigation} nextName="Level2Listen" />
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

export default GuideListen;