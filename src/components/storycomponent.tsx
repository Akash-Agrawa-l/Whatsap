import {Animated, Image, Modal, SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import localimages from '../utils/localimages';
import {vw} from '../utils/dimensions';
import {colors} from '../utils/colors';

export default function Story() {
  return (
    <View style={{}} >
      <TouchableOpacity style={styles.profileHolder}>
        <Image source={localimages.PLACEHOLDER} style={styles.initialImage} />
      </TouchableOpacity>
      {/* <Modal transparent={true} >
          <SafeAreaView style={{flex: 1,}}>
          <View style={{flex: 1,borderWidth: 5,borderColor: 'red',}}></View>
          </SafeAreaView>

      </Modal> */}
    </View>
  );
}

const styles = StyleSheet.create({
  profileHolder: {
    height: vw(80),
    width: vw(80),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: vw(40),
    borderWidth: vw(2),
    borderColor: colors.WHITE_60,
  },
  initialImage: {
    height: vw(70),
    width: vw(70),
    borderRadius: vw(40),
    borderWidth: vw(1),
    borderColor: colors.WHITE,
  },
});
