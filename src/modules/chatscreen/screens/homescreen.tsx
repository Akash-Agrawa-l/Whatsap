import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import fonts from '../../../utils/fonts';
import {vw} from '../../../utils/dimensions';
import CustomHeader from '../../../components/header';
import {colors} from '../../../utils/colors';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import screenNames from '../../../utils/screenNames';
import {useDispatch, useSelector} from 'react-redux';
import localimages from '../../../utils/localimages';
import strings from '../../../utils/strings';

// @ts-ignore
export function HomeScreen({navigation}) {
  const {Auth_Data} = useSelector((store: any) => store.authReducer);
  const dispatch = useDispatch();
  let UserId = Auth_Data?.uid;
  const [allUsers, updateAllUsers] = useState([]);

  useEffect(() => {
    //   auth().signOut().then(()=>{
    //     dispatch({type: 'signIn', payload: {}});
    //     navigation.replace(screenNames.LOGIN_SCREEN)
    //   })
    firestore()
      .collection('Users')
      .where('uid', '!=', UserId)
      .get()
      .then((res: any) => {
        let users = res?._docs?.map((item: any) => {
          return item._data;
        });

        updateAllUsers(users);
      });
  }, []);

  useEffect(() => {
    firestore()
      .collection('chatrooms').where('uid' ,'array-contains',UserId)
      .get().then((resp)=>{console.log('chatroom resp',resp)})
  }, []);


  const keyEx = (item: any) => {
    return item?.uid;
  };

  const renderItem = ({item}: any) => {

    const navigateHandler = () => {
      navigation.navigate(screenNames.INBOX, {
        Name: item?.Name,
        UID: item?.uid,
        pic: item?.display,
        status: item?.isActive,
      });
    };

    return (
      <TouchableOpacity onPress={navigateHandler} style={styles.allUsersCard}>
        <View style={styles.shadowBox}>
          <Image
            source={
              item?.display ? {uri: item?.display} : localimages.PLACEHOLDER
            }
            style={styles.allUserImage}
          />
        </View>
        <View>
          <Text style={styles.allUsersNameText}>{item?.Name}</Text>
          <Text style={styles.allUsersAboutText}>{item?.About}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.mainContainer}>
      <CustomHeader />
      <Text
        style={styles.recentText}>
        {strings.RECENT}
      </Text>
      <View style={styles.recentUsers}></View>
      <View style={styles.listContainer}>
        <FlatList
          data={allUsers}
          renderItem={renderItem}
          keyExtractor={keyEx}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.darkTheme.BACKGROUND,
  },
  recentText: {
    fontFamily: fonts.REGULAR,
    marginLeft: vw(20),
    color: colors.WHITE_60,
    letterSpacing: vw(3),
    fontSize: vw(12),
    lineHeight: vw(13),
  },
  recentUsers: {
      height: vw(105),
    //   borderWidth: 1,
  },
  listContainer: {
    height: vw(600),
    borderRadius: vw(40),
    backgroundColor: colors.darkTheme.CHILDBACKGROUND,
    padding: vw(30),
  },
  allUsersCard: {
    flexDirection: 'row',
    height: vw(50),
    alignItems: 'center',
    marginVertical: vw(5),
  },
  allUsersNameText: {
    fontFamily: fonts.SEMIBOLD,
    color: colors.WHITE,
    fontSize: vw(14),
  },
  allUsersAboutText: {
    fontFamily: fonts.REGULAR,
    color: colors.WHITE_60,
  },
  allUserImage: {
    height: vw(40),
    width: vw(40),
    borderRadius: vw(30),
    marginRight: vw(10),
    backgroundColor: colors.darkTheme.BACKGROUND,
  },
  shadowBox: {
    shadowColor: colors.BLACK,
    shadowOffset: {
      width: 4,
      height: 6,
    },
    shadowOpacity: 0.29,
    shadowRadius: 3.65,
    elevation: 7,
  },
});
