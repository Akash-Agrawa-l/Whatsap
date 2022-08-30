import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import fonts from '../../../utils/fonts'
import { vw } from '../../../utils/dimensions'
import CustomHeader from '../../../components/header'
import { colors } from '../../../utils/colors'

export function HomeScreen() {
  return (
    <View style={styles.mainContainer} >
      <CustomHeader/>
      <Text style={{fontFamily: fonts.BOLD,marginTop: vw(50),}}>HomeScreen</Text>
      <View style={styles.listContainer}></View>
    </View>
  )
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: colors.darkTheme.BACKGROUND,
    },
    listContainer: {
        height: vw(600),
        borderRadius: vw(40),
        backgroundColor: colors.darkTheme.CHILDBACKGROUND,
        marginTop: 'auto',
    },
})