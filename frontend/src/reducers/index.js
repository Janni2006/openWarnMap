import { combineReducers } from "redux";
import generalReducer from "./generalReducer";
import authReducer from "./authReducer";
import securityReducer from "./securityReducer";
import mapReducer from "./mapReducer";
import privateReducer from "./privateReducer";

export default combineReducers({
	general: generalReducer,
	auth: authReducer,
	map: mapReducer,
	security: securityReducer,
	private: privateReducer,
});
