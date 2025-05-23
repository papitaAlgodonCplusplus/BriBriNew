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

// Objetos visuales (imágenes)
const visualObjects = [
    {
        id: 1,
        name: 'obj_tso_klowok',
        imageNormal: require('@/assets/images/tso_klowok_normal.png'),
        imageSelected: require('@/assets/images/tso_klowok_sombra.png'),
        position: { 
            x: wp('3%'),
            y: hp('50%')
        },
        size: {
            normal: { width: wp('21%'), height: hp('23%') },
            selected: { width: wp('20%'), height: hp('24%') }
        },
        correctWord: 'tso klowok'
    },
    {
        id: 2,
        name: 'obj_shkeki',
        imageNormal: require('@/assets/images/shkeki_normal.png'),
        imageSelected: require('@/assets/images/shkeki_sombra.png'),
        position: { 
            x: wp('26%'),
            y: hp('25%')
        },
        size: {
            normal: { width: wp('20%'), height: hp('19%') },
            selected: { width: wp('20%'), height: hp('20%') }
        },
        correctWord: 'shkeki'
    },
    {
        id: 3,
        name: 'obj_tso',
        imageNormal: require('@/assets/images/tso_normal.png'),
        imageSelected: require('@/assets/images/tso_sombra.png'),
        position: { 
            x: wp('65%'),
            y: hp('25%')
        },
        size: {
            normal: { width: wp('20%'), height: hp('15%') },
            selected: { width: wp('20%'), height: hp('18%') }
        },
        correctWord: 'tso'
    },
    {
        id: 4,
        name: 'obj_kule',
        imageNormal: require('@/assets/images/kule_normal.png'),
        imageSelected: require('@/assets/images/kule_sombra.png'),
        position: { 
            x: wp('39%'),
            y: hp('22%')
        },
        size: {
            normal: { width: wp('16%'), height: hp('18%') },
            selected: { width: wp('16%'), height: hp('20%') }
        },
        correctWord: 'kule'
    },
    {
        id: 5,
        name: 'obj_nak_kata',
        imageNormal: require('@/assets/images/nak_kata_normal.png'),
        imageSelected: require('@/assets/images/nak_kata_sombra.png'),
        position: { 
            x: wp('51%'),
            y: hp('68%')
        },
        size: {
            normal: { width: wp('24%'), height: hp('20%') },
            selected: { width: wp('24%'), height: hp('21%') }
        },
        correctWord: 'nak kata'
    },
    {
        id: 6,
        name: 'obj_se',
        imageNormal: require('@/assets/images/se_normal.png'),
        imageSelected: require('@/assets/images/se_sombra.png'),
        position: { 
            x: wp('13%'),
            y: hp('51%')
        },
        size: {
            normal: { width: wp('15%'), height: hp('22%') },
            selected: { width: wp('15%'), height: hp('24%') }
        },
        correctWord: 'se'
    },
    {
        id: 7,
        name: 'obj_seukuo',
        imageNormal: require('@/assets/images/seukuo_normal.png'),
        imageSelected: require('@/assets/images/seukuo_sombra.png'),
        position: { 
            x: wp('30%'),
            y: hp('84%')
        },
        size: {
            normal: { width: wp('20%'), height: hp('14%') },
            selected: { width: wp('20%'), height: hp('15%') }
        },
        correctWord: 'seukuo'
    },
    {
        id: 8,
        name: 'obj_i_kule',
        imageNormal: require('@/assets/images/i_kule_normal.png'),
        imageSelected: require('@/assets/images/i_kule_sombra.png'),
        position: { 
            x: wp('3%'),
            y: hp('23%')
        },
        size: {
            normal: { width: wp('30%'), height: hp('24%') },
            selected: { width: wp('28%'), height: hp('22%') }
        },
        correctWord: 'i kule'
    },
    {
        id: 9,
        name: 'obj_chamulikata',
        imageNormal: require('@/assets/images/chamulikata_normal.png'),
        imageSelected: require('@/assets/images/chamulikata_sombra.png'),
        position: { 
            x: wp('-3%'),
            y: hp('77%')
        },
        size: {
            normal: { width: wp('40%'), height: hp('30%') },
            selected: { width: wp('34%'), height: hp('24%') }
        },
        correctWord: 'chamulikata'
    }
];

const draggableElements = [
    {
        id: 1,
        name: 'tso klowok',
        image: require('@/assets/images/tso_klowok2.png'),
    },
    {
        id: 2,
        name: 'shkeki',
        image: require('@/assets/images/shkeki2.png'),
    },
    {
        id: 3,
        name: 'tso',
        image: require('@/assets/images/tso2.png'),
    },
    {
        id: 4,
        name: 'kule',
        image: require('@/assets/images/kule2.png'),
    },
    {
        id: 5,
        name: 'nak kata',
        image: require('@/assets/images/nak_kata2.png'),
    },
    {
        id: 6,
        name: 'se',
        image: require('@/assets/images/se2.png'),
    },
    {
        id: 7,
        name: 'seukuo',
        image: require('@/assets/images/seukuo2.png'),
    },
    {
        id: 8,
        name: 'i kule',
        image: require('@/assets/images/i_kule2.png'),
    },
    {
        id: 9,
        name: 'chamulikata',
        image: require('@/assets/images/chamulikata2.png'),
    },
];

const wordColors = [
    {
        name: 'tso klowok',
        color: '#e4191c',
    },
    {
        name: 'shkeki',
        color: '#e94d1f',
    },
    {
        name: 'tso',
        color: '#48ac8f',
    },
    {
        name: 'kule',
        color: '#d92a73',
    },
    {
        name: 'nak kata',
        color: '#68e033',
    },
    {
        name: 'se',
        color: '#99307a',
    },
    {
        name: 'seukuo',
        color: '#e6175c',
    },
    {
        name: 'i kule',
        color: '#ede430',
    },
    {
        name: 'chamulikata',
        color: '#0046e3',
    },
];

const Level2 = ({ navigation }: { navigation: NavigationProp<any> }) => {
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
});

export default Level2;