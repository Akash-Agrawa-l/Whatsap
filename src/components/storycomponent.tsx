import {
  Animated,
  FlatList,
  Image,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState, useRef, useEffect} from 'react';
import localimages from '../utils/localimages';
import {DesignWidth, vw} from '../utils/dimensions';
import {colors} from '../utils/colors';
import Video from 'react-native-video';

export default function Story() {
  const [isVisible, setVisible] = useState(false);
  const timeLine = useRef(new Animated.Value(0)).current;

  const storyArray = [
    {
      id: 1,
      source: localimages.LANDING_BG,
      type: 'image',
    },
  ];

  const width = DesignWidth / (storyArray.length * 1.02);

  useEffect(() => {
    if (isVisible) {
      Animated.timing(timeLine, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      }).start(({finished})=>{
        setVisible(false)
      })
    }else{
      Animated.timing(timeLine, {
        toValue: 0,
        duration: 30,
        useNativeDriver: true,
      }).start()
    }
  }, [isVisible]);

  // @ts-ignore
  const renderItem = ({item, index}) => {
    if (!isVisible) {
      Animated.timing(timeLine, {
        toValue: 1,
        delay: 1000,
        duration: 4000,
        useNativeDriver: true,
      }).start(({finished})=>{
        setVisible(false)
      })
    }
    return (
      <View>
      <View
        style={[
          {
            backgroundColor: colors.WHITE_30,
            height: vw(3),
            width: vw(width),
            marginHorizontal: vw(2),
            borderRadius: vw(4),
            overflow: 'hidden',
          },
        ]}>
        <Animated.View
          key={item.id}
          style={[
            {
              backgroundColor: colors.WHITE,
              height: vw(3),
              width: vw(width),
              borderRadius: vw(4),
            },
            {
              transform: [
                {
                  translateX: timeLine.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-vw(width), 0],
                  }),
                },
              ],
            },
          ]}
        />
      </View>
      <Image source={item.source} />
      </View>
    );
  };

  return (
    <View style={{flexDirection: 'row'}}>
      <TouchableOpacity
        style={styles.profileHolder}
        onPress={() => {
          setVisible(true);
        }}>
        <Image source={localimages.PLACEHOLDER} style={styles.initialImage} />
      </TouchableOpacity>
      {/* <Video
        source={require('../assets/images/vid.mp4')}
        controls={true}
        muted={false}
        style={{height: 100, width: 140}}
        resizeMode={'cover'}
      /> */}
      <Modal transparent={true} visible={isVisible} animationType="slide">
        <TouchableOpacity
          style={{flex: 1}}
          onPress={() => setVisible(false)}>
          <SafeAreaView style={{flex: 1}}>
              <FlatList data={storyArray} renderItem={renderItem} horizontal />
          </SafeAreaView>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  profileHolder: {
    height: vw(80),
    width: vw(80),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: vw(40),
    borderWidth: vw(2),
    borderColor: colors.WHITE_60,
    marginLeft: vw(15),
  },
  initialImage: {
    height: vw(70),
    width: vw(70),
    borderRadius: vw(40),
    borderWidth: vw(1),
    borderColor: colors.WHITE,
  },
});
