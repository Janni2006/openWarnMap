import { VIEW, MAP_DATA, OPEN_MARKER_POPUP, CLOSE_MARKER_POPUP } from "./types";

import axios from "axios";

export const viewChanges = (lat, lng, zoom) => (dispatch) => {
	dispatch({
		type: VIEW,
		payload: {
			latitude: lat,
			longitude: lng,
			zoom: zoom,
		},
	});
};

export const updateData = () => (dispatch) => {
	const config = {
		success: (res) => {
			dispatch({
				type: MAP_DATA,
				payload: res.data,
			});
		},
		error: (err) => {
			console.log(err);
		},
	};
	axios
		.get("/react/data/", config)
		.then((res) => {
			res.config.success(res);
		})
		.catch((err) => {
			err.config.error(err);
		});
};

export const openMarkerPopup = (item) => (dispatch, getState) => {
	if (getState().auth.isAuthenticated) {
		axios
			.get(`/react/vote/status/?item=${item.code}`)
			.then((res) => {
				item.voted = res.data.voted;
				item.vote = { confirm: res.data.confirm, change: res.data.change };
				dispatch({ type: OPEN_MARKER_POPUP, payload: item });
			})
			.catch((err) => {
				dispatch({ type: OPEN_MARKER_POPUP, payload: item });
				console.log(err);
			});
	} else {
		dispatch({ type: OPEN_MARKER_POPUP, payload: item });
	}
};

export const closeMarkerPopup = () => (dispatch) => {
	dispatch({ type: CLOSE_MARKER_POPUP });
};
