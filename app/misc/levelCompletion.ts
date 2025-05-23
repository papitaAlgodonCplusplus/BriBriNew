
import { completeLevel, LevelMode } from './progress';

// Level completion function to be called when a level is finished
export async function handleLevelCompletion(
  levelId: number, 
  mode: LevelMode,
  setModalVisible: (visible: boolean) => void
): Promise<void> {
  try {
    // Mark the level as completed in storage
    await completeLevel(levelId, mode);
    
    // Show completion modal
    setModalVisible(true);
    
    // Play a sound or trigger additional effects here if needed
    
  } catch (error) {
    console.error('Error handling level completion:', error);
  }
}

// Helper function to get the next level ID or return to level map if at the end
export function getNextLevelId(currentLevelId: number): number | null {
  // If we're at the last level, return null to indicate no next level
  if (currentLevelId >= 7) {
    return null;
  }
  
  // Otherwise, return the next level
  return currentLevelId + 1;
}

// Helper to get screen name for navigation based on level ID and mode
export function getNextLevelScreenName(
  levelId: number | null, 
  mode: LevelMode
): string | null {
  if (!levelId) {
    return 'LevelMapping'; // Return to level map if no next level
  }
  
  const prefix = mode === LevelMode.READ ? 'Guide' : 'Guide';
  const suffix = mode === LevelMode.READ ? '' : 'Listen';
  
  return `${prefix}${levelId}${suffix}`;
}