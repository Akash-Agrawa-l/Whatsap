import {StyleSheet, Text, TextInput, View} from 'react-native';
import React from 'react';
import {vw} from '../utils/dimensions';
import { colors } from '../utils/colors';

interface otpProps {
  onChangeText?: any;
}

export default function OtpInput(props: otpProps) {
  return (
    <TextInput
      autoCorrect={false}
      maxLength={6}
      keyboardType="numeric"
      autoFocus={true}
      onChangeText={props.onChangeText}
      caretHidden={true}
      style={styles.otpInputStyle}
    />
  );
}

const styles = StyleSheet.create({
  otpInputStyle: {
    width: vw(200),
    fontSize: vw(18),
    letterSpacing: vw(20),
    paddingVertical: vw(5),
    paddingLeft: vw(9),
    color: colors.WHITE,
    // borderWidth: 1,
    // borderRadius: vw(8),
    // borderColor: colors.darkTheme.TEXT,
  },
});
