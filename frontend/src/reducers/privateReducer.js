import { LOAD_PRIVATE_DATA, LOAD_PRIVATE_DATA_SUCCESS } from "../actions/types";

const initialState = {
	loading: true,
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
		default:
			return state;
	}
}
