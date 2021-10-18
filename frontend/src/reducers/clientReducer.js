import { CHECK_ONLINE, CHECK_GPS } from "../actions/types";
import { toast } from "react-toastify";

const check_GPS_available = () => {
	if (!navigator.geolocation) {
		return false;
	}
	var available = false;
	navigator.geolocation.getCurrentPosition(
		function (e) {
			console.log(e);
			available = true;
		},
		function () {
			available = false;
			toast.error("The user permitted gps access");
		}
	);
	return available;
};

const initialState = {
	gps: {
		available: check_GPS_available(),
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
		case CHECK_GPS:
			return {
				...state,
				gps: { ...state.gps, available: check_GPS_available() },
			};
		default:
			return state;
	}
}
