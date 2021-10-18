import { CHECK_ONLINE, CHECK_GPS } from "./types";

export const navigatorCheck = () => (dispatch) => {
	dispatch({
		type: CHECK_ONLINE,
	});
	dispatch({ type: CHECK_GPS });
};
