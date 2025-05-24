import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationProp } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

interface ToucanSettingsProps {
  navigation: NavigationProp<any>;
}

const ToucanSettings: React.FC<ToucanSettingsProps> = ({ navigation }) => {
  const [toucanEnabled, setToucanEnabled] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const value = await AsyncStorage.getItem('toucanGuideEnabled');
        setToucanEnabled(value !== 'false');
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };

    loadSettings();
  }, []);

  const handleGoBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      // Fallback for when we can't go back
      navigation.navigate('HomePage');
    }
  };

  const toggleToucan = async (value: boolean) => {
    setToucanEnabled(value);
    try {
      await AsyncStorage.setItem('toucanGuideEnabled', value ? 'true' : 'false');
      console.log('Toucan guide setting saved:', value);
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleGoBack}
        >
          <Image
            source={require('@/assets/images/atras.png')}
            style={styles.backIcon}
          />
        </TouchableOpacity>

        <View style={styles.content}>
          <Image
            source={require('@/assets/images/toucan_happy.gif')}
            style={styles.toucanImage}
            resizeMode="contain"
          />

          <Text style={styles.title}>Tuki el Tucán</Text>

          <Text style={styles.description}>
            Tuki es tu guía para aprender BriBri. Te ayudará con consejos y celebrará tus logros mientras aprendes.
          </Text>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Activar Tuki</Text>
            <Switch
              value={toucanEnabled}
              onValueChange={toggleToucan}
              trackColor={{ false: '#767577', true: '#8BE970' }}
              thumbColor={toucanEnabled ? '#4CAF50' : '#f4f3f4'}
            />
          </View>

          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleGoBack}
          >
            <Text style={styles.continueText}>Listo</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  backButton: {
    position: 'absolute',
    top: hp('4%'),
    left: wp('4%'),
    zIndex: 10,
  },
  backIcon: {
    width: 60,
    height: 40,
    resizeMode: 'stretch',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: wp('5%'),
  },
  toucanImage: {
    width: wp('40%'),
    height: hp('30%'),
    marginBottom: hp('4%'),
  },
  title: {
    fontSize: hp('3.5%'),
    fontWeight: 'bold',
    color: '#444',
    marginBottom: hp('2%'),
  },
  description: {
    fontSize: hp('2.2%'),
    color: '#666',
    textAlign: 'center',
    lineHeight: hp('3.3%'),
    marginBottom: hp('5%'),
    paddingHorizontal: wp('5%'),
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: wp('70%'),
    paddingVertical: hp('2%'),
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: hp('5%'),
  },
  settingLabel: {
    fontSize: hp('2.5%'),
    color: '#444',
  },
  continueButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: hp('2%'),
    paddingHorizontal: wp('8%'),
    borderRadius: 25,
    marginTop: hp('2%'),
  },
  continueText: {
    color: 'white',
    fontSize: hp('2.5%'),
    fontWeight: 'bold',
  },
});

export default ToucanSettings;