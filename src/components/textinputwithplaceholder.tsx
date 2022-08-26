import {StyleSheet, Text, TextInput, View} from 'react-native';
import React from 'react';
import {colors} from '../utils/colors';
import {vw} from '../utils/dimensions';
import strings from '../utils/strings';

interface inputProps {
  onChangeText?: Function|any;
  value?: string;
  isPassword?: boolean;
  placeholder: string;
  contentContainerStyle?: Object;
  placeholderStyle?: Object;
  inputStyle?: Object;
  hasShadow?: boolean;
  autofocus: boolean;
  isPhoneNumber?: boolean;
  maxlength?: number,
}

export default function TextInputWithPlaceholder(props: inputProps) {
  return (
    <View
      style={
        props?.hasShadow
          ? [styles.containerStyle, styles.shadow, props.contentContainerStyle]
          : [styles.containerStyle, props.contentContainerStyle]
      }>
      <Text style={[styles.placeholderText, props.placeholderStyle]}>
        {props.placeholder}
      </Text>
      {props.isPhoneNumber ? (
        <Text style={styles.countryCodeText}>{strings.COUNTRY_CODE}</Text>
      ) : null}
      <TextInput
        autoFocus={props.autofocus}
        style={[styles.inputStyle, props.inputStyle]}
        maxLength={props.isPhoneNumber ? 10 : props.maxlength}
        returnKeyType='next'
        autoCapitalize='none'
        autoCorrect={false}
        autoComplete='off'
        onEndEditing={(text)=>console.log("hello",text)}
        keyboardType={ props.isPhoneNumber ? 'numeric' : 'default' }
        onChangeText={props.onChangeText}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    flexDirection: 'row',
    backgroundColor: colors.lightTheme.BACKGROUND,
    width: vw(335),
    padding: vw(10),
    borderRadius: vw(10),
    marginVertical: vw(10),
    alignItems: 'center',
  },
  shadow: {
    shadowColor: colors.BLACK_70,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 1,
    shadowRadius: 3.0,
    elevation: 6,
  },
  placeholderText: {
    fontSize: vw(15),
    marginRight: vw(5),
    fontWeight: '500',
    width: vw(120),
    color: colors.BLACK,
  },
  countryCodeText: {
    fontSize: vw(15),
    marginRight: vw(5),
    fontWeight: '500',
    color: colors.BLACK_70,
  },
  inputStyle: {
    fontSize: vw(15),
    width: vw(150),
    paddingVertical: vw(3),
  },
});
