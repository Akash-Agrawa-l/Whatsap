import {View, Text, AppState} from 'react-native';
import React, {useContext, useEffect} from 'react';
import RootRoute from './src/routes/rootRouter';
import {PersistGate} from 'redux-persist/lib/integration/react';
import {Provider} from 'react-redux';
import {persistor, store} from './src/store/store';

export default function App() {
  useEffect(() => {
    AppState.addEventListener('change', item => {
      console.log('App State', item);
    });
  }, []);

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <RootRoute />
      </PersistGate>
    </Provider>
  );
}
