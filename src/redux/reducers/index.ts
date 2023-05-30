import { combineReducers } from "redux";
import passwordReducer from "./passwordReducer";

const rootReducer = combineReducers({
  passwords: passwordReducer,
});

export default rootReducer;
