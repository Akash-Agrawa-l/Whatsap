import { combineReducers } from "redux";
import {authReducer} from "../modules/auth";
// import chatReducer from "./homeChat/reducer";

const rootReducer=combineReducers({
  authReducer,
//   chatReducer
 })
 
 export default rootReducer