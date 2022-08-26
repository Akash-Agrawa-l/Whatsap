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
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {normalize, screenWidth, vh, vw} from '../../../utils/dimensions';
import auth from '@react-native-firebase/auth';
import {colors} from '../../../utils/colors';
import strings from '../../../utils/strings';
import TextInputWithPlaceholder from '../../../components/textinputwithplaceholder';
import screenNames from '../../../utils/screenNames';

// @ts-ignore
export function LoginScreen({navigation}) {
  const [number, setnumber] = useState('');
  let focus = false
  const [otp, setotp]: any = useState(null);
  const slide: any = useState(new Animated.Value(0))[0];

  const slideStyle = {
    transform: [
      {
        translateY: slide.interpolate({
          inputRange: [0, 50,100],
          outputRange: [vh(680), vh(340),0],
          extrapolate: 'clamp',
        }),
      },
    ],
  };

  useEffect(() => {
    Animated.timing(slide, {
      toValue: 100,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  const changeText=(text:string)=>{
    setnumber(text)
  }

  // useEffect(() => {
  //   console.log(otp);
  //   verifyOTP();
  // }, [otp]);

  const submitHandler = async () => {
    const confirm: any = await auth().signInWithPhoneNumber(
      `+91${number}`,
      false,
    );
    navigation.navigate(screenNames.VERIFY,{phoneNumber: `+91${number}`,confirm: confirm})
    setotp(confirm);
  };
  const verifyOTP = async () => {
    try {
      //   @ts-ignore
      await otp.confirm('123456').then(resp => console.log(resp));
      console.log('sdfghj');
    } catch {
      console.log('error');
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
          autofocus={focus}
          placeholder={strings.PHONE_NUMBER}
          isPhoneNumber={true}
          hasShadow={true}
          onChangeText={changeText}
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
  },
  childContainer: {
    backgroundColor: colors.darkTheme.CHILDBACKGROUND,
    paddingHorizontal: vw(20),
    // alignItems: 'center',
    paddingVertical: vw(40),
    marginTop: 'auto',
    height: vh(680),
    borderTopEndRadius: vw(45),
    borderTopStartRadius: vw(45),
    shadowColor: colors.BLACK,
    shadowOffset: {
      width: 0,
      height: Platform.OS === 'android' ? 0 : -6,
    },
    shadowOpacity: Platform.OS === 'android' ? 1 : 0.1,
    shadowRadius: Platform.OS === 'android' ? 15 : 3.0,
    elevation: 2,
  },
  headerText: {
    fontSize: vw(23),
    color: colors.darkTheme.TEXT,
    fontWeight: '600',
    alignSelf: 'center',
  },
  subHeadText: {
    fontSize: vw(13),
    color: colors.darkTheme.TEXT,
    alignSelf: 'center',
    marginVertical: vw(10),
  },
  submitButton: {
    backgroundColor: colors.darkTheme.BACKGROUND,
    height: vw(40),
    width: vw(100),
    borderRadius: vw(8),
    borderWidth: vw(2),
    borderColor: colors.BLACK_10,
    marginTop: vw(30),
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonText: {
    color: colors.darkTheme.TEXT,
    fontSize: vw(16),
  },
});
