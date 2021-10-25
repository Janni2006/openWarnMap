import { CHECK_ONLINE, CHECK_GPS, SET_GPS } from "../actions/types";

const initialState = {
	gps: {
		available: false,
		error: "",
		messaged: false,
	},
	online: navigator.onLine,
};

export default function foo(state = initialState, action) {
	switch (action.type) {
		case CHECK_ONLINE:
			return {
				...state,
				online: navigator.onLine,
			};
		case SET_GPS:
			return { ...state, gps: { ...state.gps, ...action.payload } };
		default:
			return state;
	}
}
