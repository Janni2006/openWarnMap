import { CHECK_ONLINE, CHECK_GPS, SET_GPS } from "./types";
import { toast } from "react-toastify";

export const clientCheck = () => (dispatch, getState) => {
	dispatch({
		type: CHECK_ONLINE,
	});
	if (!navigator.geolocation) {
		dispatch({
			type: SET_GPS,
			payload: {
				available: false,
				error: "Geolocation is not available on this device",
			},
		});
	} else {
		navigator.geolocation.getCurrentPosition(
			function (e) {
				dispatch({
					type: SET_GPS,
					payload: { available: true, messaged: false, error: "" },
				});
			},
			function () {
				dispatch({
					type: SET_GPS,
					payload: {
						available: false,
						error: "You have blocked geolocation access!",
					},
				});
			}
		);
	}
	// Use internationalization in the future!
	if (!getState().client.gps.messaged && getState().client.gps.error) {
		toast.warning(getState().client.gps.error);
		dispatch({ type: SET_GPS, payload: { messaged: true } });
	}
};
