import {
	VIEW,
	MAP_DATA,
	OPEN_MARKER_POPUP,
	CLOSE_MARKER_POPUP,
} from "../actions/types";

const initialState = {
	view: {
		lattitude: 0,
		longitude: 0,
		zoom: 0,
	},
	markerPopup: { open: false, content: {} },
	data: [],
};

export default function foo(state = initialState, action) {
	switch (action.type) {
		case VIEW:
			return {
				...state,
				view: {
					lattitude: action.payload.lattitude,
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
				markerPopup: { open: true, content: action.payload },
			};
		case CLOSE_MARKER_POPUP:
			return { ...state, markerPopup: { open: false, content: {} } };
		default:
			return state;
	}
}
