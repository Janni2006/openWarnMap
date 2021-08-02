import {
	USER_LOADING,
	USER_LOADED,
	LOGIN_SUCCESS,
	LOGIN_FAILED,
	LOGOUT_SUCCESS,
	REFRESH_TOKEN_SUCCESS,
	AUTH_ERROR,
	REGISTER_SUCCESS,
	REGISTER_FAILED,
	USER_NOT_LOGGEDIN,
} from "../actions/types";

const initialLoginState = () => {
	if (window.localStorage.getItem("_lastLogin")) {
		const lastLogin = JSON.parse(window.localStorage.getItem("_lastLogin"));
		if (lastLogin.last_updated - Date.now() >= 1000 * 60 * 60 * 24 * 7) {
			console.log("Here");
			// 7 days: efreschtoken expires after 7 days
			return { logged_in: false, last_updated: 0 };
		}
		return lastLogin;
	}
	return { logged_in: false, last_updated: Date.now() };
};

const initialState = {
	initialLoginState: {
		logged_in: initialLoginState().logged_in,
		last_updated: initialLoginState().last_updated,
	},
	token: null,
	tokenGenerated: 0,
	user: {
		username: null,
		avatar: null,
		email: null,
		firstname: null,
		lastname: null,
		last_login: null,
	},
	authError: false,
	isAuthenticated: false,
	progress: true,
};

export default function foo(state = initialState, action) {
	switch (action.type) {
		case USER_LOADING:
			return {
				...state,
				progress: true,
			};
		case USER_LOADED:
			return {
				...state,
				progress: false,
				user: {
					username: action.payload.username,
					avatar: action.payload.avatar_color,
					email: action.payload.email,
					firstname: action.payload.firstname,
					lastname: action.payload.lastname,
					last_login: Date.parse(action.payload.last_login),
				},
			};
		case USER_NOT_LOGGEDIN:
			return { ...state, isAuthenticated: false, progress: false };
		case LOGIN_SUCCESS:
			window.localStorage.setItem(
				"_lastLogin",
				JSON.stringify({
					logged_in: true,
					last_updated: Date.now(),
				})
			);
			return {
				...state,
				initialLoginState: { logged_in: true, last_updated: Date.now() },
				token: action.payload.token,
				tokenGenerated: Date.now(),
				user: {
					...state.user,
					username: action.payload.username,
					email: action.payload.email,
				},
				isAuthenticated: true,
				progress: false,
			};
		case LOGIN_FAILED:
			return {
				...state,
				token: "",
				tokenGenerated: 0,
				user: null,
				isAuthenticated: false,
				progress: false,
			};
		case AUTH_ERROR:
			return {
				...state,
				progress: false,
				authError: true,
			};
		case LOGOUT_SUCCESS:
			window.localStorage.setItem(
				"_lastLogin",
				JSON.stringify({
					logged_in: false,
					last_updated: Date.now(),
				})
			);
			return {
				...state,
				initialLoginState: { logged_in: false, last_updated: Date.now() },
				token: null,
				tokenGenerated: 0,
				user: null,
				isAuthenticated: false,
				progress: false,
			};
		case REFRESH_TOKEN_SUCCESS:
			window.localStorage.setItem(
				"_lastLogin",
				JSON.stringify({
					logged_in: true,
					last_updated: Date.now(),
				})
			);
			return {
				...state,
				initialLoginState: { logged_in: true, last_updated: Date.now() },
				token: action.payload.token,
				tokenGenerated: Date.now(),
				isAuthenticated: true,
			};
		case REGISTER_SUCCESS:
			return {
				...state,
				progress: false,
			};
		case REGISTER_FAILED:
			return {
				...state,
				progress: false,
			};
		default:
			return state;
	}
}
