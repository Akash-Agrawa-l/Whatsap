import {AppState, StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useSelector} from 'react-redux';
import firestore from '@react-native-firebase/firestore';

import screenNames from '../utils/screenNames';
import {LoginScreen} from '../modules/auth';
import Verification from '../modules/auth/screens/otp';
import {CreateProfile} from '../modules/profile';
import {SplashScreen} from '../modules/onboarding';
import {HomeScreen, Inbox} from '../modules/chatscreen';

const RootRouter = createNativeStackNavigator();

export default function RootRoute() {
  const {Auth_Data} = useSelector((store: any) => store.authReducer);
  let uid = Auth_Data?.uid;
  useEffect(() => {
    AppState.addEventListener('change', item => {
      console.log('App State', item);
      firestore()
        .collection('Users')
        .doc(uid)
        .update({
          isActive: item == 'active',
        })
        .then(resp => {
          console.log('response', resp);
        });
    });
  }, []);
  return (
    <NavigationContainer>
      <RootRouter.Navigator screenOptions={{headerShown: false}}>
        <RootRouter.Screen name={screenNames.SPLASH} component={SplashScreen} />
        <RootRouter.Screen
          name={screenNames.LOGIN_SCREEN}
          component={LoginScreen}
        />
        <RootRouter.Screen name={screenNames.VERIFY} component={Verification} />
        <RootRouter.Screen
          name={screenNames.CREATE_PROFILE}
          component={CreateProfile}
        />
        <RootRouter.Screen
          name={screenNames.HOME_SCREEN}
          component={HomeScreen}
        />
        <RootRouter.Screen name={screenNames.INBOX} component={Inbox} />
      </RootRouter.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({});
