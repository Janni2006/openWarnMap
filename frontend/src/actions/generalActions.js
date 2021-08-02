import { VISIT, LANGUAGE, TITLE } from "./types";

export const visitPage = () => (dispatch) => {
	dispatch({
		type: VISIT,
	});
};

export const setLanguage = (language) => (dispatch, getState) => {
	window.localStorage.setItem("locale", language);

	dispatch({
		type: LANGUAGE,
		payload: language,
	});
};

export const setTitle = (title) => (dispatch) => {
	dispatch({
		type: TITLE,
		payload: title ? "openWarnMap - " + title : "openWarnMap",
	});
};
