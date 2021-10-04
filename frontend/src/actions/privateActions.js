import {
	LOAD_PRIVATE_DATA,
	LOAD_PRIVATE_DATA_SUCCESS,
	SET_PRIVATE_FILTERS,
} from "./types";

import axios from "axios";

export const loadPrivateData = () => (dispatch, getState) => {
	dispatch({
		type: LOAD_PRIVATE_DATA,
	});

	axios
		.get("/react/private-data/", {
			params: {
				active: getState().private.filters.active == true ? true : null,
				verified: getState().private.filters.verified == true ? true : null,
				size: getState().private.filters.size,
				height: getState().private.filters.height,
				localization: getState().private.filters.localization,
			},
		})
		.then((res) => {
			dispatch({
				type: LOAD_PRIVATE_DATA_SUCCESS,
				payload: res.data,
			});
		})
		.catch((err) => {
			console.log(err);
		});
};

export const setPrivateDataFilters = (filters) => (dispatch) => {
	dispatch({ type: SET_PRIVATE_FILTERS, payload: filters });

	dispatch({
		type: LOAD_PRIVATE_DATA,
	});

	axios
		.get("/react/private-data/", {
			params: {
				active: filters.active == true ? true : null,
				verified: filters.verified == true ? true : null,
				size: filters.size,
				height: filters.height,
				localization: filters.localization,
			},
		})
		.then((res) => {
			dispatch({
				type: LOAD_PRIVATE_DATA_SUCCESS,
				payload: res.data,
			});
		})
		.catch((err) => {
			console.log(err);
		});
};
