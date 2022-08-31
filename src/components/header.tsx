import {
  Animated,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {colors} from '../utils/colors';
import fonts from '../utils/fonts';
import {screenWidth, vw} from '../utils/dimensions';
import localimages from '../utils/localimages';
import strings from '../utils/strings';

export default function CustomHeader() {
  const [searchVisible, toggleSearch] = useState(false);
  const animation = useState(new Animated.Value(0))[0];

  const toggleStyle = {
    transform: [
      {translateX: vw(-340)},
      {
        scale: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1],
        }),
      },
    ],
  };

  const handleRipple = () => {
    Animated.timing(animation, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start(({finished})=>{
        toggleSearch(true)
    });
  };
  const closeSearch = () => {
    Animated.timing(animation, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  return (
    <SafeAreaView>
      <View style={styles.mainContainer}>
        <Text style={styles.headerText}>{strings.MESSAGES}</Text>
        <TouchableOpacity onPress={handleRipple}>
          <Image source={localimages.SEARCH} style={styles.searchImage} />
        </TouchableOpacity>
        <Animated.View
          style={[
            styles.searchBarMainContainer, toggleStyle
          ]}>
              <View style={styles.searchBarContainer}>
                  <TextInput
                  style={styles.searchInput}
                  placeholder={strings.SEARCH}
                  placeholderTextColor={colors.WHITE_30}
                  autoFocus={searchVisible}
                  autoCorrect={false}
                  autoComplete='off'
                  autoCapitalize='none'
                  />
              <TouchableOpacity onPress={closeSearch}>
                  <Text style={styles.cancelText}> {strings.CANCEL} </Text>
              </TouchableOpacity>
              </View>
          </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: colors.darkTheme.BACKGROUND,
    flexDirection: 'row',
    alignItems: 'center',
    height: vw(45),
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  headerText: {
    fontFamily: fonts.SEMIBOLD,
    color: colors.WHITE,
    fontSize: vw(20),
    marginLeft: vw(20),
  },
  searchImage: {
    height: vw(24),
    width: vw(24),
    marginRight: vw(20),
  },
  searchBarMainContainer: {
    backgroundColor: colors.darkTheme.CHILDBACKGROUND,
    position: 'absolute',
    height: vw(685),
    width: vw(685),
    left: vw(338),
    borderRadius: vw(400),
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBarContainer: {
      backgroundColor: colors.darkTheme.CHILDBACKGROUND,
      height: vw(45),
      width: screenWidth,
      transform: [{translateX: vw(-154),}],
      flexDirection: 'row',
      alignItems: 'center',
  },
  searchInput: {
      width: vw(300),
      height: vw(45),
      padding: vw(5),
      marginLeft: vw(10),
      color: colors.WHITE,
      fontSize: vw(15),
      fontFamily: fonts.REGULAR,
  },
  cancelText: {
      fontFamily: fonts.SEMIBOLD,
      color: colors.WHITE,
      fontSize: vw(15),
  },
});
