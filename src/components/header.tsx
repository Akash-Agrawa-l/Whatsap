import {Image, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {colors} from '../utils/colors';
import fonts from '../utils/fonts';
import {vw} from '../utils/dimensions';
import localimages from '../utils/localimages';
import strings from '../utils/strings';

export default function CustomHeader() {
  return (
    <SafeAreaView>
      <View style={styles.mainContainer}>
        <Text style={styles.headerText}>{strings.MESSAGES}</Text>
        <Image source={localimages.SEARCH} style={styles.searchImage} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: colors.darkTheme.BACKGROUND,
    flexDirection: 'row',
    justifyContent: 'space-between',
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
});
