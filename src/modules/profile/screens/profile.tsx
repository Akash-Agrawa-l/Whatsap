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
  const {User_Data} = useSelector((store: any) => store.profileReducer);
  let Uid = uid ? uid : Auth_Data?.uid;
  const dispatch = useDispatch()
  console.log('profile Data',User_Data)

  useEffect(()=>{
    firestore()
      .collection('Users')
      .where('uid', '==', Auth_Data?.uid)
      .onSnapshot((ele:any) => {
        let newArr = ele?._docs?.map((item:any)=>item._data)
          dispatch({type: 'Set_Data', payload: newArr[0]});
      })
  },[])

  const sucessCallback=(resp:any)=>{
    console.log(resp);
    firestore()
      .collection('Users')
      .doc(Uid)
      .update({
        display: resp.split('upload/')
        .join('upload/w_150,h_150,c_fill/'),
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
        mediaType: 'photo',
        cropping: true,
        height: 150,
        width: 150,
        compressImageQuality: 0.4,
      });

      let cloudImage = {
        uri: image.path,
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
      <CustomHeader name={`${User_Data?.Name}${strings.PROFILE_HEADER}`} logout={signOut} />
      <View style={styles.profileImageView}>
        <Image
          source={User_Data?.display.includes('cloudinary') ? {uri: User_Data?.display} : localimages.PLACEHOLDER }
          style={styles.profileImage}
        />
        <TouchableOpacity onPress={imagePicker} style={styles.editButton}>
          <Image source={localimages.EDIT} style={styles.editLogo} />
        </TouchableOpacity>
      </View>
      <View style={styles.detailView}>
        <Text style={styles.detailTitle}>{strings.NAME}</Text>
        <Text style={styles.detailText}>{User_Data?.Name}</Text>
      </View>
      <View style={styles.detailView}>
        <Text style={styles.detailTitle}>{strings.PHONE_NUMBER}</Text>
        <Text style={styles.detailText} onLongPress={()=>{ Clipboard.setString(Auth_Data.phoneNumber) }} >{Auth_Data.phoneNumber}</Text>
      </View>
      <View style={styles.detailView}>
        <Text style={styles.detailTitle}>{strings.EMAIL}</Text>
        <Text style={styles.detailText}>{User_Data?.Email}</Text>
      </View>
      <View style={styles.detailView}>
        <Text style={styles.detailTitle}>{strings.ABOUT}</Text>
        <Text style={styles.detailText}>{User_Data?.About}</Text>
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
