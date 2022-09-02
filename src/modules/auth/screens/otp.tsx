import {
  Animated,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {useRoute} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import firestore from '@react-native-firebase/firestore';

import {colors} from '../../../utils/colors';
import strings from '../../../utils/strings';
import {vh, vw} from '../../../utils/dimensions';
import OtpInput from '../../../components/otpinput';
import screenNames from '../../../utils/screenNames';

interface routeProps {
  key: string;
  name: string;
  params: {
    phoneNumber: string;
    confirm: any;
  };
  path: any;
}

export default function Verification({navigation}: any) {
  const route: routeProps = useRoute();
  const {phoneNumber, confirm} = route.params;
  console.log('confirm', confirm);

  const [otp, setotp] = useState('');
  const dispatch = useDispatch();

  const onChangeText = (text: string) => {
    setotp(text);
  };

  const onSubmit = async () => {
    try {
      await confirm.confirm(otp).then((resp: any) => {
        console.log('onSubmit response', resp);
        dispatch({type: 'signIn', payload: resp?.user?._user});
        {
          resp?.additionalUserInfo?.isNewUser
            ? navigation.replace(screenNames.CREATE_PROFILE, {
                details: resp?.user?._user,
              })
            : firestore()
                .collection('Users')
                .where('uid', '==', resp?.user?._user.uid)
                .get()
                .then((res: any) => {
                  let users = res?._docs?.map((item: any) => {
                    return item._data;
                  });
                  dispatch({type: 'Set_Data', payload: users[0]});
                });
          navigation.replace(screenNames.HOME_SCREEN);
        }
      });
    } catch (error) {
      console.log('error', error);
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
      <Animated.View style={[styles.childContainer]}>
        <Text style={styles.headerText}>{strings.VERIFY}</Text>
        <Text style={styles.subHeadText}>{strings.OTP_SENT + phoneNumber}</Text>

        <OtpInput onChangeText={onChangeText} />
        <Text style={styles.otpNotRecieved}>
          {strings.NOT_RECIEVED}
          <Text style={styles.resendOtp}>{strings.RESEND}</Text>
        </Text>

        <TouchableOpacity onPress={onSubmit} style={styles.submitButton}>
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
    paddingHorizontal: vw(20),
    alignItems: 'center',
    alignSelf: 'center',
    width: vw(350),
    paddingVertical: vw(40),
    height: vh(280),
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
    fontWeight: '600',
    alignSelf: 'center',
  },
  subHeadText: {
    fontSize: vw(12),
    color: colors.darkTheme.TEXT,
    alignSelf: 'center',
    marginVertical: vw(10),
  },
  otpNotRecieved: {
    marginTop: vw(10),
    width: vw(280),
    color: colors.darkTheme.TEXT,
    fontSize: vw(12),
  },
  resendOtp: {
    textAlign: 'right',
    color: colors.darkTheme.TEXT,
    fontSize: vw(12),
  },
  submitButton: {
    backgroundColor: colors.darkTheme.BACKGROUND,
    height: vw(40),
    width: vw(140),
    borderRadius: vw(10),
    borderWidth: vw(2),
    borderColor: colors.BLACK_10,
    marginTop: vw(10),
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonText: {
    color: colors.darkTheme.TEXT,
    fontSize: vw(16),
  },
});
