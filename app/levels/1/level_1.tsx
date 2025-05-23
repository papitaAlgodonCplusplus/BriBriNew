import { LogBox } from 'react-native';
LogBox.ignoreLogs([
    'Draggable: Support for defaultProps will be removed'
]);
import React, { useState, useEffect, useRef } from 'react';
import { handleLevelCompletion, getNextLevelId, getNextLevelScreenName } from '../../misc/levelCompletion';
import LevelCompleteModal from '../../screens/LevelCompleteModal';
import { LevelMode } from '../../misc/progress';
import { Image } from "expo-image";
import {
    View,
    ImageBackground,
    StyleSheet,
    TouchableOpacity,
    Text,
    Animated,
    Easing,
} from 'react-native';
import { Audio } from 'expo-av';
import { NavigationProp } from '@react-navigation/native';
import BackButton from '../../misc/BackButton';
import NextButton from '../../misc/NextButton';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Objetos visuales (imágenes)
const visualObjects = [
    {
        id: 1,
        name: 'obj_ale',
        imageNormal: require('@/assets/images/ale_normal.png'),
        imageSelected: require('@/assets/images/ale_sombra.png'),
        position: {
            x: wp('15%'),
            y: hp('42%')
        },
        size: {
            normal: { width: wp('20%'), height: hp('12%') },
            selected: { width: wp('20%'), height: hp('15%') }
        },
        correctWord: 'alè'
    },
    {
        id: 2,
        name: 'obj_nolo_nkuo',
        imageNormal: require('@/assets/images/nolo_kuo_normal.png'),
        imageSelected: require('@/assets/images/nolo_kuo_sombra.png'),
        position: {
            x: wp('3%'),
            y: hp('104%')
        },
        size: {
            normal: { width: wp('24%'), height: hp('15%') },
            selected: { width: wp('24%'), height: hp('16%') }
        },
        correctWord: 'ñolö nkuö'
    },
    {
        id: 3,
        name: 'obj_kapo',
        imageNormal: require('@/assets/images/kapo_normal.png'),
        imageSelected: require('@/assets/images/kapo_sombra.png'),
        position: {
            x: wp('52%'),
            y: hp('96%')
        },
        size: {
            normal: { width: wp('18%'), height: hp('11%') },
            selected: { width: wp('18%'), height: hp('12%') }
        },
        correctWord: 'kapö'
    },
    {
        id: 4,
        name: 'obj_nolo_kibi',
        imageNormal: require('@/assets/images/nolo_kibi_normal.png'),
        imageSelected: require('@/assets/images/nolo_kibi_sombra.png'),
        position: {
            x: wp('38%'),
            y: hp('103%')
        },
        size: {
            normal: { width: wp('20%'), height: hp('12%') },
            selected: { width: wp('21%'), height: hp('14%') }
        },
        correctWord: 'ñolö kibí'
    }
];

const draggableElements = [
    {
        id: 1,
        name: 'alè',
        image: require('@/assets/images/ale.png'),
    },
    {
        id: 2,
        name: 'kapö',
        image: require('@/assets/images/kapo.png'),
    },
    {
        id: 3,
        name: 'ñolö kibí',
        image: require('@/assets/images/nolo_kibi.png'),
    },
    {
        id: 4,
        name: 'ñolö nkuö',
        image: require('@/assets/images/nolo_nkuo.png'),
    },
];

const wordColors = [
    {
        name: 'alè',
        color: '#0046e3',
    },
    {
        name: 'ñolö kibí',
        color: '#603f91',
    },
    {
        name: 'kapö',
        color: '#ede430',
    },
    {
        name: 'ñolö nkuö',
        color: '#e4191c',
    },
];

const Level1 = ({ navigation }: { navigation: NavigationProp<any> }) => {
    // Game state
    const [selectedWord, setSelectedWord] = useState<string | null>(null);
    const [selectedObject, setSelectedObject] = useState<string | null>(null);
    const [matches, setMatches] = useState<Record<string, string>>({});
    const [canContinue, setCanContinue] = useState(false);

    const LEVEL_ID = 1;
    const LEVEL_MODE = LevelMode.READ;

    // Toucan guide state
    const [tutorialStep, setTutorialStep] = useState(0);
    const [toucanEnabled, setToucanEnabled] = useState(true);
    const [levelCompleted, setLevelCompleted] = useState(false);
    const [showCompletionModal, setShowCompletionModal] = useState(false);

    // Animation values for visual objects
    const animatedValues = useRef(
        visualObjects.reduce((acc, obj) => {
            acc[obj.name] = new Animated.Value(1);
            return acc;
        }, {} as Record<string, Animated.Value>)
    ).current;

    // Animation values for toucan guide
    const toucanPosition = useRef(new Animated.ValueXY({ x: wp('70%'), y: hp('70%') })).current;
    const bubbleOpacity = useRef(new Animated.Value(0)).current;
    const elementHighlight = useRef(new Animated.Value(0)).current;

    // Load settings and setup toucan guide
    useEffect(() => {
        const loadSettings = async () => {
            try {
                // Check toucan preferences
                const toucanStatus = await AsyncStorage.getItem('toucanGuideEnabled');
                setToucanEnabled(toucanStatus !== 'false');

                // Check if we're coming from guide 1 (continuation of the tutorial)
                const movingToLevel1 = await AsyncStorage.getItem('movingToLevel1');
                const level1GameTutorial = await AsyncStorage.getItem('level1GameTutorialCompleted');

                // Start tutorial if toucan is enabled and either:
                // 1. We're coming from guide 1 (continuation), OR
                // 2. This is the first time seeing level 1 game
                if (toucanStatus !== 'false' &&
                    (movingToLevel1 === 'true' || level1GameTutorial !== 'true')) {

                    // Clear the flag so we don't show it again next time
                    await AsyncStorage.setItem('movingToLevel1', 'false');

                    // Give a small delay to make it feel like a continuation
                    setTimeout(() => {
                        startTutorial();
                    }, 500);
                }
            } catch (error) {
                console.error('Error loading settings:', error);
            }
        };

        loadSettings();

        // Cleanup animations on unmount
        return () => {
            Object.keys(animatedValues).forEach(key => {
                animatedValues[key].stopAnimation();
            });
        };
    }, []);

    // Pulse animation for visual objects
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

    // Start toucan tutorial
    const startTutorial = () => {
        setTutorialStep(1);

        // Start with intro animation
        Animated.sequence([
            Animated.timing(toucanPosition, {
                toValue: { x: wp('50%'), y: hp('70%') },
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.timing(bubbleOpacity, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }),
        ]).start();
    };

    // Advance toucan tutorial to next step
    const advanceTutorial = () => {
        // Reset animations
        bubbleOpacity.setValue(0);
        elementHighlight.setValue(0);

        // Move to next step
        const nextStep = tutorialStep + 1;
        setTutorialStep(nextStep);

        // Different animations based on tutorial step
        switch (nextStep) {
            case 2: // Point to word options
                Animated.parallel([
                    Animated.timing(toucanPosition, {
                        toValue: { x: wp('35%'), y: hp('70%') },
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(bubbleOpacity, {
                        toValue: 1,
                        duration: 500,
                        useNativeDriver: true,
                        delay: 800,
                    }),
                    Animated.loop(
                        Animated.sequence([
                            Animated.timing(elementHighlight, {
                                toValue: 1,
                                duration: 800,
                                useNativeDriver: false,
                            }),
                            Animated.timing(elementHighlight, {
                                toValue: 0.2,
                                duration: 800,
                                useNativeDriver: false,
                            }),
                        ]),
                        { iterations: 3 }
                    ),
                ]).start();
                break;
            case 3: // Point to images in game
                Animated.parallel([
                    Animated.timing(toucanPosition, {
                        toValue: { x: wp('40%'), y: hp('70%') },
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(bubbleOpacity, {
                        toValue: 1,
                        duration: 500,
                        useNativeDriver: true,
                        delay: 800,
                    }),
                ]).start();
                break;
            case 4: // Give final instructions
                Animated.parallel([
                    Animated.timing(toucanPosition, {
                        toValue: { x: wp('60%'), y: hp('70%') },
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(bubbleOpacity, {
                        toValue: 1,
                        duration: 500,
                        useNativeDriver: true,
                        delay: 800,
                    }),
                ]).start();
                break;
            case 5: // Complete tutorial
                completeTutorial();
                break;
        }
    };

    // Handle navigation to next level
    const handleNavigateToNextLevel = () => {
        const nextLevelId = getNextLevelId(LEVEL_ID);
        const nextScreenName = getNextLevelScreenName(nextLevelId, LEVEL_MODE);

        if (nextScreenName) {
            setShowCompletionModal(false);
            navigation.navigate(nextScreenName);
        } else {
            handleModalClose();
        }
    };

    // Handle modal close button
    const handleModalClose = () => {
        setShowCompletionModal(false);
        navigation.navigate('LevelMapping');
    };

    // Complete toucan tutorial and save state
    const completeTutorial = async () => {
        try {
            await AsyncStorage.setItem('level1GameTutorialCompleted', 'true');
            setTutorialStep(0);

            // Animate toucan to final position
            Animated.parallel([
                Animated.timing(bubbleOpacity, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.timing(toucanPosition, {
                    toValue: { x: wp('70%'), y: hp('70%') },
                    duration: 800,
                    useNativeDriver: true,
                }),
            ]).start();
        } catch (error) {
            console.error('Error saving tutorial state:', error);
        }
    };

    // Handle toucan press
    const handleToucanPress = () => {
        if (tutorialStep > 0) {
            advanceTutorial();
        } else {
            // Normal toucan behavior when not in tutorial
            startTutorial();
        }
    };

    // Game logic for word selection
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

                // If in tutorial step 3 (matching words), advance to next step
                // when user makes their first match
                if (tutorialStep === 3 && Object.keys(matches).length === 0) {
                    advanceTutorial();
                }
            } else {
                setSelectedWord(selectedWord === item.name ? null : item.name);
            }
        } else {
            setSelectedWord(selectedWord === item.name ? null : item.name);
        }
    };

    // Game logic for object selection
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

                // If in tutorial step 3 (matching words), advance to next step
                // when user makes their first match
                if (tutorialStep === 3 && Object.keys(matches).length === 0) {
                    advanceTutorial();
                }
            }
        }
    };

    // Check if all matches are made to enable continue button
    useEffect(() => {
        console.log('Matches:', matches);
        console.log('Visual Objects:', visualObjects);
        console.log('Level Completed:', levelCompleted);
        if (Object.keys(matches).length === visualObjects.length && !levelCompleted) {
            console.log('All matches made, enabling continue button');
            setCanContinue(true);

            // Delayed completion to allow user to see final match
            setTimeout(async () => {
                // Mark level as completed and show completion modal
                await handleLevelCompletion(LEVEL_ID, LEVEL_MODE, setShowCompletionModal);
                setLevelCompleted(true);
            }, 1000);
        }
    }, [matches, levelCompleted]);

    // Get tutorial message based on current step
    const getTutorialMessage = () => {
        switch (tutorialStep) {
            case 1:
                return '¡Bienvenido al juego del Nivel 1! Aquí podrás practicar las palabras que acabas de aprender.';
            case 2:
                return 'Primero, selecciona una palabra de esta lista. Estas son las palabras en BriBri que has aprendido.';
            case 3:
                return 'Luego, toca la imagen correcta para emparejarla con la palabra. ¡Intenta hacer tu primera combinación!';
            case 4:
                return '¡Muy bien! Continúa emparejando todas las palabras con sus imágenes correspondientes. Cuando termines, aparecerá el botón "Siguiente".';
            default:
                return '';
        }
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <ImageBackground
                    source={require('../../../assets/images/guia1juego.png')}
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

                    {/* Toucan Guide with animated position */}
                    {toucanEnabled && (
                        <Animated.View
                            style={[
                                styles.toucanContainer,
                                {
                                    transform: [
                                        { translateX: toucanPosition.x },
                                        { translateY: toucanPosition.y }
                                    ]
                                }
                            ]}
                        >
                            <Animated.View style={[
                                styles.speechBubble,
                                { opacity: bubbleOpacity }
                            ]}>
                                <Text style={styles.speechText}>{getTutorialMessage()}</Text>
                                {tutorialStep > 0 && tutorialStep < 5 && (
                                    <Text style={styles.tapToContinue}>Tócame para continuar</Text>
                                )}
                            </Animated.View>

                            <TouchableOpacity
                                onPress={handleToucanPress}
                                activeOpacity={0.7}
                            >
                                <Image
                                    source={require('@/assets/images/toucan_happy.gif')}
                                    style={styles.toucanImage}
                                    resizeMode="contain"
                                />
                            </TouchableOpacity>
                        </Animated.View>
                    )}

                    {/* Buttons Container - Word Options */}
                    <View style={styles.buttonsContainer}>
                        {/* Word selection tutorial highlight */}
                        {tutorialStep === 2 && (
                            <Animated.View
                                style={[
                                    styles.wordsHighlight,
                                    { opacity: elementHighlight }
                                ]}
                            />
                        )}

                        {draggableElements.map((item) => {
                            const isMatched = Object.values(matches).includes(item.name);
                            return (
                                <View key={item.id} style={styles.buttonWrapper}>
                                    <TouchableOpacity
                                        style={[
                                            styles.button,
                                            selectedWord === item.name && styles.selectedWord,
                                            isMatched && {
                                                backgroundColor: '#ffffff',
                                                borderColor: wordColors.find(word => word.name === item.name)?.color || '#9e9e9e',
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
                {/* Level completion modal */}
                <LevelCompleteModal
                    visible={showCompletionModal}
                    levelId={LEVEL_ID}
                    mode={LEVEL_MODE}
                    onClose={handleModalClose}
                    onNextLevel={handleNavigateToNextLevel}
                />
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
    bgImage: {
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
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 5,
        padding: hp('1%'),
        width: wp('11%'),
        height: hp('5%'),
        alignItems: 'center',
        justifyContent: 'center',
    },
    wordText: {
        fontSize: hp('2.2%'),
        color: '#000',
        textAlign: 'center',
    },
    selectedWord: {
        backgroundColor: '#f0f0f0',
        borderColor: '#677',
        borderWidth: 1.5,
    },
    dropZonesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '100%',
        marginTop: 20,
    },
    backgroundImage: {
        alignSelf: 'center',
        width: wp('100%'),
        height: hp('135%'),
        top: hp('-2%'),
    },
    buttonsContainer: {
        position: 'absolute',
        top: hp('30%'),
        left: wp('2%'),
        width: wp('25%'),
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        gap: wp('1%'),
        zIndex: 6,
    },
    buttonWrapper: {
        width: wp('11%'),
        height: hp('5%'),
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 6,
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
        zIndex: 6,
    },
    buttonText: {
        fontSize: hp('2.2%'),
        color: '#000',
        textAlign: 'center',
    },
    matchedWord: {
        opacity: 0.9,
        borderWidth: 1,
    },
    wordImage: {
        width: wp('13%'),
        height: hp('8%'),
        resizeMode: 'contain',
    },
    // Toucan Guide styles
    toucanContainer: {
        position: 'absolute',
        zIndex: 10,
    },
    toucanImage: {
        width: wp('20%'),
        height: hp('20%'),
    },
    speechBubble: {
        position: 'absolute',
        top: -hp('12%'),
        right: wp('5%'),
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 10,
        borderWidth: 2,
        borderColor: '#FFD700',
        width: wp('45%'),
        minHeight: hp('10%'),
        zIndex: 11,
    },
    speechText: {
        fontSize: hp('1.8%'),
        color: '#333',
        textAlign: 'center',
    },
    tapToContinue: {
        fontSize: hp('1.5%'),
        color: '#888',
        textAlign: 'center',
        marginTop: 5,
        fontStyle: 'italic',
    },
    wordsHighlight: {
        position: 'absolute',
        top: -hp('2%'),
        left: -wp('1%'),
        width: wp('25%'),
        height: hp('25%'),
        backgroundColor: 'rgba(255,255,0,0.3)',
        borderRadius: 15,
        zIndex: 1,
    },
});

export default Level1;