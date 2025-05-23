import { LogBox } from 'react-native';
LogBox.ignoreLogs([
  'Draggable: Support for defaultProps will be removed'
]);
import React, { useState, useEffect, useRef } from 'react';
import { View, ImageBackground, StyleSheet, TouchableOpacity, ScrollView, Image, Animated, Easing } from 'react-native';
import { Audio } from 'expo-av';
import { NavigationProp } from '@react-navigation/native';
import BackButton from '../../misc/BackButton';
import NextButton from '../../misc/NextButton';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

// Drop zones with same positions and sizes as visualObjects in level_2.tsx
const dropZones = [
    {
        id: 1,
        name: 'obj_tso_klowok',
        position: { 
            x: wp('10%'),
            y: hp('70%')
        },
        size: {
            width: wp('6%'),
            height: hp('6%')
        },
        borderColor: '#e4191c',
        backgroundColor: 'rgba(228, 25, 28, 0.3)',
        matchName: 'tso_klowok'
    },
    {
        id: 2,
        name: 'obj_shkeki',
        position: { 
            x: wp('33%'),
            y: hp('30%')
        },
        size: {
            width: wp('6%'),
            height: hp('6%')
        },
        borderColor: '#e94d1f',
        backgroundColor: 'rgba(233, 77, 31, 0.3)',
        matchName: 'shkeki'
    },
    {
        id: 3,
        name: 'obj_tso',
        position: { 
            x: wp('73%'),
            y: hp('28%')
        },
        size: {
            width: wp('6%'),
            height: hp('6%')
        },
        borderColor: '#48ac8f',
        backgroundColor: 'rgba(72, 172, 143, 0.3)',
        matchName: 'tso'
    },
    {
        id: 4,
        name: 'obj_kule',
        position: { 
            x: wp('45%'),
            y: hp('30%')
        },
        size: {
            width: wp('6%'),
            height: hp('6%')
        },
        borderColor: '#d92a73',
        backgroundColor: 'rgba(217, 42, 115, 0.3)',
        matchName: 'kule'
    },
    {
        id: 5,
        name: 'obj_nak_kata',
        position: { 
            x: wp('58%'),
            y: hp('80%')
        },
        size: {
            width: wp('6%'),
            height: hp('6%')
        },
        borderColor: '#68e033',
        backgroundColor: 'rgba(104, 224, 51, 0.3)',
        matchName: 'nak_kata'
    },
    {
        id: 6,
        name: 'obj_se',
        position: { 
            x: wp('16%'),
            y: hp('61%')
        },
        size: {
            width: wp('6%'),
            height: hp('6%')
        },
        borderColor: '#99307a',
        backgroundColor: 'rgba(153, 48, 122, 0.3)',
        matchName: 'se'
    },
    {
        id: 7,
        name: 'obj_seukuo',
        position: { 
            x: wp('39%'),
            y: hp('90%')
        },
        size: {
            width: wp('6%'),
            height: hp('6%')
        },
        borderColor: '#e6175c',
        backgroundColor: 'rgba(230, 23, 92, 0.3)',
        matchName: 'seukuo'
    },
    {
        id: 8,
        name: 'obj_i_kule',
        position: { 
            x: wp('14%'),
            y: hp('29%')
        },
        size: {
            width: wp('6%'),
            height: hp('6%')
        },
        borderColor: '#ede430',
        backgroundColor: 'rgba(237, 228, 48, 0.3)',
        matchName: 'i_kule'
    },
    {
        id: 9,
        name: 'obj_chamulikata',
        position: { 
            x: wp('14%'),
            y: hp('86%')
        },
        size: {
            width: wp('6%'),
            height: hp('6%')
        },
        borderColor: '#0046e3',
        backgroundColor: 'rgba(0, 70, 227, 0.3)',
        matchName: 'chamulikata'
    }
];

// Draggable elements with audio for the listen mode
const draggableElements = [
    {
        id: 1,
        name: 'tso_klowok',
        audio: require('@/assets/audios/tsoklowok.wav')
    },
    {
        id: 2,
        name: 'shkeki',
        audio: require('@/assets/audios/cahmulikata.wav')
    },
    {
        id: 3,
        name: 'tso',
        audio: require('@/assets/audios/tso.wav')
    },
    {
        id: 4,
        name: 'kule',
        audio: require('@/assets/audios/ikule.wav')
    },
    {
        id: 5,
        name: 'nak_kata',
        audio: require('@/assets/audios/nakkata.wav')
    },
    {
        id: 6,
        name: 'se',
        audio: require('@/assets/audios/se.wav')
    },
    {
        id: 7,
        name: 'seukuo',
        audio: require('@/assets/audios/cahmulikata.wav')
    },
    {
        id: 8,
        name: 'i_kule',
        audio: require('@/assets/audios/ikule.wav')
    },
    {
        id: 9,
        name: 'chamulikata',
        audio: require('@/assets/audios/cahmulikata.wav')
    }
];

const Level2Listen = ({ navigation }: { navigation: NavigationProp<any> }) => {
    const [selectedAudio, setSelectedAudio] = useState<any>(null);
    const [matches, setMatches] = useState<Record<string, boolean>>({});
    const [canContinue, setCanContinue] = useState(false);
    
    const animatedValues = useRef(
        dropZones.reduce((acc, zone) => {
            acc[zone.name] = new Animated.Value(1);
            return acc;
        }, {} as Record<string, Animated.Value>)
    ).current;

    const playSound = async (audio: any) => {
        try {
            const { sound } = await Audio.Sound.createAsync(audio);
            await sound.playAsync();
        } catch (error) {
            console.error('Error playing sound', error);
        }
    };

    const startPulseAnimation = (zoneName: string) => {
        animatedValues[zoneName].setValue(1);
        
        Animated.loop(
            Animated.sequence([
                Animated.timing(animatedValues[zoneName], {
                    toValue: 1.1,
                    duration: 800,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true
                }),
                Animated.timing(animatedValues[zoneName], {
                    toValue: 1,
                    duration: 800,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true
                })
            ])
        ).start();
    };

    const stopPulseAnimation = (zoneName: string) => {
        animatedValues[zoneName].stopAnimation();
        animatedValues[zoneName].setValue(1);
    };

    // When audio button is pressed
    const handleAudioPress = (item: any) => {
        const isMatched = Object.entries(matches).some(([key, value]) => {
            const zone = dropZones.find(z => z.name === key);
            return value && zone && zone.matchName === item.name;
        });
        
        if (isMatched) return;
        
        setSelectedAudio(item);
        playSound(item.audio);
    };

    // When a drop zone is pressed
    const handleZonePress = (zone: any) => {
        if (matches[zone.name]) return;
        
        if (!selectedAudio) {
            // If no audio is selected, highlight this zone
            startPulseAnimation(zone.name);
            setTimeout(() => {
                stopPulseAnimation(zone.name);
            }, 2000);
            return;
        }
        
        if (selectedAudio.name === zone.matchName) {
            // Correct match
            setMatches(prev => ({ ...prev, [zone.name]: true }));
            stopPulseAnimation(zone.name);
            setSelectedAudio(null);
        } else {
            // Incorrect match
            setSelectedAudio(null);
        }
    };

    // Enable Continue button when all matches are made
    useEffect(() => {
        if (Object.keys(matches).length === dropZones.length) {
            setCanContinue(true);
        }
    }, [matches]);

    // Clean up animations
    useEffect(() => {
        return () => {
            Object.keys(animatedValues).forEach(key => {
                animatedValues[key].stopAnimation();
            });
        };
    }, []);

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <ImageBackground
                    source={require('../../../assets/images/guia2juego.png')}
                    style={styles.backgroundImage}
                    resizeMode="contain"
                >
                    {/* Back Button */}
                    <View style={styles.buttonsBackContainer}>
                        <BackButton navigation={navigation} />
                    </View>

                    {/* Next Button */}
                    {canContinue && (
                        <View style={styles.buttonsNextContainer}>
                            <NextButton navigation={navigation} nextName="LevelMapping" />
                        </View>
                    )}

                    {/* Colored zones */}
                    {dropZones.map((zone) => (
                        <TouchableOpacity
                            key={zone.id}
                            style={{
                                position: 'absolute',
                                left: zone.position.x,
                                top: zone.position.y,
                                zIndex: 5,
                            }}
                            onPress={() => handleZonePress(zone)}
                            disabled={!!matches[zone.name]}
                        >
                            <Animated.View
                                style={{
                                    transform: [
                                        { scale: animatedValues[zone.name] }
                                    ],
                                    width: zone.size.width,
                                    height: zone.size.height,
                                    borderWidth: 3,
                                    borderColor: zone.borderColor,
                                    backgroundColor: matches[zone.name] ? zone.backgroundColor : 'transparent',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                {matches[zone.name] && (
                                    <Image source={require('@/assets/images/audio.png')} style={styles.audioIcon} />
                                )}
                            </Animated.View>
                        </TouchableOpacity>
                    ))}

                    {/* Audio Buttons */}
                    <View style={styles.buttonsContainer}>
                        {draggableElements.map((item) => {
                            const isMatched = Object.entries(matches).some(([key, value]) => {
                                const zone = dropZones.find(z => z.name === key);
                                return value && zone && zone.matchName === item.name;
                            });
                            
                            return (
                                <View key={item.id} style={styles.buttonWrapper}>
                                    <TouchableOpacity
                                        style={[
                                            styles.button,
                                            selectedAudio && selectedAudio.name === item.name && styles.selectedAudio,
                                            isMatched && {
                                                opacity: 0.5,
                                            }
                                        ]}
                                        onPress={() => handleAudioPress(item)}
                                        disabled={isMatched}
                                        activeOpacity={0.7}
                                    >
                                        <Image 
                                            source={require('@/assets/images/audio.png')} 
                                            style={styles.audioIcon}
                                        />
                                    </TouchableOpacity>
                                </View>
                            );
                        })}
                    </View>
                </ImageBackground>
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
    },
    backgroundImage: {
        alignSelf: 'center',
        width: wp('80%'),
        height: hp('100%'),
    },
    buttonsBackContainer: {
        position: 'absolute',
        top: hp('-2%'),
        left: wp('-8%'),
        zIndex: 10,
    },
    buttonsNextContainer: {
        position: 'absolute',
        bottom: hp('-0%'),
        right: wp('-6%'),
        zIndex: 10,
    },
    buttonsContainer: {
        position: 'absolute',
        bottom: hp('78%'),
        left: wp('7%'),
        width: wp('60%'),
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        gap: wp('1%'),
    },
    buttonWrapper: {
        width: wp('11%'),
        height: hp('5%'),
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 5,
        padding: hp('0.5%'),
        width: wp('11%'),
        height: hp('5%'),
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectedAudio: {
        backgroundColor: '#f0f0f0',
        borderColor: '#677',
        borderWidth: 1.5,
    },
    audioIcon: {
        width: wp('6%'),
        height: hp('3%'),
        resizeMode: 'contain',
    },
});

export default Level2Listen;