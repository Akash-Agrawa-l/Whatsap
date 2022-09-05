import {
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import {useDispatch, useSelector} from 'react-redux';
import auth from '@react-native-firebase/auth';
import ImageCropPicker from 'react-native-image-crop-picker';
import Clipboard from '@react-native-clipboard/clipboard';

import {colors} from '../../../utils/colors';
import CustomHeader from '../../../components/header';
import strings from '../../../utils/strings';
import localimages from '../../../utils/localimages';
import { uploadImage } from '../../../utils/common';
import {vw} from '../../../utils/dimensions';
import fonts from '../../../utils/fonts';
import screenNames from '../../../utils/screenNames';

interface profileProps {
  uid?: string;
}
// @ts-ignore
export function Profile({uid,navigation}: profileProps) {
  const {Auth_Data} = useSelector((store: any) => store.authReducer);
  const {User_Data} = useSelector((store: any) => store.authReducer);
  let Uid = uid ? uid : Auth_Data?.uid;
  const [user, setUser]: any = useState();
  const [image, setImage] = useState('');
  const dispatch = useDispatch()
  console.log('profile Data',User_Data)

  useEffect(()=>{
    firestore()
      .collection('Users')
      .where('uid', '==', Auth_Data?.uid)
      .get()
      .then((res: any) => {
        let users = res?._docs?.map((item: any) => {
          return item._data;
        });
        console.log('set_data',users[0]);
        dispatch({type: 'Set_Data', payload: users[0]});
        setUser(users[0])
      });
  },[])

  const sucessCallback=(resp:any)=>{
    console.log(resp.secure_url);
    setImage(resp?.secure_url)
    firestore()
      .collection('Users')
      .doc(Uid)
      .update({
        display: resp.secure_url,
      })
      .then(res => {
        console.log('Response is', res);
      })
      .catch(err => {
        console.log('Error is', err);
      });
    
  }

  const imagePicker = async () => {
    try {
      const image = await ImageCropPicker.openPicker({
        cropping: true,
        height: 150,
        width: 150,
      });

      let cloudImage = {
        uri: image.sourceURL,
        type: `image/jpg`,
        name: `${uid}.${image.path.includes('jpg') ? 'jpg' : 'png'}`,
      };

      uploadImage(cloudImage,sucessCallback)
    } catch (err) {
      console.log('ImageErr', err);
    }
  };

  const signOut=()=>{
    auth()
    .signOut()
    .then(()=>{ 
      dispatch({type: 'signIn', payload: {}});
      dispatch({type: 'Set_Data', payload: {}});
    navigation.replace(screenNames.LOGIN_SCREEN)})
  }

  return (
    <View style={styles.mainContainer}>
      <StatusBar
        translucent={false}
        showHideTransition={'slide'}
        networkActivityIndicatorVisible={true}
        backgroundColor={colors.darkTheme.BACKGROUND}
      />
      <CustomHeader name={`${user?.Name}${strings.PROFILE_HEADER}`} logout={signOut} />
      <View style={styles.profileImageView}>
        <Image
          source={user?.display.includes('cloudinary') ? {uri: user?.display} : localimages.PLACEHOLDER }
          style={styles.profileImage}
        />
        <TouchableOpacity onPress={imagePicker} style={styles.editButton}>
          <Image source={localimages.EDIT} style={styles.editLogo} />
        </TouchableOpacity>
      </View>
      <View style={styles.detailView}>
        <Text style={styles.detailTitle}>{strings.NAME}</Text>
        <Text style={styles.detailText}>{user?.Name}</Text>
      </View>
      <View style={styles.detailView}>
        <Text style={styles.detailTitle}>{strings.PHONE_NUMBER}</Text>
        <Text style={styles.detailText} onLongPress={()=>{ Clipboard.setString(Auth_Data.phoneNumber) }} >{Auth_Data.phoneNumber}</Text>
      </View>
      <View style={styles.detailView}>
        <Text style={styles.detailTitle}>{strings.EMAIL}</Text>
        <Text style={styles.detailText}>{user?.Email}</Text>
      </View>
      <View style={styles.detailView}>
        <Text style={styles.detailTitle}>{strings.ABOUT}</Text>
        <Text style={styles.detailText}>{user?.About}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.darkTheme.BACKGROUND,
    alignItems: 'center',
  },
  profileImageView: {
    height: vw(150),
    width: vw(150),
    marginBottom: vw(30),
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  profileImage: {
    height: vw(130),
    width: vw(130),
    borderColor: colors.WHITE,
    borderWidth: vw(2),
    borderRadius: vw(70),
  },
  editButton: {
    height: vw(30),
    width: vw(30),
    backgroundColor: colors.darkTheme.CHILDBACKGROUND,
    position: 'absolute',
    right: vw(15),
    bottom: vw(5),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: vw(20),
  },
  editLogo: {
    height: vw(20),
    width: vw(20),
    resizeMode: 'contain',
  },
  detailView: {
    flexDirection: 'row',
    width: vw(280),
    justifyContent: 'space-between',
    marginVertical: vw(8),
  },
  detailTitle: {
    fontFamily: fonts.SEMIBOLD,
    fontSize: vw(17),
    color: colors.WHITE,
  },
  detailText: {
    fontFamily: fonts.REGULAR,
    fontSize: vw(17),
    color: colors.WHITE,
  },
});
