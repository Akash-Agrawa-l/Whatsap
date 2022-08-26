import {View, Text, AppState} from 'react-native';
import React, {useContext, useEffect} from 'react';
import NetInfo from '@react-native-community/netinfo';
import RootRoute from './src/routes/rootRouter';


export default function App() {
  useEffect(() => {
    AppState.addEventListener('change',(item)=>{console.log("App State",item)})
  }, []);

  return <RootRoute />;
}
