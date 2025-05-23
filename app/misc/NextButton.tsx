import React from 'react';
import { TouchableOpacity, Image, StyleSheet } from 'react-native';
import { NavigationProp } from '@react-navigation/native';

interface NextButtonProps {
    navigation: NavigationProp<any>;
    nextName: string;
}

const NextButton: React.FC<NextButtonProps> = ({ navigation, nextName }) => {
    const handleContinue = () => {
        navigation.navigate(nextName);
    }

    return (
        <TouchableOpacity style={styles.button} onPress={handleContinue}>
            <Image
                // source={require('@/assets/images/button.png')}
                // style={styles.buttonImageBottom}
            />
            <Image
                source={require('@/assets/images/atras.png')}
                style={styles.adelante}
            />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    adelante: {
        width: 70,
        height: 40,
        transform: [{ rotate: '180deg' }, { translateX: 0 }, { translateY: 1 }],
        resizeMode: 'stretch',
    },
    button: {
        position: 'absolute',
        bottom: 20,
        right: 10,
        zIndex: 1,
    },
    buttonImageBottom: {
        width: '95%',
        height: 110,
        position: 'absolute',
        bottom: -34,
        right: 1,
        resizeMode: 'stretch',
    },
});

export default NextButton;
