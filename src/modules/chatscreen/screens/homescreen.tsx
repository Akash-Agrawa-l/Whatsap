import {
  Animated,
  FlatList,
  Image,
  ImageBackground,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import fonts from '../../../utils/fonts';
import {
  DesignHeight,
  DesignWidth,
  screenHeight,
  vh,
  vw,
} from '../../../utils/dimensions';
import CustomHeader from '../../../components/header';
import {colors} from '../../../utils/colors';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import screenNames from '../../../utils/screenNames';
import {useDispatch, useSelector} from 'react-redux';
import localimages from '../../../utils/localimages';
import strings from '../../../utils/strings';
import {BlurView} from '@react-native-community/blur';
import AddButton from '../../../components/addbutton';
import Story from '../../../components/storycomponent';

// @ts-ignore
export function HomeScreen({navigation}) {
  const {Auth_Data} = useSelector((store: any) => store.authReducer);
  let UserId = Auth_Data?.uid;
  const dispatch = useDispatch();
  const [allUsers, updateAllUsers] = useState([]);
  const [previewImage, toggleImage] = useState(null);
  const preview = useState(new Animated.Value(0))[0];

  const animation = {
    transform: [
      {
        scale: preview.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1.03],
        }),
      },
    ],
  };

  useEffect(() => {
    // firestore()
    //   .collection('Users')
    //   .where('uid', '!=', UserId)
    //   .get()
    //   .then((res: any) => {
    //     let users = res?._docs?.map((item: any) => {
    //       return item._data;
    //     });

    //     updateAllUsers(users);
    //   });
    firestore()
      .collection('Users')
      .doc(UserId).collection('Inbox')
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
      .collection('chatrooms')
      .where('uid', 'array-contains', UserId)
      .get()
      .then(resp => {
        console.log('chatroom resp', resp);
      });
  }, []);

  const keyEx = (item: any) => {
    return item?.uid;
  };

  const onBackPress = () => {
    Animated.timing(preview, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
    toggleImage(null);
  };

  const renderItem = ({item}: any) => {
    const navigateHandler = () => {
      navigation.navigate(screenNames.INBOX, {
        Name: item?.Name,
        UID: item?.uid,
        pic: item?.display,
        status: item?.isActive,
        bio: item?.About,
      });
    };

    const openImage = () => {
      toggleImage(item?.display ? item?.display : localimages.PLACEHOLDER);
      Animated.timing(preview, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    };

    return (
      <TouchableOpacity onPress={navigateHandler} style={styles.allUsersCard}>
        <TouchableOpacity style={styles.shadowBox} onPress={openImage}>
          <Image
            source={
              item?.display.includes('cloudinary') ? {uri: item?.display} : localimages.PLACEHOLDER
            }
            style={styles.allUserImage}
          />
        </TouchableOpacity>
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
      <Text style={styles.recentText}>{strings.RECENT}</Text>
      <View style={styles.recentUsers}>
        <Story/>
      </View>
      <View style={styles.listContainer}>
        <FlatList
          data={allUsers}
          renderItem={renderItem}
          keyExtractor={keyEx}
        />
        <AddButton/>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.darkTheme.BACKGROUND,
    justifyContent: 'center',
    overflow: 'hidden',
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
    justifyContent: 'center',
  },
  listContainer: {
    height: Platform.OS == 'ios' ? vh(620) : vw(620),
    borderTopLeftRadius: vw(40),
    borderTopRightRadius: vw(40),
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
  blurContainer: {
    height: vw(812),
    width: vw(375),
  },
  backHeader: {
    zIndex: 2,
    height: vw(28),
    width: vw(375),
    justifyContent: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: vw(100),
  },
  backTouchable: {
    flexDirection: 'row',
    alignItems: 'center',
    // height: vw(28),
    zIndex: 2,
  },
  backButton: {
    height: vw(20),
    width: vw(20),
    marginRight: vw(10),
  },
  headerText: {
    fontFamily: fonts.SEMIBOLD,
    color: colors.WHITE,
    fontSize: vw(20),
    width: vw(270),
  },
  AnimatedView: {
    height: vw(screenHeight * 1.2),
    width: vw(DesignWidth * 2.5),
    borderRadius: vw(500),
    position: 'absolute',
    alignSelf: 'center',
    alignItems: 'center',
    // justifyContent: 'center',
    backgroundColor: colors.BLACK,
  },
  blurView: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  blurImage: {
    width: vw(DesignWidth),
    height: vw(680),
    resizeMode: 'contain',
  },
});
