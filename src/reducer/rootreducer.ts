import { combineReducers } from "redux";
import {authReducer} from "../modules/auth";
import { profileReducer } from "../modules/profile";

const rootReducer=combineReducers({
  authReducer,
  profileReducer
 })
 
 export default rootReducer