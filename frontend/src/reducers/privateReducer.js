import {
	LOAD_PRIVATE_DATA,
	LOAD_PRIVATE_DATA_SUCCESS,
	SET_PRIVATE_FILTERS,
} from "../actions/types";

const initialState = {
	loading: true,
	filters: {
		active: false,
		height: 0,
		localization: 0,
		size: 0,
		verified: false,
		sort: 0,
	},
	data: [],
};

export default function foo(state = initialState, action) {
	switch (action.type) {
		case LOAD_PRIVATE_DATA:
			return {
				...state,
				loading: true,
			};
		case LOAD_PRIVATE_DATA_SUCCESS:
			return {
				...state,
				loading: false,
				data: action.payload,
			};
		case SET_PRIVATE_FILTERS:
			return {
				...state,
				filters: action.payload,
			};
		default:
			return state;
	}
}
