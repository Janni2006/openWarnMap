import { LOAD_PRIVATE_DATA, LOAD_PRIVATE_DATA_SUCCESS } from "./types";

import axios from "axios";

export const loadPrivateData = () => (dispatch) => {
	dispatch({
		type: LOAD_PRIVATE_DATA,
	});

	axios
		.get("/react/private-data/?verified=true")
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
