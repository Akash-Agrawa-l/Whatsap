import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import {NavigationContainer} from '@react-navigation/native'
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import screenNames from '../utils/screenNames';
import { LoginScreen } from '../modules/auth';
import Verification from '../modules/auth/screens/otp';

const RootRouter = createNativeStackNavigator();

export default function RootRoute() {
  return (
      <NavigationContainer>
          <RootRouter.Navigator screenOptions={{headerShown: false,}}>
              <RootRouter.Screen name={screenNames.LOGIN_SCREEN} component={LoginScreen} />
              <RootRouter.Screen name={screenNames.VERIFY} component={Verification} />

          </RootRouter.Navigator>
      </NavigationContainer>
  )
}

const styles = StyleSheet.create({})