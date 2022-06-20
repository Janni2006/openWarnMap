import {
	VIEW,
	MAP_DATA,
	OPEN_MARKER_POPUP,
	CLOSE_MARKER_POPUP,
	MARKER_POPUP_LOADING,
	MARKER_POPUP_LOADED,
} from "../actions/types";

const initialPopupContent = {
	code: "",
	active: false,
	verified: false,
	gps_coords: [0, 0],
	size: 0,
	height: 0,
	localization: 0,
	created: "",
	voted: false,
	vote: { confirm: false, change: false },
};

const initialState = {
	view: {
		latitude: 51.163375,
		longitude: 10.447683,
		zoom: 6,
	},
	markerPopup: { open: false, content: initialPopupContent, loading: false },
	data: [],
};

export default function foo(state = initialState, action) {
	switch (action.type) {
		case VIEW:
			return {
				...state,
				view: {
					latitude: action.payload.latitude,
					longitude: action.payload.longitude,
					zoom: action.payload.zoom,
				},
			};
		case MAP_DATA:
			return {
				...state,
				data: action.payload,
			};
		case OPEN_MARKER_POPUP:
			return {
				...state,
				markerPopup: {
					...state.markerPopup,
					open: true,
					content: action.payload,
				},
			};
		case CLOSE_MARKER_POPUP:
			return {
				...state,
				markerPopup: {
					...state.markerPopup,
					open: false,
					content: initialPopupContent,
				},
			};
		case MARKER_POPUP_LOADING:
			return { ...state, markerPopup: { ...state.markerPopup, loading: true } };
		case MARKER_POPUP_LOADED:
			return {
				...state,
				markerPopup: { ...state.markerPopup, loading: false },
			};
		default:
			return state;
	}
}
