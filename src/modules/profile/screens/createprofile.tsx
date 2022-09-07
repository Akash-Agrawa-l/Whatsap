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
import {colors} from '../../../utils/colors';
import strings from '../../../utils/strings';
import {vw} from '../../../utils/dimensions';
import TextInputWithPlaceholder from '../../../components/textinputwithplaceholder';
import localimages from '../../../utils/localimages';
import ImageCropPicker from 'react-native-image-crop-picker';
import screenNames from '../../../utils/screenNames';
import {uploadImage} from '../../../utils/common';

export function CreateProfile({navigation, route}: any) {
  const dispatch = useDispatch();
  const {Auth_Data} = useSelector((store: any) => store.authReducer);
  const {details} = route?.params;
  let uid = details?.uid;

  const [name, setName] = useState('hello');
  const [number, setNumber] = useState(details?.phoneNumber);
  const [About, setAbout] = useState('');
  const [Email, setEmail] = useState('');
  const [image,setImage] = useState('')

  useEffect(() => {
    firestore()
      .collection('Users')
      .get()
      .then(querySnapshot => {
        // console.log('Total users: ', querySnapshot.size);
        querySnapshot.forEach(documentSnapshot => {
          const UserName = documentSnapshot.data();
          console.log('User Name========:=====> ', UserName);
        });
      });
  }, []);

  const onChangeName = (text: string) => {
    setName(text);
  };

  const onChangeAbout = (text: string) => {
    setAbout(text);
  };
  const onChangeEmail = (text: string) => {
    setEmail(text);
  };

  const submitHandler = () => {
    firestore()
      .collection('Users')
      .doc(uid)
      .set({
        Name: name,
        Email: Email,
        Number: details?.phoneNumber,
        About: About,
        display: image,
        uid: uid,
        isActive: true,
      })
      .then(res => {
        console.log('Response is', res);
        dispatch({type: 'Set_Data', payload: res});
        navigation.navigate(screenNames.HOME_SCREEN);
      })
      .catch(err => {
        console.log('Error is', err);
      });
  };

  const sucessCallback=(resp:any)=>{
    console.log(resp);
    setImage(resp)
    // firestore()
    //   .collection('Users')
    //   .doc(uid)
    //   .update({
    //     display: resp,
    //   })
    //   .then(res => {
    //     console.log('Response is', res);
    //   })
    //   .catch(err => {
    //     console.log('Error is', err);
    //   });
    
  }

  const imagePicker= async()=>{
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
        name: `${uid}.${image.path.includes('jpg')? 'jpg' : 'png'}`,
      }
      
      uploadImage(cloudImage,sucessCallback)

    } catch (err) {
      console.log('ImageErr', err);
    }
  }

  return (
    <View style={styles.mainContainer}>
      <StatusBar
        translucent={false}
        showHideTransition={'slide'}
        networkActivityIndicatorVisible={true}
        backgroundColor={colors.darkTheme.BACKGROUND}
      />
      <View style={styles.profileImageView}>
          <Image source={ image == '' ? localimages.PLACEHOLDER : {uri: image} } style={styles.profileImage}/>
          <TouchableOpacity onPress={imagePicker} style={styles.editButton} >
            <Image source={localimages.EDIT} style={styles.editLogo} />
          </TouchableOpacity>
      </View>
      <TextInputWithPlaceholder
        placeholder="Name"
        value={name}
        // defaultValue={}
        onChangeText={onChangeName}
      />
      <TextInputWithPlaceholder
        placeholder={strings.PHONE_NUMBER}
        value={number}
        defaultValue={number}
        disabled={false}
      />
      <TextInputWithPlaceholder
        placeholder="Email"
        value={Email}
        onChangeText={onChangeEmail}
      />
      <TextInputWithPlaceholder
        placeholder="About"
        value={About}
        onChangeText={onChangeAbout}
      />
      <TouchableOpacity onPress={submitHandler} style={styles.submitButton}>
        <Text style={styles.submitButtonText}>{strings.SUBMIT}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.darkTheme.BACKGROUND,
    paddingTop: vw(70),
    // justifyContent: 'center',
    alignItems: 'center',
  },
  profileImageView: {
      height: vw(150),
      width: vw(150),
      marginBottom: vw(30),
      justifyContent: 'center',
      alignItems: 'center',
  },
  profileImage: {
      height: vw(130),
      width: vw(130),
      borderColor: colors.WHITE,
      borderWidth: vw(2),
      borderRadius: vw(70),
  },
  submitButton: {
    backgroundColor: colors.darkTheme.CHILDBACKGROUND,
    height: vw(40),
    width: vw(140),
    borderRadius: vw(10),
    marginTop: vw(30),
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonText: {
    color: colors.darkTheme.TEXT,
    fontSize: vw(16),
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
});
