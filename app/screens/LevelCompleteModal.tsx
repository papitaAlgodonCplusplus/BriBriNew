
import React, { useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  Image,
  Animated,
  Easing
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Audio } from 'expo-av';
import { LevelMode } from '../misc/progress';

interface LevelCompleteModalProps {
  visible: boolean;
  levelId: number;
  mode: LevelMode;
  onClose: () => void;
  onNextLevel?: () => void;
}

const LevelCompleteModal: React.FC<LevelCompleteModalProps> = ({
  visible,
  levelId,
  mode,
  onClose,
  onNextLevel
}) => {
  // Animation refs
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  
  // Play celebratory sound when modal appears
  useEffect(() => {
    if (visible) {
      startAnimations();
    } else {
      // Reset animations when modal is hidden
      scaleAnim.setValue(0.5);
      rotateAnim.setValue(0);
      opacityAnim.setValue(0);
    }
  }, [visible]);
  
  const startAnimations = () => {
    // Create sequential animations
    Animated.sequence([
      // First fade in and scale up
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 7,
          tension: 40,
          useNativeDriver: true,
        })
      ]),
      // Then rotate star
      Animated.timing(rotateAnim, {
        toValue: 2, // 2 full rotations (720 degrees)
        duration: 1000,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      })
    ]).start();
  };
  
  // Map rotation value to degrees
  const rotation = rotateAnim.interpolate({
    inputRange: [0, 2],
    outputRange: ['0deg', '720deg']
  });
  
  // Get the appropriate star image based on mode
  const getStarImage = () => {
    return mode === LevelMode.READ
      ? require('@/assets/images/star_read.png')
      : require('@/assets/images/star_listen.png');
  };

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <Animated.View 
          style={[
            styles.modalContent,
            {
              opacity: opacityAnim,
              transform: [
                { scale: scaleAnim }
              ]
            }
          ]}
        >
          <Text style={styles.congratsText}>¡Felicidades!</Text>
          <Text style={styles.levelText}>
            Nivel {levelId} {mode === LevelMode.READ ? 'Lectura' : 'Escucha'} Completado
          </Text>
          
          <Animated.View style={{
            transform: [{ rotate: rotation }]
          }}>
            <Image
              source={getStarImage()}
              style={styles.starImage}
              resizeMode="contain"
            />
          </Animated.View>
          
          <View style={styles.buttonsContainer}>
            <TouchableOpacity 
              style={[styles.button, styles.menuButton]} 
              onPress={onClose}
            >
              <Text style={styles.buttonText}>Menú</Text>
            </TouchableOpacity>
            
            {onNextLevel && (
              <TouchableOpacity 
                style={[styles.button, styles.nextButton]} 
                onPress={onNextLevel}
              >
                <Text style={styles.buttonText}>Siguiente Nivel</Text>
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: wp('50%'),
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 15,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFD700',
  },
  congratsText: {
    fontSize: hp('3.5%'),
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  levelText: {
    fontSize: hp('2.5%'),
    color: '#555',
    marginBottom: 20,
    textAlign: 'center',
  },
  starImage: {
    width: wp('20%'),
    height: hp('20%'),
    marginBottom: 20,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    minWidth: wp('15%'),
    alignItems: 'center',
  },
  menuButton: {
    backgroundColor: '#888',
  },
  nextButton: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: hp('2%'),
  }
});

export default LevelCompleteModal;