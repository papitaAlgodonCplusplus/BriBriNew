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

// Drop zones with same positions and sizes as visualObjects in level_4.tsx
const dropZones = [
    {
        id: 1,
        name: 'obj_kochane',
        position: { 
            x: wp('3%'), // -3% + 10%
            y: hp('60%')
        },
        size: {
            width: wp('6%'),
            height: hp('6%')
        },
        borderColor: '#e4191c',
        backgroundColor: 'rgba(228, 25, 28, 0.3)',
        matchName: 'kochane'
    },
    {
        id: 2,
        name: 'obj_kokata',
        position: { 
            x: wp('55%'), // 52% + 10%
            y: hp('68%')
        },
        size: {
            width: wp('6%'),
            height: hp('6%')
        },
        borderColor: '#68e033',
        backgroundColor: 'rgba(104, 224, 51, 0.3)',
        matchName: 'kokata'
    },
    {
        id: 3,
        name: 'obj_kowolo',
        position: { 
            x: wp('61%'), // 55% + 10%
            y: hp('24%')
        },
        size: {
            width: wp('6%'),
            height: hp('6%')
        },
        borderColor: '#ede430',
        backgroundColor: 'rgba(237, 228, 48, 0.3)',
        matchName: 'kowolo'
    },
    {
        id: 4,
        name: 'obj_klowok',
        position: { 
            x: wp('43.4%'), // 35% + 10%
            y: hp('7%')
        },
        size: {
            width: wp('6%'),
            height: hp('6%')
        },
        borderColor: '#603f91',
        backgroundColor: 'rgba(96, 63, 145, 0.3)',
        matchName: 'klowok'
    }
];

// Draggable elements with audio for the listen mode
const draggableElements = [
    {
        id: 1,
        name: 'kochane',
        audio: require('@/assets/audios/kochane.wav')
    },
    {
        id: 2,
        name: 'kokata',
        audio: require('@/assets/audios/kokata.wav')
    },
    {
        id: 3,
        name: 'kowolo',
        audio: require('@/assets/audios/kowolo.wav')
    },
    {
        id: 4,
        name: 'klowok',
        audio: require('@/assets/audios/klowok.wav')
    }
];

const Level4Listen = ({ navigation }: { navigation: NavigationProp<any> }) => {
    const [selectedAudio, setSelectedAudio] = useState<any>(null);
    const [selectedZone, setSelectedZone] = useState<string | null>(null);
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
        
        if (selectedZone) {
            const zone = dropZones.find(z => z.name === selectedZone);
            if (zone && zone.matchName === item.name) {
                // Correct match
                setMatches(prev => ({ ...prev, [selectedZone]: true }));
                stopPulseAnimation(selectedZone);
                setSelectedZone(null);
                setSelectedAudio(null);
            }
        }
    };

    // When a drop zone is pressed
    const handleZonePress = (zone: any) => {
        if (matches[zone.name]) return;
        
        if (selectedZone === zone.name) {
            // Deselect if already selected
            setSelectedZone(null);
            stopPulseAnimation(zone.name);
            return;
        }
        
        if (selectedZone) {
            stopPulseAnimation(selectedZone);
        }
        
        setSelectedZone(zone.name);
        startPulseAnimation(zone.name);
        
        if (selectedAudio && selectedAudio.name === zone.matchName) {
            // If audio is already selected and matches this zone
            setMatches(prev => ({ ...prev, [zone.name]: true }));
            stopPulseAnimation(zone.name);
            setSelectedZone(null);
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
                    source={require('../../../assets/images/guia4juego.png')}
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
        zIndex: 1,
    },
    buttonsNextContainer: {
        position: 'absolute',
        bottom: hp('-0%'),
        right: wp('-6%'),
        zIndex: 1,
    },
    buttonsContainer: {
        position: 'absolute',
        bottom: hp('10%'),
        left: wp('7%'),
        width: wp('30%'),
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

export default Level4Listen;