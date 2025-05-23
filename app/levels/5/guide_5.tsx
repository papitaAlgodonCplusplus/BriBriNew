import React, { useState, useEffect } from 'react';
import { ImageBackground, StyleSheet, View, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackButton from '@/app/misc/BackButton';
import NextButton from '@/app/misc/NextButton';
import { NavigationProp } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const Guide = ({ navigation }: { navigation: NavigationProp<any> }) => {
    const bgImage = require('@/assets/images/guia5.png');

    const [mode, setMode] = useState<'read' | 'listen' | null>(null);

    useEffect(() => {
        const fetchMode = async () => {
            const storedMode = await AsyncStorage.getItem('mode');
            setMode(storedMode === 'read' || storedMode === 'listen' ? storedMode : 'listen');
        };
        fetchMode();
    }, []);

    return (
        <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
          <ImageBackground
            source={bgImage}
            style={styles.bgImage}
            imageStyle={{ resizeMode: 'contain' }}>
            <View style={styles.buttonsBackContainer}>
              <BackButton navigation={navigation} />
            </View>
            <View style={styles.buttonsNextContainer}>
                <NextButton navigation={navigation} nextName="Level5" />
            </View>
          </ImageBackground>
        </SafeAreaView>
      </SafeAreaProvider>
    );
};

const styles: { [key: string]: any } = StyleSheet.create({
    container: {
        flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#ffff',
      },
      bgImage: {
        flex: 1,
        width: wp('100%'),
        height: hp('115%'),
        right: wp('4%'),
      },
      buttonsBackContainer: {
        position: 'absolute',
        top: hp('0%'),
        left: wp('0%'),
        resizeMode: 'cover',
    },
    buttonsNextContainer: {
        position: 'absolute',
        bottom: hp('0%'),
        right: wp('0%'),
    }
});

export default Guide;
