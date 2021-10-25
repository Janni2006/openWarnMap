import { CHECK_ONLINE, CHECK_GPS, SET_GPS } from "./types";
import { toast } from "react-toastify";
import { createIntl, createIntlCache } from "react-intl";
import messages from "../i18n/messages";

export const clientCheck = () => (dispatch, getState) => {
	const cache = createIntlCache();
	const intl = createIntl(
		{
			locale: getState().general.language,
			messages: messages[getState().general.language],
		},
		cache
	);
	dispatch({
		type: CHECK_ONLINE,
	});
	if (!navigator.geolocation) {
		dispatch({
			type: SET_GPS,
			payload: {
				available: false,
				error: intl.formatMessage({ id: "ACTIONS_GPS_UNAVAILABLE" }),
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
						error: intl.formatMessage({ id: "ACTIONS_GPS_BLOCKED" }),
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
