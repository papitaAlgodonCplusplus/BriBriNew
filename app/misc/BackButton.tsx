import React from 'react';
import { TouchableOpacity, Image, StyleSheet } from 'react-native';
import { NavigationProp } from '@react-navigation/native';

interface BackButtonProps {
  navigation: NavigationProp<any>;
}

const BackButton: React.FC<BackButtonProps> = ({ navigation }) => {
  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <TouchableOpacity onPress={handleGoBack} style={styles.button}>
      {/* <Image
        source={require('@/assets/images/button.png')}
        style={styles.buttonImageBottom}
      /> */}
      <Image
        source={require('@/assets/images/atras.png')}
        style={styles.atras}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  atras: {
    width: 60,
    height: 40,
    resizeMode: 'stretch',
  },
  button: {
    position: 'absolute',
    top: 40,
    left: 30,
    zIndex: 1,
  },
  buttonImageBottom: {
    width: '100%',
    height: 100,
    position: 'absolute',
    top: -30,
    right: 0,
    resizeMode: 'stretch',
  },
});

export default BackButton;
