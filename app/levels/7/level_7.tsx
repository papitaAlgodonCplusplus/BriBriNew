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

const bgImage = require('@/assets/images/guia7juego.png');

const visualObjects = [
    {
        id: 1,
        name: 'obj_ajko_ko',
        imageNormal: require('@/assets/images/ajko_ko_normal.png'),
        imageSelected: require('@/assets/images/ajko_ko_sombra.png'),
        position: { 
            x: wp('2%'),
            y: hp('50%')
        },
        size: {
            normal: { width: wp('25%'), height: hp('30%') },
            selected: { width: wp('25%'), height: hp('32%') }
        },
        correctWord: 'ajko_ko'
    },
    {
        id: 2,
        name: 'obj_sabak_dule',
        imageNormal: require('@/assets/images/sabak_dule_normal.png'),
        imageSelected: require('@/assets/images/sabak_dule_sombra.png'),
        position: { 
            x: wp('28%'),
            y: hp('51%')
        },
        size: {
            normal: { width: wp('21%'), height: hp('28%') },
            selected: { width: wp('21%'), height: hp('28%') }
        },
        correctWord: 'sabak_dule'
    },
    {
        id: 3,
        name: 'obj_kula',
        imageNormal: require('@/assets/images/kula_normal.png'),
        imageSelected: require('@/assets/images/kula_sombra.png'),
        position: { 
            x: wp('55.5%'),
            y: hp('64%')
        },
        size: {
            normal: { width: wp('12%'), height: hp('14%') },
            selected: { width: wp('16%'), height: hp('17%') }
        },
        correctWord: 'kula'
    },
    {
        id: 4,
        name: 'obj_to_ta',
        imageNormal: require('@/assets/images/to_ta_normal.png'),
        imageSelected: require('@/assets/images/to_ta_sombra.png'),
        position: { 
            x: wp('56%'),
            y: hp('20%')
        },
        size: {
            normal: { width: wp('16%'), height: hp('18%') },
            selected: { width: wp('21%'), height: hp('28%') }
        },
        correctWord: 'to_ta'
    },
    {
        id: 5,
        name: 'obj_sku',
        imageNormal: require('@/assets/images/sku_normal.png'),
        imageSelected: require('@/assets/images/sku_sombra.png'),
        position: { 
            x: wp('43%'),
            y: hp('0%')
        },
        size: {
            normal: { width: wp('18%'), height: hp('20%') },
            selected: { width: wp('18%'), height: hp('22%') }
        },
        correctWord: 'sku'
    },
    {
        id: 6,
        name: 'obj_tska_tka',
        imageNormal: require('@/assets/images/tska_tka_normal.png'),
        imageSelected: require('@/assets/images/tska_tka_sombra.png'),
        position: { 
            x: wp('18%'),
            y: hp('56%')
        },
        size: {
            normal: { width: wp('18%'), height: hp('14%') },
            selected: { width: wp('18%'), height: hp('17%') }
        },
        correctWord: 'tska_tka'
    },
    {
        id: 7,
        name: 'obj_kule',
        imageNormal: require('@/assets/images/kule2_normal.png'),
        imageSelected: require('@/assets/images/kule2_sombra.png'),
        position: { 
            x: wp('40%'),
            y: hp('60%')
        },
        size: {
            normal: { width: wp('18%'), height: hp('14%') },
            selected: { width: wp('18%'), height: hp('17%') }
        },
        correctWord: 'kule'
    },
    {
        id: 8,
        name: 'obj_skou',
        imageNormal: require('@/assets/images/skou_normal.png'),
        imageSelected: require('@/assets/images/skou_sombra.png'),
        position: { 
            x: wp('54%'),
            y: hp('40%')
        },
        size: {
            normal: { width: wp('20%'), height: hp('14%') },
            selected: { width: wp('21%'), height: hp('17%') }
        },
        correctWord: 'skou'
    },
    {
        id: 9,
        name: 'obj_tcho_tka',
        imageNormal: require('@/assets/images/tcho_tka_normal.png'),
        imageSelected: require('@/assets/images/tcho_tka_sombra.png'),
        position: { 
            x: wp('55%'),
            y: hp('8%')
        },
        size: {
            normal: { width: wp('14%'), height: hp('14%') },
            selected: { width: wp('14%'), height: hp('17%') }
        },
        correctWord: 'tcho_tka'
    },
    {
        id: 10,
        name: 'obj_u',
        imageNormal: require('@/assets/images/u_normal.png'),
        imageSelected: require('@/assets/images/u_sombra.png'),
        position: { 
            x: wp('27%'),
            y: hp('-5%')
        },
        size: {
            normal: { width: wp('20%'), height: hp('20%') },
            selected: { width: wp('21%'), height: hp('28%') }
        },
        correctWord: 'u'
    }
];

const draggableElements = [
    {
        id: 1,
        name: 'ajko_ko',
        image: require('@/assets/images/ajko_ko2.png'),
    },
    {
        id: 2,
        name: 'sabak_dule',
        image: require('@/assets/images/sabak_dule2.png'),
    },
    {
        id: 3,
        name: 'kula',
        image: require('@/assets/images/kula2.png'),
    },
    {
        id: 4,
        name: 'to_ta',
        image: require('@/assets/images/to_ta2.png'),
    },
    {
        id: 5,
        name: 'sku',
        image: require('@/assets/images/sku2.png'),
    },
    {
        id: 6,
        name: 'tska_tka',
        image: require('@/assets/images/tska_tka2.png'),
    },
    {
        id: 7,
        name: 'kule',
        image: require('@/assets/images/kule2.png'),
    },
    {
        id: 8,
        name: 'skou',
        image: require('@/assets/images/skou2.png'),
    },
    {
        id: 9,
        name: 'tcho_tka',
        image: require('@/assets/images/tcho_tka2.png'),
    },
    {
        id: 10,
        name: 'u',
        image: require('@/assets/images/u2.png'),
    },
];

const wordColors = [
    {
        name: 'ajko_ko',
        color: '#0046e3',
    },
    {
        name: 'sabak_dule',
        color: '#603f91',
    },
    {
        name: 'kula',
        color: '#e6175c',
    },
    {
        name: 'to_ta',
        color: '#d92a73',
    },
    {
        name: 'sku',
        color: '#48ac8f',
    },
    {
        name: 'tska_tka',
        color: '#e4191c',
    },
    {
        name: 'kule',
        color: '#ede430',
    },
    {
        name: 'skou',
        color: '#e94d1f',
    },
    {
        name: 'tcho_tka',
        color: '#68e033',
    },
    {
        name: 'u',
        color: '#99307a',
    },
];

const Level7 = ({ navigation }: { navigation: NavigationProp<any> }) => {
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
                    source={require('../../../assets/images/guia7juego.png')}
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

const dropZoneStyles = StyleSheet.create({
    dropZone: {
        position: 'absolute',
        borderColor: 'black',
        borderWidth: 3,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        margin: 5, // 10px spacing (5px on each side)
    },
});

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
        left: wp('11%'),
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
});

export default Level7;