import thunk from "redux-thunk";
import {persistStore, persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {legacy_createStore as createStore, applyMiddleware, compose} from 'redux'

import rootReducer from '../reducer/rootreducer'
import { createLogger } from "redux-logger";

const enhancer = compose(applyMiddleware(thunk,createLogger({})));

const persistConfig = {
  key: 'root',
  timeout: 0,
  storage: AsyncStorage,
  whitelist: ['authReducer','profileReducer'],
};
const persistedReducer = persistReducer(persistConfig,rootReducer);
export const store = createStore(persistedReducer, enhancer);
export const persistor = persistStore(store);