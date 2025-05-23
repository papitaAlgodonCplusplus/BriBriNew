
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { getLevelProgress, LevelMode } from '../misc/progress';

interface StarsProgressProps {
  levelId?: number;
  mode?: LevelMode;
  size?: string;
  showAnimation?: boolean;
  showCount?: boolean;
  showSeparateTypes?: boolean;
}

const StarsProgress: React.FC<StarsProgressProps> = ({ 
  showCount = true,
  showSeparateTypes = false 
}) => {
  const [readCount, setReadCount] = useState<number>(0);
  const [listenCount, setListenCount] = useState<number>(0);
  const [totalStars, setTotalStars] = useState<number>(0);
  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    const loadProgress = async () => {
      const progress = await getLevelProgress();
      
      const readStarCount = progress.readLevels.length;
      const listenStarCount = progress.listenLevels.length;
      
      setReadCount(readStarCount);
      setListenCount(listenStarCount);
      setTotalStars(readStarCount + listenStarCount);
      setLoaded(true);
    };
    
    loadProgress();
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      {showSeparateTypes ? (
        <View style={styles.separateContainer}>
          <View style={styles.starTypeContainer}>
            <Image
              source={require('@/assets/images/star_read.png')}
              style={styles.starIcon}
              resizeMode="contain"
            />
            <Text style={styles.starCount}>{readCount}/7</Text>
          </View>
          <View style={styles.starTypeContainer}>
            <Image
              source={require('@/assets/images/star_listen.png')}
              style={styles.starIcon}
              resizeMode="contain"
            />
            <Text style={styles.starCount}>{listenCount}/7</Text>
          </View>
        </View>
      ) : (
        <View style={styles.totalContainer}>
          <Image
            source={require('@/assets/images/star_total.png')}
            style={styles.starIcon}
            resizeMode="contain"
          />
          {showCount && (
            <Text style={styles.starCount}>{totalStars}/{14}</Text>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  separateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: wp('20%'),
  },
  starTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  totalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  starIcon: {
    width: wp('5%'),
    height: hp('5%'),
  },
  starCount: {
    marginLeft: 5,
    fontWeight: 'bold',
    fontSize: hp('2%'),
    color: '#444',
  }
});

export default StarsProgress;