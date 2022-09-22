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
import React, {useState, useCallback, useMemo} from 'react';
import Video from 'react-native-video';
import localimages from '../utils/localimages';
import {vw} from '../utils/dimensions';
import {colors} from '../utils/colors';
import TimeLine from './timeLine';

export default function Story() {
  const [isVisible, setVisible] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);

  const storyArray = [
    {
      id: 1,
      source: localimages.LANDING_BG,
      type: 'image',
    },
    {
      id: 2,
      source: localimages.PLACEHOLDER,
      type: 'image',
    },
    {
      id: 3,
      source: require('../assets/images/vid.mp4'),
      type: 'video',
    },
  ];

  const timeout = 3000 * storyArray.length + 600;

  console.log(storyArray[imageIndex]?.id);

  // @ts-ignore
  const renderItem = ({item, index}) => {
    setTimeout(() => {
      setVisible(false);
      setImageIndex(0);
    }, timeout);
    setTimeout(() => {
      setImageIndex(imageIndex + 1);
    }, 3500);
    return <TimeLine index={index} length={storyArray.length} />;
  };

  return (
    <View style={{flexDirection: 'row'}}>
      <TouchableOpacity
        style={styles.profileHolder}
        onPress={() => {
          setVisible(true);
          setImageIndex(0);
        }}>
        <Image source={localimages.PLACEHOLDER} style={styles.initialImage} />
      </TouchableOpacity>
      <Modal transparent={true} visible={isVisible} animationType="slide">
        <TouchableOpacity
          style={{flex: 1, alignItems: 'center', backgroundColor: colors.BLACK}}
          onPress={() => setVisible(false)}>
          <SafeAreaView style={{flex: 1}}>
            <FlatList data={storyArray} renderItem={renderItem} horizontal />
            {storyArray[imageIndex]?.type == 'image' ? (
              <Image
                source={storyArray[imageIndex]?.source}
                style={{height: vw(720), width: vw(375)}}
              />
            ) : (
              <Video
                source={storyArray[imageIndex]?.source}
                // controls={true}
                // muted={false}
                style={{height: vw(720), width: vw(375)}}
                resizeMode={'cover'}
              />
            )}
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
