
import AsyncStorage from '@react-native-async-storage/async-storage';

// Enums for level types
export enum LevelMode {
  READ = 'read',
  LISTEN = 'listen'
}

// Keys for AsyncStorage
const READ_LEVELS_KEY = 'completedReadLevels';
const LISTEN_LEVELS_KEY = 'completedListenLevels';

// Interface for level progress
export interface LevelProgress {
  readLevels: number[];
  listenLevels: number[];
}

/**
 * Mark a level as completed
 * @param levelId The level number (1-7)
 * @param mode The mode (read or listen)
 */
export async function completeLevel(levelId: number, mode: LevelMode): Promise<void> {
  try {
    const storageKey = mode === LevelMode.READ ? READ_LEVELS_KEY : LISTEN_LEVELS_KEY;
    
    // Get existing completed levels
    const storedLevels = await AsyncStorage.getItem(storageKey);
    let completedLevels: number[] = storedLevels ? JSON.parse(storedLevels) : [];
    
    // Add the level if not already completed
    if (!completedLevels.includes(levelId)) {
      completedLevels.push(levelId);
      
      // Sort levels for consistency
      completedLevels.sort((a, b) => a - b);
      
      // Save back to storage
      await AsyncStorage.setItem(storageKey, JSON.stringify(completedLevels));
      console.log(`Level ${levelId} completed in ${mode} mode`);
    }
  } catch (error) {
    console.error('Error completing level:', error);
  }
}

/**
 * Get user's progress for all levels
 */
export async function getLevelProgress(): Promise<LevelProgress> {
  try {
    // Get both types of levels
    const readLevelsStr = await AsyncStorage.getItem(READ_LEVELS_KEY);
    const listenLevelsStr = await AsyncStorage.getItem(LISTEN_LEVELS_KEY);
    
    return {
      readLevels: readLevelsStr ? JSON.parse(readLevelsStr) : [],
      listenLevels: listenLevelsStr ? JSON.parse(listenLevelsStr) : []
    };
  } catch (error) {
    console.error('Error getting level progress:', error);
    return { readLevels: [], listenLevels: [] };
  }
}

/**
 * Check if specific level is completed
 * @param levelId The level to check
 * @param mode The mode to check
 */
export async function isLevelCompleted(levelId: number, mode: LevelMode): Promise<boolean> {
  try {
    const progress = await getLevelProgress();
    return mode === LevelMode.READ 
      ? progress.readLevels.includes(levelId)
      : progress.listenLevels.includes(levelId);
  } catch (error) {
    console.error('Error checking level completion:', error);
    return false;
  }
}

/**
 * Reset all progress
 */
export async function resetProgress(): Promise<void> {
  try {
    await AsyncStorage.removeItem(READ_LEVELS_KEY);
    await AsyncStorage.removeItem(LISTEN_LEVELS_KEY);
    console.log('Progress reset successfully');
  } catch (error) {
    console.error('Error resetting progress:', error);
  }
}