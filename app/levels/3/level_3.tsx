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

const bgImage = require('@/assets/images/guia3juego.png');

// Objetos visuales (imágenes)
const visualObjects = [
    {
        id: 1,
        name: 'u_tto',
        imageNormal: require('@/assets/images/u_tto_normal.png'),
        imageSelected: require('@/assets/images/u_tto_sombra.png'),
        position: { 
            x: wp('-1%'),
            y: hp('55%')
        },
        size: {
            normal: { width: wp('23%'), height: hp('20%') },
            selected: { width: wp('23%'), height: hp('21%') }
        },
        correctWord: 'u_tto'
    },
    {
        id: 2,
        name: 'uko',
        imageNormal: require('@/assets/images/uko_normal.png'),
        imageSelected: require('@/assets/images/uko_sombra.png'),
        position: { 
            x: wp('58%'),
            y: hp('66%')
        },
        size: {
            normal: { width: wp('20%'), height: hp('17%') },
            selected: { width: wp('18%'), height: hp('16%') }
        },
        correctWord: 'uko'
    },
    {
        id: 3,
        name: 'u_tso_pabakok',
        imageNormal: require('@/assets/images/u_tso_pabakok_normal.png'),
        imageSelected: require('@/assets/images/u_tso_pabakok_sombra.png'),
        position: { 
            x: wp('59%'),
            y: hp('20%')
        },
        size: {
            normal: { width: wp('26%'), height: hp('26%') },
            selected: { width: wp('26%'), height: hp('32%') }
        },
        correctWord: 'u_tso_pabakok'
    },
    {
        id: 4,
        name: 'u_tsi',
        imageNormal: require('@/assets/images/u_tsi_normal.png'),
        imageSelected: require('@/assets/images/u_tsi_sombra.png'),
        position: { 
            x: wp('43%'),
            y: hp('58%')
        },
        size: {
            normal: { width: wp('17%'), height: hp('16%') },
            selected: { width: wp('17%'), height: hp('17%') }
        },
        correctWord: 'u_tsi'
    },
    {
        id: 5,
        name: 'pabakok',
        imageNormal: require('@/assets/images/pabakok_normal.png'),
        imageSelected: require('@/assets/images/pabakok_sombra.png'),
        position: { 
            x: wp('22%'),
            y: hp('9%')
        },
        size: {
            normal: { width: wp('26%'), height: hp('26%') },
            selected: { width: wp('29%'), height: hp('29%') }
        },
        correctWord: 'pabakok'
    },
    {
        id: 6,
        name: 'etsok',
        imageNormal: require('@/assets/images/etsok_normal.png'),
        imageSelected: require('@/assets/images/etsok_sombra.png'),
        position: { 
            x: wp('3%'),
            y: hp('25%')
        },
        size: {
            normal: { width: wp('16%'), height: hp('20%') },
            selected: { width: wp('16%'), height: hp('21%') }
        },
        correctWord: 'etsok'
    },
];

// Draggable elements data with names for matching
const draggableElements = [
    {
        id: 1,
        name: 'u_tto',
        image: require('@/assets/images/u_tto2.png'),
    },
    {
        id: 2,
        name: 'uko',
        image: require('@/assets/images/uko2.png'),
    },
    {
        id: 3,
        name: 'u_tso_pabakok',
        image: require('@/assets/images/u_tso_pabakok2.png'),
    },
    {
        id: 4,
        name: 'u_tsi',
        image: require('@/assets/images/u_tsi2.png'),
    },
    {
        id: 5,
        name: 'pabakok',
        image: require('@/assets/images/pabakok2.png'),
    },
    {
        id: 6,
        name: 'etsok',
        image: require('@/assets/images/etsok2.png'),
    },
];

const wordColors = [
    {
        name: 'u_tto',
        color: '#e4191c',
    },
    {
        name: 'uko',
        color: '#e94d1f',
    },
    {
        name: 'u_tso_pabakok',
        color: '#0046e3',
    },
    {
        name: 'u_tsi',
        color: '#e6175c',
    },
    {
        name: 'pabakok',
        color: '#ede430',
    },
    {
        name: 'etsok',
        color: '#68e033',
    },
];

const Level3 = ({ navigation }: { navigation: NavigationProp<any> }) => {
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
                {/* Back Button - Fixed position outside of ImageBackground */}
                <View style={styles.buttonsBackContainer}>
                    <BackButton navigation={navigation} />
                </View>
                
                {canContinue && (
                        <View style={styles.buttonsNextContainer}>
                            <NextButton navigation={navigation} nextName="LevelMapping" />
                        </View>
                    )}
                
                <ImageBackground
                    source={require('../../../assets/images/guia3juego.png')}
                    style={styles.backgroundImage}
                    resizeMode="contain"
                >
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
        left: wp('0%'),
        zIndex: 10,
    },
    buttonsNextContainer: {
        position: 'absolute',
        bottom: hp('0%'),
        right: wp('2%'),
        zIndex: 10,
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
        bottom: hp('9%'),
        left: wp('7%'),
        width: wp('50%'),
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        gap: wp('2%'),
        columnGap: wp('3.1%'),
        rowGap: wp('1%'),
    },
    buttonWrapper: {
        width: wp('11%'),
        height: hp('5%'),
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: wp('0.5%'),
    },
    button: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 5,
        padding: hp('0.5%'),
        width: wp('14%'),
        height: hp('5%'),
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default Level3;