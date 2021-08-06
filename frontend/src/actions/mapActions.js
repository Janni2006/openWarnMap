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

export const openMarkerPopup = (item) => (dispatch) => {
	dispatch({ type: OPEN_MARKER_POPUP, payload: item });
};

export const closeMarkerPopup = () => (dispatch) => {
	dispatch({ type: CLOSE_MARKER_POPUP });
};
