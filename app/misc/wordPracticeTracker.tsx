// app/misc/wordPracticeTracker.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface WordAttempt {
  word: string;
  levelId: number;
  mode: 'read' | 'listen';
  isCorrect: boolean;
  timestamp: number;
}

export interface WordStats {
  word: string;
  levelId: number;
  mode: 'read' | 'listen';
  totalAttempts: number;
  correctAttempts: number;
  failureRate: number;
  lastAttempted: number;
}

const WORD_ATTEMPTS_KEY = 'wordAttempts';
const MIN_ATTEMPTS_FOR_PRACTICE = 3; // Minimum attempts before considering for practice
const MIN_FAILURE_RATE = 0.4; // 40% failure rate to be included in practice

/**
 * Record a word attempt (correct or incorrect)
 */
export async function recordWordAttempt(
  word: string,
  levelId: number,
  mode: 'read' | 'listen',
  isCorrect: boolean
): Promise<void> {
  try {
    const attempts = await getWordAttempts();
    const newAttempt: WordAttempt = {
      word,
      levelId,
      mode,
      isCorrect,
      timestamp: Date.now()
    };
    
    attempts.push(newAttempt);
    
    // Keep only last 1000 attempts to prevent storage bloat
    if (attempts.length > 1000) {
      attempts.splice(0, attempts.length - 1000);
    }
    
    await AsyncStorage.setItem(WORD_ATTEMPTS_KEY, JSON.stringify(attempts));
    console.log(`Recorded attempt for word "${word}": ${isCorrect ? 'correct' : 'incorrect'}`);
  } catch (error) {
    console.error('Error recording word attempt:', error);
  }
}

/**
 * Get all word attempts from storage
 */
export async function getWordAttempts(): Promise<WordAttempt[]> {
  try {
    const stored = await AsyncStorage.getItem(WORD_ATTEMPTS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error getting word attempts:', error);
    return [];
  }
}

/**
 * Calculate statistics for all words
 */
export async function getWordStatistics(): Promise<WordStats[]> {
  try {
    const attempts = await getWordAttempts();
    const statsMap = new Map<string, WordStats>();
    
    attempts.forEach(attempt => {
      const key = `${attempt.word}_${attempt.levelId}_${attempt.mode}`;
      
      if (!statsMap.has(key)) {
        statsMap.set(key, {
          word: attempt.word,
          levelId: attempt.levelId,
          mode: attempt.mode,
          totalAttempts: 0,
          correctAttempts: 0,
          failureRate: 0,
          lastAttempted: attempt.timestamp
        });
      }
      
      const stats = statsMap.get(key)!;
      stats.totalAttempts++;
      if (attempt.isCorrect) {
        stats.correctAttempts++;
      }
      stats.lastAttempted = Math.max(stats.lastAttempted, attempt.timestamp);
    });
    
    // Calculate failure rates
    const allStats = Array.from(statsMap.values());
    allStats.forEach(stats => {
      stats.failureRate = stats.totalAttempts > 0 
        ? (stats.totalAttempts - stats.correctAttempts) / stats.totalAttempts 
        : 0;
    });
    
    return allStats;
  } catch (error) {
    console.error('Error calculating word statistics:', error);
    return [];
  }
}

/**
 * Get words that need practice (high failure rate, sufficient attempts)
 */
export async function getWordsForPractice(): Promise<WordStats[]> {
  try {
    const allStats = await getWordStatistics();
    
    return allStats
      .filter(stats => 
        stats.totalAttempts >= MIN_ATTEMPTS_FOR_PRACTICE && 
        stats.failureRate >= MIN_FAILURE_RATE
      )
      .sort((a, b) => {
        // Sort by failure rate descending, then by total attempts descending
        if (b.failureRate !== a.failureRate) {
          return b.failureRate - a.failureRate;
        }
        return b.totalAttempts - a.totalAttempts;
      })
      .slice(0, 20); // Limit to top 20 most problematic words
  } catch (error) {
    console.error('Error getting words for practice:', error);
    return [];
  }
}

/**
 * Check if there are enough words for a practice session
 */
export async function hasWordsForPractice(): Promise<boolean> {
  try {
    const practiceWords = await getWordsForPractice();
    console.log(`Found ${practiceWords.length} words for practice`);
    return practiceWords.length >= 2; // Need at least 4 words for a meaningful practice
  } catch (error) {
    console.error('Error checking for practice words:', error);
    return false;
  }
}

/**
 * Clear all word attempt data (for testing or reset)
 */
export async function clearWordAttempts(): Promise<void> {
  try {
    await AsyncStorage.removeItem(WORD_ATTEMPTS_KEY);
    console.log('Word attempts cleared');
  } catch (error) {
    console.error('Error clearing word attempts:', error);
  }
}