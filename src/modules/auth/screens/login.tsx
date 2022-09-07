import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  View,
  Animated,
  Platform,
  Keyboard,
  ImageBackground,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {normalize, screenWidth, vh, vw} from '../../../utils/dimensions';
import auth from '@react-native-firebase/auth';
import {colors} from '../../../utils/colors';
import strings from '../../../utils/strings';
import TextInputWithPlaceholder from '../../../components/textinputwithplaceholder';
import screenNames from '../../../utils/screenNames';
import fonts from '../../../utils/fonts';

// @ts-ignore
export function LoginScreen({navigation}) {
  const [number, setnumber] = useState('');
  const slide: any = useState(new Animated.Value(0))[0];

  const slideStyle = {
    transform: [
      {
        translateY: slide.interpolate({
          inputRange: [0, 50, 100],
          outputRange: [vh(680), vh(340), 0],
          extrapolate: 'clamp',
        }),
      },
    ],
  };

  console.log(number);

  useEffect(() => {
    Animated.timing(slide, {
      toValue: 100,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  const changeText = (text: string) => {
    setnumber(text);
  };

  const submitHandler = async () => {
    try {
      let confirm: any = await auth()
        .signInWithPhoneNumber(`+91${number}`, false)
        .then((resp) => {
          console.log('resp',resp);
          navigation.replace(screenNames.VERIFY, {
            phoneNumber: `+91${number}`,
            confirm: resp,
          });
        })
        .catch(error => {
          console.log('error', error);
        });
      // navigation.replace(screenNames.VERIFY, {
      //   phoneNumber: `+91${number}`,
      //   confirm: confirm,
      // });
      
    } catch {
      console.log('Error Occured');
    }
  };

  return (
    <View style={styles.mainContainer}>
      <StatusBar
        translucent={false}
        showHideTransition={'slide'}
        networkActivityIndicatorVisible={true}
        backgroundColor={colors.darkTheme.BACKGROUND}
      />
      <Animated.View style={[styles.childContainer, slideStyle]}>
        <Text style={styles.headerText}>{strings.LOGIN}</Text>
        <Text style={styles.subHeadText}>{strings.ENTER_NUMBER}</Text>
        <TextInputWithPlaceholder
          autofocus={false}
          placeholder={strings.PHONE_NUMBER}
          isPhoneNumber={true}
          hasShadow={true}
          onChangeText={changeText}
          contentContainerStyle={styles.inputContainerStyle}
        />
        <TouchableOpacity onPress={submitHandler} style={styles.submitButton}>
          <Text style={styles.submitButtonText}>{strings.SUBMIT}</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.darkTheme.BACKGROUND,
    justifyContent: 'center',
  },
  childContainer: {
    backgroundColor: colors.darkTheme.CHILDBACKGROUND,
    alignSelf: 'center',
    width: vw(350),
    // alignItems: 'center',
    paddingVertical: vw(40),
    // marginTop: 'auto',
    height: vw(280),
    borderRadius: vw(40),
    shadowColor: colors.BLACK,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 5.5,
    elevation: 2,
  },
  headerText: {
    fontSize: vw(23),
    color: colors.darkTheme.TEXT,
    fontFamily: fonts.SEMIBOLD,
    alignSelf: 'center',
  },
  subHeadText: {
    fontSize: vw(13),
    color: colors.darkTheme.TEXT,
    fontFamily: fonts.REGULAR,
    alignSelf: 'center',
    marginVertical: vw(10),
  },
  submitButton: {
    backgroundColor: colors.darkTheme.BACKGROUND,
    height: vw(40),
    width: vw(140),
    borderRadius: vw(10),
    borderWidth: vw(2),
    borderColor: colors.BLACK_10,
    marginTop: vw(30),
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonText: {
    color: colors.darkTheme.TEXT,
    fontFamily: fonts.REGULAR,
    lineHeight: vw(20),
    fontSize: vw(16),
  },
  inputContainerStyle: {
    alignSelf: 'center',
  },
});
