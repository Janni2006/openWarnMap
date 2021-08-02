import { VISIT, LANGUAGE, TITLE } from "../actions/types";

import { LOCALES } from "../i18n/languages";

const initialLanguage = () => {
	if (window.localStorage.getItem("locale")) {
		return window.localStorage.getItem("locale");
	}
	if (navigator.language == "de-DE") {
		return LOCALES.GERMAN;
	}
	return LOCALES.ENGLISH;
};

const initialState = {
	pageVisits: 0, // detect if previous URL was
	language: initialLanguage(),
	pageTitle: "openWarnMap",
};

export default function foo(state = initialState, action) {
	switch (action.type) {
		case VISIT:
			return {
				...state,
				pageVisits: (state.pageVisits += 1),
			};
		case LANGUAGE:
			return {
				...state,
				language: action.payload,
			};
		case TITLE:
			return {
				...state,
				pageTitle: action.payload,
			};
		default:
			return state;
	}
}
