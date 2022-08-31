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
import auth from '@react-native-firebase/auth';
import {useDispatch, useSelector} from 'react-redux';
import {colors} from '../../../utils/colors';
import strings from '../../../utils/strings';
import {vw} from '../../../utils/dimensions';
import TextInputWithPlaceholder from '../../../components/textinputwithplaceholder';
import localimages from '../../../utils/localimages';
import ImageCropPicker from 'react-native-image-crop-picker';
import screenNames from '../../../utils/screenNames';
import uploadImage from '../action';

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

  const imagePicker= async()=>{
    try {
      const image = await ImageCropPicker.openPicker({
        cropping: true,
        height: 150,
        width: 150,
      });
      let cloudImage = {
        uri: image.sourceURL,
        type: `image/jpg`,
        name: `${uid}.${image.path.includes('jpg')? 'jpg' : 'png'}`,
      }
      
      uploadImage(image)

      setImage(image.path);
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
          <TouchableOpacity onPress={imagePicker} >
            <Image source={localimages.SEARCH} style={{height: 20, width: 20, position: 'absolute',left: 40,bottom: 5,}} />
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
      borderWidth: 1,
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
});
