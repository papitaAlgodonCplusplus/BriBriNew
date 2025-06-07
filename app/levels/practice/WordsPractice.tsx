// app/levels/practice/WordsPractice.tsx
import { LogBox } from 'react-native';
LogBox.ignoreLogs([
    'Draggable: Support for defaultProps will be removed'
]);

import { NavigationProp } from '@react-navigation/native';
import { Image } from "expo-image";
import React, { useEffect, useRef, useState } from 'react';
import {
    Alert,
    Animated,
    ImageBackground,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import BackButton from '../../misc/BackButton';
import { getWordsForPractice, recordWordAttempt, WordStats } from '../../misc/wordPracticeTracker';

// All words data from all levels
const ALL_WORDS_DATA = {
    // Level 1
    'alè': {
        levelId: 1,
        image: require('@/assets/images/ale.png'),
        imageNormal: require('@/assets/images/ale_normal.png'),
        imageSelected: require('@/assets/images/ale_sombra.png'),
        color: '#0046e3'
    },
    'kapö': {
        levelId: 1,
        image: require('@/assets/images/kapo.png'),
        imageNormal: require('@/assets/images/kapo_normal.png'),
        imageSelected: require('@/assets/images/kapo_sombra.png'),
        color: '#ede430'
    },
    'ñolö kibí': {
        levelId: 1,
        image: require('@/assets/images/nolo_kibi.png'),
        imageNormal: require('@/assets/images/nolo_kibi_normal.png'),
        imageSelected: require('@/assets/images/nolo_kibi_sombra.png'),
        color: '#603f91'
    },
    'ñolö nkuö': {
        levelId: 1,
        image: require('@/assets/images/nolo_nkuo.png'),
        imageNormal: require('@/assets/images/nolo_kuo_normal.png'),
        imageSelected: require('@/assets/images/nolo_kuo_sombra.png'),
        color: '#e4191c'
    },
    // Level 2
    'tso klowok': {
        levelId: 2,
        image: require('@/assets/images/tso_klowok2.png'),
        imageNormal: require('@/assets/images/tso_klowok_normal.png'),
        imageSelected: require('@/assets/images/tso_klowok_sombra.png'),
        color: '#e4191c'
    },
    'shkeki': {
        levelId: 2,
        image: require('@/assets/images/shkeki2.png'),
        imageNormal: require('@/assets/images/shkeki_normal.png'),
        imageSelected: require('@/assets/images/shkeki_sombra.png'),
        color: '#e94d1f'
    },
    // Level 3
    'u_tto': {
        levelId: 3,
        image: require('@/assets/images/u_tto2.png'),
        imageNormal: require('@/assets/images/u_tto_normal.png'),
        imageSelected: require('@/assets/images/u_tto_sombra.png'),
        color: '#e4191c'
    },
    'uko': {
        levelId: 3,
        image: require('@/assets/images/uko2.png'),
        imageNormal: require('@/assets/images/uko_normal.png'),
        imageSelected: require('@/assets/images/uko_sombra.png'),
        color: '#e94d1f'
    },
    // Level 4
    'kochane': {
        levelId: 4,
        image: require('@/assets/images/kochane2.png'),
        imageNormal: require('@/assets/images/kochane_normal.png'),
        imageSelected: require('@/assets/images/kochane_sombra.png'),
        color: '#e4191c'
    },
    'kokata': {
        levelId: 4,
        image: require('@/assets/images/kokata2.png'),
        imageNormal: require('@/assets/images/kokata_normal.png'),
        imageSelected: require('@/assets/images/kokata_sombra.png'),
        color: '#68e033'
    },
    // Add more words as needed from other levels...
};

interface PracticeWord {
    word: string;
    levelId: number;
    mode: 'read' | 'listen';
    stats: WordStats;
    wordData: any;
}

const WordsPractice = ({ navigation }: { navigation: NavigationProp<any> }) => {
    const [practiceWords, setPracticeWords] = useState<PracticeWord[]>([]);
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [selectedWord, setSelectedWord] = useState<string | null>(null);
    const [matches, setMatches] = useState<Record<string, boolean>>({});
    const [sessionComplete, setSessionComplete] = useState(false);
    const [loading, setLoading] = useState(true);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [totalAnswers, setTotalAnswers] = useState(0);

    // Animation values
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const scaleAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        loadPracticeWords();
    }, []);

    const loadPracticeWords = async () => {
        try {
            const wordsForPractice = await getWordsForPractice();
            console.log('Words for practice:', wordsForPractice);

            if (wordsForPractice.length === 0) {
                Alert.alert(
                    'No hay palabras para practicar',
                    'Juega algunos niveles primero para generar palabras de práctica.',
                    [{ text: 'OK', onPress: () => navigation.goBack() }]
                );
                return;
            }

            // Filter and prepare words that we have data for
            const validWords = wordsForPractice
                .filter(stats => ALL_WORDS_DATA[stats.word as keyof typeof ALL_WORDS_DATA])
                .slice(0, 8) // Limit to 8 words per session
                .map(stats => ({
                    word: stats.word,
                    levelId: stats.levelId,
                    mode: stats.mode,
                    stats,
                    wordData: ALL_WORDS_DATA[stats.word as keyof typeof ALL_WORDS_DATA]
                }));

            if (validWords.length < 2) {
                Alert.alert(
                    'Pocas palabras disponibles',
                    'Necesitas practicar más niveles para generar suficientes palabras de práctica.',
                    [{ text: 'OK', onPress: () => navigation.goBack() }]
                );
                return;
            }

            setPracticeWords(validWords);
            setLoading(false);
        } catch (error) {
            console.error('Error loading practice words:', error);
            Alert.alert(
                'Error',
                'No se pudieron cargar las palabras de práctica.',
                [{ text: 'OK', onPress: () => navigation.goBack() }]
            );
        }
    };

    const handleWordSelection = async (selectedWordName: string) => {
        if (matches[currentWordIndex.toString()]) return; // Already answered

        const currentPracticeWord = practiceWords[currentWordIndex];
        const isCorrect = selectedWordName === currentPracticeWord.word;

        // Record the attempt
        await recordWordAttempt(
            currentPracticeWord.word,
            currentPracticeWord.levelId,
            currentPracticeWord.mode,
            isCorrect
        );

        setSelectedWord(selectedWordName);
        setTotalAnswers(prev => prev + 1);

        if (isCorrect) {
            setCorrectAnswers(prev => prev + 1);
            setMatches(prev => ({ ...prev, [currentWordIndex.toString()]: true }));

            // Success animation
            Animated.sequence([
                Animated.timing(scaleAnim, {
                    toValue: 1.1,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(scaleAnim, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                })
            ]).start();
        } else {
            // Error animation
            Animated.sequence([
                Animated.timing(scaleAnim, {
                    toValue: 0.9,
                    duration: 100,
                    useNativeDriver: true,
                }),
                Animated.timing(scaleAnim, {
                    toValue: 1,
                    duration: 100,
                    useNativeDriver: true,
                })
            ]).start();
        }

        // Move to next word after delay
        setTimeout(() => {
            if (currentWordIndex < practiceWords.length - 1) {
                moveToNextWord();
            } else {
                completeSession();
            }
        }, 1500);
    };

    const moveToNextWord = () => {
        // Fade out current word
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            // Move to next word
            setCurrentWordIndex(prev => prev + 1);
            setSelectedWord(null);

            // Fade in new word
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();
        });
    };

    const completeSession = () => {
        setSessionComplete(true);

        const accuracy = totalAnswers > 0 ? (correctAnswers / totalAnswers) * 100 : 0;

        Alert.alert(
            '¡Sesión Completada!',
            `Precisión: ${accuracy.toFixed(1)}%\nCorrectas: ${correctAnswers}/${totalAnswers}`,
            [
                { text: 'Practicar de Nuevo', onPress: () => restartSession() },
                { text: 'Volver al Menú', onPress: () => navigation.navigate('HomePage') }
            ]
        );
    };

    const restartSession = () => {
        setCurrentWordIndex(0);
        setSelectedWord(null);
        setMatches({});
        setSessionComplete(false);
        setCorrectAnswers(0);
        setTotalAnswers(0);
        fadeAnim.setValue(1);
        scaleAnim.setValue(1);
        loadPracticeWords();
    };

    if (loading) {
        return (
            <SafeAreaProvider>
                <SafeAreaView style={styles.container}>
                    <View style={styles.loadingContainer}>
                        <Text style={styles.loadingText}>Cargando palabras de práctica...</Text>
                    </View>
                </SafeAreaView>
            </SafeAreaProvider>
        );
    }

    if (practiceWords.length === 0) {
        return null;
    }

    const currentPracticeWord = practiceWords[currentWordIndex];
    const currentWordData = currentPracticeWord.wordData;

    // Create options (correct word + 3 random incorrect words)
    const getRandomOptions = () => {
        const allWords = Object.keys(ALL_WORDS_DATA);
        const incorrectWords = allWords.filter(word => word !== currentPracticeWord.word);
        const shuffledIncorrect = incorrectWords.sort(() => Math.random() - 0.5);
        const options = [currentPracticeWord.word, ...shuffledIncorrect.slice(0, 3)];
        return options.sort(() => Math.random() - 0.5); // Shuffle final options
    };

    const options = getRandomOptions();

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <ImageBackground
                    source={require('../../../assets/images/guia1juego.png')}
                    style={styles.backgroundImage}
                    resizeMode="contain"
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <BackButton navigation={navigation} />
                        <View style={styles.progressContainer}>
                            <Text style={styles.progressText}>
                                {currentWordIndex + 1} / {practiceWords.length}
                            </Text>
                            <Text style={styles.accuracyText}>
                                Precisión: {totalAnswers > 0 ? ((correctAnswers / totalAnswers) * 100).toFixed(0) : 0}%
                            </Text>
                        </View>
                    </View>

                    {/* Word Stats */}
                    <View style={styles.statsContainer}>
                        <Text style={styles.statsText}>
                            Palabra del Nivel {currentPracticeWord.levelId} •
                            Fallas: {(currentPracticeWord.stats.failureRate * 100).toFixed(0)}%
                        </Text>
                    </View>

                    {/* Current Word Display */}
                    <Animated.View
                        style={[
                            styles.wordDisplayContainer,
                            {
                                opacity: fadeAnim,
                                transform: [{ scale: scaleAnim }]
                            }
                        ]}
                    >
                        <Image
                            source={selectedWord === currentPracticeWord.word ?
                                currentWordData.imageSelected :
                                currentWordData.imageNormal
                            }
                            style={styles.wordImage}
                            resizeMode="contain"
                        />
                    </Animated.View>

                    {/* Answer Options */}
                    <View style={styles.optionsContainer}>
                        {options.map((option, index) => {
                            const optionData = ALL_WORDS_DATA[option as keyof typeof ALL_WORDS_DATA];
                            const isSelected = selectedWord === option;
                            const isCorrect = option === currentPracticeWord.word;
                            const showResult = selectedWord !== null;

                            return (
                                <TouchableOpacity
                                    key={index}
                                    style={[
                                        styles.optionButton,
                                        isSelected && showResult && isCorrect && styles.correctOption,
                                        isSelected && showResult && !isCorrect && styles.incorrectOption,
                                        showResult && isCorrect && !isSelected && styles.missedCorrectOption
                                    ]}
                                    onPress={() => handleWordSelection(option)}
                                    disabled={selectedWord !== null}
                                >
                                    <Image
                                        source={optionData.image}
                                        style={styles.optionImage}
                                        resizeMode="contain"
                                    />
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    {/* Instructions */}
                    <View style={styles.instructionsContainer}>
                        <Text style={styles.instructionsText}>
                            Selecciona la palabra correcta para la imagen
                        </Text>
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
    },
    backgroundImage: {
        flex: 1,
        width: wp('100%'),
        height: hp('100%'),
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: hp('3%'),
        color: '#333',
        textAlign: 'center',
        marginBottom: hp('2%'),
    },
    backButton: {
        backgroundColor: '#3498db',
        paddingVertical: hp('1.5%'),
        paddingHorizontal: wp('8%'),
        borderRadius: 25,
        marginTop: hp('2%'),
    },
    backButtonText: {
        color: 'white',
        fontSize: hp('2%'),
        fontWeight: 'bold',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: wp('5%'),
        paddingTop: hp('2%'),
        zIndex: 10,
    },
    progressContainer: {
        alignItems: 'center',
    },
    progressText: {
        fontSize: hp('2.5%'),
        fontWeight: 'bold',
        color: '#333',
    },
    accuracyText: {
        fontSize: hp('2%'),
        color: '#666',
    },
    statsContainer: {
        alignItems: 'center',
        marginTop: hp('1%'),
    },
    statsText: {
        fontSize: hp('2%'),
        color: '#888',
        textAlign: 'center',
    },
    wordDisplayContainer: {
        alignItems: 'center',
        marginTop: hp('5%'),
        marginBottom: hp('5%'),
    },
    wordImage: {
        width: wp('40%'),
        height: hp('25%'),
    },
    optionsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        paddingHorizontal: wp('10%'),
        gap: wp('3%'),
    },
    optionButton: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: wp('2%'),
        marginBottom: hp('2%'),
        borderWidth: 2,
        borderColor: '#ddd',
        width: wp('18%'),
        height: hp('12%'),
        justifyContent: 'center',
        alignItems: 'center',
    },
    correctOption: {
        borderColor: '#4CAF50',
        backgroundColor: '#E8F5E8',
    },
    incorrectOption: {
        borderColor: '#F44336',
        backgroundColor: '#FFEBEE',
    },
    missedCorrectOption: {
        borderColor: '#4CAF50',
        backgroundColor: '#E8F5E8',
    },
    optionImage: {
        width: wp('12%'),
        height: hp('7%'),
    },
    instructionsContainer: {
        alignItems: 'center',
        marginTop: hp('3%'),
        paddingHorizontal: wp('10%'),
    },
    instructionsText: {
        fontSize: hp('2.2%'),
        color: '#333',
        textAlign: 'center',
    },
});

export default WordsPractice;