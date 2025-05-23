import { LogBox } from 'react-native';
LogBox.ignoreLogs([
    'Draggable: Support for defaultProps will be removed'
]);

import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    ImageBackground,
    Image,
    StyleSheet,
    TouchableOpacity,
    Text,
    Animated,
    Easing,
} from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import BackButton from '../../misc/BackButton';
import NextButton from '../../misc/NextButton';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const bgImage = require('@/assets/images/guia6juego.png');

const visualObjects = [
    {
        id: 1,
        name: 'obj_iwo',
        imageNormal: require('@/assets/images/iwo_normal.png'),
        imageSelected: require('@/assets/images/iwo_sombra.png'),
        position: { 
            x: wp('10%'),
            y: hp('1%')
        },
        size: {
            normal: { width: wp('25%'), height: hp('30%') },
            selected: { width: wp('25%'), height: hp('32%') }
        },
        correctWord: 'iwo'
    },
    {
        id: 2,
        name: 'obj_kapokwa',
        imageNormal: require('@/assets/images/kapokwa_normal.png'),
        imageSelected: require('@/assets/images/kapokwa_sombra.png'),
        position: { 
            x: hp('90%'),
            y: hp('28%')
        },
        size: {
            normal: { width: wp('24%'), height: hp('42%') },
            selected: { width: wp('24%'), height: hp('44%') }
        },
        correctWord: 'kapokwa'
    },
    {
        id: 3,
        name: 'obj_ak_wawe',
        imageNormal: require('@/assets/images/ak_wawe_normal.png'),
        imageSelected: require('@/assets/images/ak_wawe_sombra.png'),
        position: { 
            x: wp('5%'),
            y: hp('7%')
        },
        size: {
            normal: { width: wp('18%'), height: hp('21%') },
            selected: { width: wp('18%'), height: hp('23%') }
        },
        correctWord: 'ak_wawe'
    },
    {
        id: 4,
        name: 'obj_u_shu',
        imageNormal: require('@/assets/images/u_shu_normal.png'),
        imageSelected: require('@/assets/images/u_shu_sombra.png'),
        position: { 
            x: wp('34%'),
            y: hp('52%')
        },
        size: {
            normal: { width: wp('20%'), height: hp('26%') },
            selected: { width: wp('21%'), height: hp('28%') }
        },
        correctWord: 'u_shu'
    },
    {
        id: 5,
        name: 'obj_ulok',
        imageNormal: require('@/assets/images/ulok_normal.png'),
        imageSelected: require('@/assets/images/ulok_sombra.png'),
        position: { 
            x: wp('27%'),
            y: hp('1%')
        },
        size: {
            normal: { width: wp('21%'), height: hp('28%') },
            selected: { width: wp('21%'), height: hp('28%') }
        },
        correctWord: 'ulok'
    },
    {
        id: 6,
        name: 'obj_ko',
        imageNormal: require('@/assets/images/ko_normal.png'),
        imageSelected: require('@/assets/images/ko_sombra.png'),
        position: { 
            x: wp('54%'),
            y: hp('1%')
        },
        size: {
            normal: { width: wp('21%'), height: hp('28%') },
            selected: { width: wp('21%'), height: hp('28%') }
        },
        correctWord: 'ko'
    },
    {
        id: 7,
        name: 'obj_u_kko',
        imageNormal: require('@/assets/images/u_kko_normal.png'),
        imageSelected: require('@/assets/images/u_kko_sombra.png'),
        position: { 
            x: wp('36.5%'),
            y: hp('-3%')
        },
        size: {
            normal: { width: wp('20%'), height: hp('26%') },
            selected: { width: wp('21%'), height: hp('28%') }
        },
        correctWord: 'u_kko'
    }

];


const draggableElements = [
    {
        id: 1,
        name: 'iwo',
        image: require('@/assets/images/iwo2.png'),
    },
    {
        id: 2,
        name: 'kapokwa',
        image: require('@/assets/images/kapokwa2.png'),
    },
    {
        id: 3,
        name: 'ak_wawe',
        image: require('@/assets/images/ak_wawe2.png'),
    },
    {
        id: 4,
        name: 'u_shu',
        image: require('@/assets/images/u_shu2.png'),
    },
    {
        id: 5,
        name: 'ulok',
        image: require('@/assets/images/ulok2.png'),
    },
    {
        id: 6,
        name: 'ko',
        image: require('@/assets/images/ko2.png'),
    },
    {
        id: 7,
        name: 'u_kko',
        image: require('@/assets/images/u_kko2.png'),
    },
];

const wordColors = [
    {
        name: 'iwo',
        color: '#e4191c',
    },
    {
        name: 'kapokwa',
        color: '#ede430',
    },
    {
        name: 'ak_wawe',
        color: '#0046e3',
    },
    {
        name: 'u_shu',
        color: '#603f91',
    },
    {
        name: 'ulok',
        color: '#68e033',
    },
    {
        name: 'ko',
        color: '#e6175c',
    },
    {
        name: 'u_kko',
        color: '#e94d1f',
    },
];

const Level6 = ({ navigation }: { navigation: NavigationProp<any> }) => {
    // Use a state copy for words that haven't been matched yet.
    const [words, setWords] = useState([...draggableElements]);
    const [selectedWord, setSelectedWord] = useState<string | null>(null);
    const [selectedObject, setSelectedObject] = useState<string | null>(null);
    const [matches, setMatches] = useState<Record<string, string>>({});
    const [canContinue, setCanContinue] = useState(false);

    const animatedValues = useRef(
        visualObjects.reduce((acc, obj) => {
            acc[obj.name] = new Animated.Value(1);
            return acc;
        }, {} as Record<string, Animated.Value>)
    ).current;

    const startPulseAnimation = (objectName: string) => {
        animatedValues[objectName].setValue(1);
        
        Animated.loop(
            Animated.sequence([
                Animated.timing(animatedValues[objectName], {
                    toValue: 1.1,
                    duration: 800,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true
                }),
                Animated.timing(animatedValues[objectName], {
                    toValue: 1,
                    duration: 800,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true
                })
            ])
        ).start();
    };

    const stopPulseAnimation = (objectName: string) => {
        animatedValues[objectName].stopAnimation();
        animatedValues[objectName].setValue(1);
    };

    // When a word is tapped, toggle its selection
    const handleWordPress = (item: { name: string }) => {
        if (Object.values(matches).includes(item.name)) return;
        
        if (selectedObject) {
            const objectInfo = visualObjects.find(obj => obj.name === selectedObject);
            if (objectInfo && objectInfo.correctWord === item.name) {
                setMatches(prev => ({
                    ...prev,
                    [selectedObject]: item.name
                }));
                stopPulseAnimation(selectedObject);
                setSelectedObject(null);
                setSelectedWord(null);
            } else {
                setSelectedWord(selectedWord === item.name ? null : item.name);
            }
        } else {
            setSelectedWord(selectedWord === item.name ? null : item.name);
        }
    };

    const handleObjectPress = (objectName: string) => {
        if (matches[objectName]) return;
        if (selectedObject === objectName) {
            setSelectedObject(null);
            stopPulseAnimation(objectName);
            return;
        }
        if (selectedObject) {
            stopPulseAnimation(selectedObject);
        }
        setSelectedObject(objectName);
        startPulseAnimation(objectName);
        if (selectedWord) {
            const objectInfo = visualObjects.find(obj => obj.name === objectName);
            if (objectInfo && objectInfo.correctWord === selectedWord) {
                setMatches(prev => ({
                    ...prev,
                    [objectName]: selectedWord
                }));
                stopPulseAnimation(objectName);
                setSelectedObject(null);
                setSelectedWord(null);
            }
        }
    };

    useEffect(() => {
        return () => {
            Object.keys(animatedValues).forEach(key => {
                animatedValues[key].stopAnimation();
            });
        };
    }, []);

    useEffect(() => {
        if (Object.keys(matches).length === visualObjects.length) {
            setCanContinue(true);
        }
    }, [matches]);

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <ImageBackground
                    source={require('../../../assets/images/guia6juego.png')}
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

                    {/* Images - Normal and Selected */}
                    {visualObjects.map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            style={{
                                position: 'absolute',
                                left: item.position.x,
                                top: item.position.y,
                                zIndex: 5,
                            }}
                            onPress={() => handleObjectPress(item.name)}
                            disabled={!!matches[item.name]}
                        >
                            <Animated.View
                                style={{
                                    transform: [
                                        { scale: animatedValues[item.name] }
                                    ],
                                }}
                            >
                                <Image
                                    source={
                                        selectedObject === item.name || matches[item.name] 
                                        ? item.imageSelected 
                                        : item.imageNormal
                                    }
                                    style={{
                                        width: selectedObject === item.name || matches[item.name] 
                                            ? item.size.selected.width
                                            : item.size.normal.width,
                                        height: selectedObject === item.name || matches[item.name] 
                                            ? item.size.selected.height
                                            : item.size.normal.height,
                                        resizeMode: 'contain',
                                    }}
                                />
                            </Animated.View>
                        </TouchableOpacity>
                    ))}

                    {/* Buttons Container - Word Options */}
                    <View style={styles.buttonsContainer}>
                        {draggableElements.map((item) => {
                            const isMatched = Object.values(matches).includes(item.name);
                            const wordColor = wordColors.find(word => word.name === item.name);
                            
                            return (
                                <View key={item.id} style={styles.buttonWrapper}>
                                    <TouchableOpacity
                                        style={[
                                            styles.button,
                                            selectedWord === item.name && styles.selectedWord,
                                            isMatched && {
                                                backgroundColor: '#ffffff',
                                                borderColor: wordColor?.color || '#9e9e9e',
                                                borderWidth: 2,
                                            }
                                        ]}
                                        onPress={() => handleWordPress(item)}
                                        disabled={isMatched}
                                        activeOpacity={0.7}
                                    >
                                        <Image 
                                            source={item.image} 
                                            style={styles.wordImage}
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
    wordsContainer: {
        position: 'absolute',
        bottom: hp('8%'),
        left: wp('5%'),
        width: wp('25%'),
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        gap: wp('1%'),
    },
    wordButton: {
        backgroundColor: 'rgba(255,255,255,0.5)',
        borderRadius: 10,
        padding: 2,
        margin: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectedWord: {
        backgroundColor: '#f0f0f0',
        borderColor: '#677',
        borderWidth: 1.5,
    },
    wordImage: {
        width: wp('13%'),
        height: hp('7%'),
        resizeMode: 'contain',
    },
    buttonsContainer: {
        position: 'absolute',
        bottom: hp('5%'),
        left: wp('18%'),
        width: wp('50%'),
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
});

export default Level6;