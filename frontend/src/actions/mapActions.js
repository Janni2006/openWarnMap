import {
	VIEW,
	MAP_DATA,
	OPEN_MARKER_POPUP,
	CLOSE_MARKER_POPUP,
	MARKER_POPUP_LOADED,
	MARKER_POPUP_LOADING,
} from "./types";

import axios from "axios";

import { toast } from "react-toastify";

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
		dispatch({ type: MARKER_POPUP_LOADING });
		axios
			.get(`/react/vote/status/?item=${item.code}`)
			.then((res) => {
				console.log(res);
				if (res.data.private) {
					item.private = true;
					item.voted = false;
					item.vote = { confirm: false, change: false };
				} else {
					item.voted = res.data.voted;
					item.vote = { confirm: res.data.confirm, change: res.data.change };
				}
				dispatch({ type: OPEN_MARKER_POPUP, payload: item });
				dispatch({ type: MARKER_POPUP_LOADED });
			})
			.catch((err) => {
				dispatch({ type: OPEN_MARKER_POPUP, payload: item });
				dispatch({ type: MARKER_POPUP_LOADED });
				console.log(err);
			});
	} else {
		dispatch({ type: OPEN_MARKER_POPUP, payload: item });
	}
};

export const confirmMarker = () => (dispatch, getState) => {
	var item = getState().map.markerPopup.content;
	console.log(item);
	dispatch({ type: MARKER_POPUP_LOADING });
	const config = {
		headers: {
			"Content-Type": "application/json",
			"X-CSRFToken": getState().security.csrf_token,
		},
	};
	const body = JSON.stringify({
		entry_id: getState().map.markerPopup.content.code,
		confirm: true,
		change: false,
		applied_change: 0,
	});
	axios
		.post("/react/vote/create/", body, config)
		.then((res) => {
			toast.success("Wir danken Ihnen für die Rückmeldung zu diesem Eintrag");
			dispatch({ type: OPEN_MARKER_POPUP, payload: item });
			dispatch({ type: MARKER_POPUP_LOADED });
		})
		.catch((err) => {
			if (err.response.status == 409) {
				toast.warn(
					"Sie haben uns zu diesem Eintrag bereits eine Rückmeldung erstattet."
				);
			} else {
				toast.error(
					"Es ist etwas schief gelaufen! Bitte versuchen Sie es später erneut oder wenden sich an unseren Support."
				);
			}
			console.log(err);
		});
};

export const closeMarkerPopup = () => (dispatch) => {
	dispatch({ type: CLOSE_MARKER_POPUP });
};
