import {
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import {useSelector} from 'react-redux';
import {Bubble, GiftedChat, InputToolbar} from 'react-native-gifted-chat';

import {
  normalize,
  screenHeight,
  screenWidth,
  vw,
} from '../../../utils/dimensions';
import ChatHeader from '../../../components/chatHeader';
import {colors} from '../../../utils/colors';
import localimages from '../../../utils/localimages';
import fonts from '../../../utils/fonts';

export function Inbox({route}: any) {
  const {Name, UID, pic, status, bio} = route.params;

  const [messages, setMessages] = useState([]);
  const {Auth_Data} = useSelector((store: any) => store.authReducer);
  const {User_Data} = useSelector((store: any) => store.profileReducer);
  let UserId = Auth_Data?.uid;
  const [userStatus, setuserStatus] = useState('');
  const [isTyping, setisTyping] = useState<boolean>(false);
  const [getTypingStatus, setgetTypingStatus] = useState(false);
  const docid = UID > UserId ? UserId + '-' + UID : UID + '-' + UserId;

  console.log('userData', User_Data);

  useEffect(() => {
    const subscribe = firestore()
      .collection('chatrooms')
      .doc(docid)
      .collection('messages')
      .orderBy('createdAt', 'desc')
      .onSnapshot(documentSnapshot => {
        const allmsg = documentSnapshot.docs.map(item => {
          return item.data();
        });
        allmsg.sort((a, b) => {
          return b.createdAt - a.createdAt;
        });
        //@ts-ignore
        setMessages(allmsg);
      });

    return subscribe;
  }, []);

  useEffect(() => {
    const subscribe = firestore()
      .collection('Users')
      .doc(UID)
      .onSnapshot((documentSnapshot: any) => {
        console.log(documentSnapshot.data().isActive);
        setuserStatus(documentSnapshot.data().isActive);
      });
    return subscribe;
  }, []);
  const getAllmsg = async () => {
    const querySanp = await firestore()
      .collection('chatrooms')
      .doc(docid)
      .collection('messages')
      .orderBy('createdAt', 'desc')
      .get();
    const allmsg = querySanp.docs.map(docSanp => {
      return docSanp.data();
    });
    //@ts-ignore
    setMessages(allmsg);
  };

  useEffect(() => {
    getAllmsg();
  }, []);

  const onSend = (messagesArray: any) => {
    const msg = messagesArray[0];
    messagesArray[0].createdAt = new Date().getTime();
    const mymsg = {
      ...msg,
      createdAt: new Date().getTime(),
    };
    setMessages(previousMessages => GiftedChat.append(previousMessages, mymsg));

    firestore()
      .collection('chatrooms')
      .doc(docid)
      .collection('messages')
      .doc(mymsg._id)
      .set(mymsg);

    console.log('other User', UID, 'current user', UserId);

    if (messages.length == 0) {
      firestore()
        .collection('Users')
        .doc(UserId)
        .collection('Inbox')
        .doc(UID)
        .set({
          Name: Name,
          display: pic,
          uid: UID,
          About: bio,
        }).then((res)=>{console.log('response',res)})

      firestore()
        .collection('Users')
        .doc(UID)
        .collection('Inbox')
        .doc(UserId)
        .set({
          Name: User_Data?.Name,
          display: User_Data?.display,
          uid: User_Data?.uid,
          About: User_Data?.About,
        });
    }
  };

  useEffect(() => {
    firestore()
      .collection('chatrooms')
      .doc(docid)
      .collection('TypingStatus')
      .doc(UserId)
      .set({
        isTyping: isTyping,
      });
    firestore()
      .collection('chatrooms')
      .doc(docid)
      .collection('TypingStatus')
      .doc(UID)
      .onSnapshot(onchange => {
        let typing = onchange.data();
        setgetTypingStatus(typing?.isTyping);
      });
  }, [isTyping]);

  const debounce = useCallback((fun: any, timeout: any) => {
    //@ts-ignore
    let timer;
    return (args: any) => {
      //@ts-ignore
      clearTimeout(timer);
      timer = setTimeout(() => {
        fun(false);
      }, timeout);
      setisTyping(true);
    };
  }, []);

  const startTyping = debounce(() => {
    setisTyping(false);
  }, 2000);

  const findtyping = (text: any) => {
    if (text.length > 0)
      //@ts-ignore
      startTyping();
  };

  const renderComposer = (props: any) => {
    return (
      <View>
        <InputToolbar
          {...props}
          containerStyle={{
            marginHorizontal: normalize(10),
            borderRadius: normalize(30),
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: colors.TRANSPARENT,
            bottom: 0,
            borderTopWidth: 0,
          }}
          primaryStyle={{backgroundColor: colors.BLACK_10}}
        />
      </View>
    );
  };

  return (
    <View style={styles.mainContainer}>
      <ChatHeader status={status} name={Name} pic={pic} />
      <SafeAreaView>
        {/* <Image source={localimages.LANDING_BG} style={styles.backGroundImage} /> */}
      </SafeAreaView>
      <GiftedChat
        isKeyboardInternallyHandled={true}
        infiniteScroll={true}
        onInputTextChanged={findtyping}
        renderBubble={props => {
          return (
            <Bubble
              {...props}
              wrapperStyle={{
                left: {backgroundColor: colors.LEFT_BUBBLE},
                right: {backgroundColor: colors.RIGHT_BUBBLE},
              }}
              textStyle={{
                left: {
                  fontFamily: fonts.REGULAR,
                  fontSize: vw(13),
                  color: colors.WHITE,
                },
                right: {
                  fontFamily: fonts.REGULAR,
                  fontSize: vw(13),
                  color: colors.WHITE,
                },
              }}
            />
          );
        }}
        wrapInSafeArea={Platform.OS == 'android'}
        messages={messages}
        user={{
          _id: UserId,
        }}
        onSend={onSend}
        // renderInputToolbar={renderComposer}
        isTyping={getTypingStatus}
      />
      <SafeAreaView>
        <View style={styles.footerView} />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.darkTheme.BACKGROUND,
  },
  backGroundImage: {
    height: vw(screenHeight - 65),
    width: vw(screenWidth),
    position: 'absolute',
    zIndex: -2,
  },
  footerView: {
    height: vw(1),
  },
});
