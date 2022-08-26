import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useRoute } from '@react-navigation/native'

export default function Verification() {
    const route = useRoute()
    console.log('items',route.params)
  return (
    <View>
      <Text>Verification</Text>
    </View>
  )
}

const styles = StyleSheet.create({})