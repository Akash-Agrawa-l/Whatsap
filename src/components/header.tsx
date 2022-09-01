import {
  Animated,
  Image,
  NativeModules,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {colors} from '../utils/colors';
import fonts from '../utils/fonts';
import {DesignWidth, normalize, screenWidth, vh, vw} from '../utils/dimensions';
import localimages from '../utils/localimages';
import strings from '../utils/strings';
import {useNavigation, useRoute} from '@react-navigation/native';
import screenNames from '../utils/screenNames';

interface headerProps {
  name?: string;
  logout?: any;
}

export default function CustomHeader({name, logout}: headerProps) {
  const navigation = useNavigation();
  const route = useRoute();
  const animation = useState(new Animated.Value(0))[0];
  const height = parseInt( StatusBar.currentHeight)
  console.log(StatusBar.currentHeight)

  const toggleStyle = {
    transform: [
      {
        translateX: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [vw(-350), vw(-312)],
          //   extrapolate: 'clamp',
        }),
      },
      {
        scale: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1],
        }),
      },
    ],
    zIndex: animation.interpolate({
        inputRange: [0,1],
        outputRange: [-1,1],
    }),
  };

  const handleRipple = () => {
    console.log('toggle');
    Animated.timing(animation, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  };
  const closeSearch = () => {
    Animated.timing(animation, {
      toValue: 0,
      duration: 400,
      useNativeDriver: true,
    }).start();
  };

  return (
    <SafeAreaView>
      {route.name != screenNames.PROFILE ? (
        <View style={[styles.mainContainer,{marginTop: Platform.OS == 'android' ? vw(height) : 0,}]}>
          <Text style={styles.headerText}>{strings.MESSAGES}</Text>
          <TouchableOpacity onPress={handleRipple}>
            <Image source={localimages.SEARCH} style={styles.searchImage} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              // @ts-ignore
              navigation.navigate(screenNames.PROFILE);
            }}>
            <Image source={localimages.MENU} style={styles.menuImage} />
          </TouchableOpacity>
          <Animated.View style={[styles.searchBarMainContainer, toggleStyle]}>
            <View style={styles.searchBarContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder={strings.SEARCH}
                placeholderTextColor={colors.WHITE_30}
                autoCorrect={false}
                autoComplete="off"
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={closeSearch}>
                <Text style={styles.cancelText}> {strings.CANCEL} </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      ) : (
        <View style={[styles.mainContainer, {marginTop: vh(StatusBarManager.HEIGHT),}]}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={localimages.GOBACK} style={styles.backButton} />
          </TouchableOpacity>
          <Text style={styles.headerText}>{name}</Text>
          {logout ? (
            <TouchableOpacity onPress={logout} style={styles.logoutButton}>
              <Text style={styles.logoutText}>{strings.LOGOUT}</Text>
              <Image source={localimages.LOGOUT} style={styles.logoutImage} />
            </TouchableOpacity>
          ) : null}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: colors.darkTheme.BACKGROUND,
    flexDirection: 'row',
    alignItems: 'center',
    height: vw(45),
    marginTop: normalize(150),
    paddingHorizontal: vw(20),
    overflow: 'hidden',
    width: vw(DesignWidth),
    zIndex: 1,
    elevation: 2,
  },
  headerText: {
    fontFamily: fonts.SEMIBOLD,
    color: colors.WHITE,
    fontSize: vw(20),
    width: vw(240),
  },
  searchImage: {
    height: vw(24),
    width: vw(24),
    marginLeft: vw(30),
    marginRight: vw(15),
  },
  menuImage: {
    height: vw(24),
    width: vw(24),
  },
  searchBarMainContainer: {
    backgroundColor: colors.darkTheme.CHILDBACKGROUND,
    position: 'absolute',
    height: vw(685),
    width: vw(685),
    left: vw(310),
    borderRadius: vw(400),
    alignItems: 'center',
    justifyContent: 'center',
    elevation: Platform.OS == 'android' ? 1 : 0,
  },
  searchBarContainer: {
    backgroundColor: colors.darkTheme.CHILDBACKGROUND,
    height: vw(45),
    width: screenWidth,
    transform: [{translateX: vw(-154)}],
    flexDirection: 'row',
    alignItems: 'center',
    elevation: Platform.OS == 'android' ? 1 : 0,
  },
  searchInput: {
    width: vw(300),
    height: vw(45),
    padding: vw(5),
    marginLeft: vw(10),
    borderWidth: 0,
    backgroundColor: colors.darkTheme.CHILDBACKGROUND,
    color: colors.WHITE,
    fontSize: vw(15),
    fontFamily: fonts.REGULAR,
    elevation: Platform.OS == 'android' ? 1 : 0,
  },
  cancelText: {
    fontFamily: fonts.SEMIBOLD,
    color: colors.WHITE,
    fontSize: vw(15),
    elevation: Platform.OS == 'android' ? 1 : 0,
  },
  backButton: {
    height: vw(20),
    width: vw(20),
    marginRight: vw(10),
  },
  logoutImage: {
    height: vw(13),
    width: vw(13),
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: vw(70),
  },
  logoutText: {
    fontFamily: fonts.REGULAR,
    color: colors.WHITE,
    fontSize: vw(14),
  },
});
