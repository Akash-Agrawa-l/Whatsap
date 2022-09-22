import {Animated, StyleSheet, Text, View} from 'react-native';
import React, {useRef, useEffect, useState} from 'react';
import {colors} from '../utils/colors';
import {vw} from '../utils/dimensions';

interface timeLineProps {
  index?: any;
  length?: any;
}

export default function TimeLine({
  index,
  length,
}: timeLineProps) {
  const timeLine = useRef(new Animated.Value(0)).current;

  const width = 375 / (length * 1.04);

  useEffect(() => {
        Animated.timing(timeLine, {
          toValue: 1,
          delay: 600 + (3000 * index),
          duration: 3000,
          useNativeDriver: true,
        }).start();
  }, []);

  return (
    <View
      style={[
        {
          backgroundColor: colors.WHITE_30,
          height: vw(3),
          width: vw(width),
          marginHorizontal: vw(2),
          borderRadius: vw(4),
          overflow: 'hidden',
        },
      ]}>
      <Animated.View
        style={[
          {
            backgroundColor: colors.WHITE,
            height: vw(3),
            width: vw(width),
            borderRadius: vw(4),
          },
          {
            transform: [
              {
                translateX: timeLine.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-vw(width), 0],
                }),
              },
            ],
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({});
