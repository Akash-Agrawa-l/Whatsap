import {
  Animated,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useRef, useState} from 'react';
import {colors} from '../utils/colors';
import {vw} from '../utils/dimensions';
import localimages from '../utils/localimages';
import fonts from '../utils/fonts';
import strings from '../utils/strings';

export default function AddButton() {
  const animatePlus = useRef(new Animated.Value(0)).current;
  const [selected, setSelected] = useState(false);

  const rotateStyle = {
    transform: [
      {
        rotate: animatePlus.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '135deg'],
        }),
      },
    ],
  };

  const animateOptions = {
    transform: [
      {
        scale: animatePlus.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1],
        }),
      },
      {
        translateY: vw(-70),
      },
    ],
  };

  const onAddPress = () => {
    if (!selected)
      Animated.timing(animatePlus, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start(({finished}) => {
        if (finished) setSelected(true);
      });
    else {
      Animated.timing(animatePlus, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(({finished}) => {
        if (finished) setSelected(false);
      });
    }
  };

  return (
    <Animated.View style={styles.mainContainer}>
      <Animated.View style={[styles.optionsContainer, animateOptions]}>
        <TouchableOpacity style={styles.bubble}>
          <Image source={localimages.STORY} style={styles.bubbleIcon} />
          <Text style={styles.bubbleText}>{strings.STATUS}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bubble}>
          <Image source={localimages.CHAT} style={styles.bubbleIcon} />
          <Text style={styles.bubbleText}>{strings.NEW_CHAT}</Text>
        </TouchableOpacity>
      </Animated.View>
      <TouchableOpacity
        activeOpacity={1}
        onPress={onAddPress}
        style={styles.addButton}>
        <Animated.Image
          source={localimages.ADD}
          style={[styles.addIcon, rotateStyle]}
        />
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    position: 'absolute',
    bottom: vw(40),
    right: vw(30),
  },
  addButton: {
    alignSelf: 'flex-end',
    justifyContent: 'center',
    alignItems: 'center',
    height: vw(50),
    width: vw(50),
    borderRadius: vw(30),
    backgroundColor: colors.darkTheme.BACKGROUND,
    shadowColor: colors.BLACK,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.85,
    shadowRadius: 4.14,
    elevation: 5,
  },
  addIcon: {
    height: vw(35),
    width: vw(35),
  },
  optionsContainer: {
    alignItems: 'flex-end',
    position: 'absolute',
    width: vw(90),
    right: vw(1),
  },
  bubble: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 'auto',
    width: 'auto',
    padding: vw(5),
    paddingHorizontal: vw(10),
    marginBottom: vw(8),
    marginRight: 0,
    borderRadius: vw(20),
    backgroundColor: colors.darkTheme.BACKGROUND,
  },
  bubbleText: {
    fontFamily: fonts.REGULAR,
    color: colors.WHITE,
    fontSize: vw(12),
  },
  bubbleIcon: {
    height: vw(15),
    width: vw(15),
    marginRight: vw(5),
  },
});
