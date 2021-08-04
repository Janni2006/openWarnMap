import {
	USER_LOADING,
	USER_LOADED,
	USER_NOT_LOGGEDIN,
	LOGIN_SUCCESS,
	LOGIN_FAILED,
	LOGOUT_SUCCESS,
	AUTH_ERROR,
	REFRESH_TOKEN_SUCCESS,
	REGISTER_SUCCESS,
	REGISTER_FAILED,
} from "./types";

import axios from "axios";

import { toast } from "react-toastify";

export const loadUser =
	(runAnyways = false) =>
	(dispatch, getState) => {
		// user loading
		dispatch({
			type: USER_LOADING,
		});
		const config = {
			success: (res) => {
				// dispatch({
				//   type: GET_STATUS,
				//   payload: res.data.user.status
				// });
				// dispatch(setLanguage(res.data.user.language));
				dispatch({
					type: USER_LOADED,
					payload: res.data,
				});
			},
			error: (err) => {
				// if(err.response){
				//   dispatch(returnErrors(err.response.data.message, err.response.status));
				// }
				// var status = [];
				// if (window.localStorage.getItem('status')) {
				//   status = JSON.parse(window.localStorage.getItem('status'));
				// }
				// dispatch({
				//   type: GET_STATUS,
				//   payload: status
				// });
				// dispatch({
				// 	type: AUTH_ERROR,
				// });
			},
		};
		if (runAnyways) {
			axios
				.get("/backend/auth/user/", config, dispatch(authInterceptor()))
				.then((res) => {
					res.config.success(res);
				})
				.catch((err) => {
					err.config.error(err);
				});
		} else {
			if (getState().auth.initialLoginState.logged_in) {
				const refreshtoken_config = {
					headers: {
						"Content-Type": "application/json",
						"X-CSRFToken": getState().security.csrf_token,
					},
				};

				axios
					.post("/backend/auth/refresh-token/", {}, refreshtoken_config)
					.then((res) => {
						if (res.status === 200) {
							// clearTimeout(logoutTimerId);
							// const logoutTimer = () =>
							//   setTimeout(() => dispatch(logout()), timeToLogout);
							// logoutTimerId = logoutTimer();
							dispatch({
								type: REFRESH_TOKEN_SUCCESS,
								payload: res.data,
							});
							axios.defaults.headers.common["Authorization"] =
								"Token " + getState().auth.token;

							axios
								.get("/backend/auth/user/", config, dispatch(authInterceptor()))
								.then((res) => {
									res.config.success(res);
								})
								.catch((err) => {
									err.config.error(err);
								});
						}
					})
					.catch((err) => {
						// request failed, token could not be refreshed
						if (err.response) {
							// dispatch(
							//   returnErrors(err.response.data.message, err.response.status)
							// );
						}
						dispatch({
							type: AUTH_ERROR,
						});
					});
			} else {
				dispatch({ type: USER_NOT_LOGGEDIN });
			}
		}
	};

var logoutTimerID;
const timeToLogout = 14.9 * 60 * 100;

export const login = (username, password) => (dispatch, getState) => {
	dispatch({ type: USER_LOADING });
	const config = {
		headers: {
			"Content-Type": "application/json",
			"X-CSRFToken": getState().security.csrf_token,
		},
	};

	const body = JSON.stringify({ username: username, password: password });
	axios
		.post("/auth/login/", body, config)
		.then((res) => {
			const logoutTimer = () => setTimeout(() => {}, timeToLogout);
			logoutTimerID = logoutTimer();
			dispatch(loadUser(true));
			dispatch({
				type: LOGIN_SUCCESS,
				payload: res.data,
			});
		})
		.catch((err) => {
			dispatch({ type: LOGIN_FAILED });
		});
};

export const register = (username, email, password) => (dispatch, getState) => {
	dispatch({ type: USER_LOADING });
	const config = {
		headers: {
			"Content-Type": "application/json",
			"X-CSRFToken": getState().security.csrf_token,
		},
	};

	const body = JSON.stringify({
		username: username,
		email: email,
		password: password,
		password2: password,
	});
	axios
		.post("/auth/register/", body, config)
		.then((res) => {
			console.log(res);
			dispatch({ type: REGISTER_SUCCESS });
			toast.success("You´ve successfully created your account");
		})
		.catch((err) => {
			console.log(err);
			dispatch({ type: REGISTER_FAILED });
		});
};

// Logout User
export const logout = () => (dispatch, getState) => {
	const config = {
		success: (res) => {
			dispatch({
				type: LOGOUT_SUCCESS,
			});
			clearTimeout(logoutTimerId);
		},
		error: (err) => {
			dispatch(
				returnErrors(
					err.response.data.message,
					err.response.status,
					"LOGOUT_FAIL"
				)
			);
			dispatch({
				type: LOGOUT_FAIL,
			});
			clearTimeout(logoutTimerId);
		},
		headers: {
			"Content-Type": "application/json",
			"X-CSRFToken": getState().security.csrf_token,
		},
	};
	axios
		.post("/backend/auth/logout/", {}, config)
		.then((res) => {
			res.config.success(res);
		})
		.catch((err) => {
			if (err.response && err.response.status !== 401) {
				err.config.error(err);
			}
		});
};

export const authInterceptor = () => (dispatch, getState) => {
	// Add a request interceptor
	axios.interceptors.request.use(
		(config) => {
			const token = getState().auth.token;
			config.headers["Content-Type"] = "application/json";
			if (token) {
				config.headers["Authorization"] = `Token ${token}`;
			}
			return config;
		},
		(error) => {
			Promise.reject(error);
		}
	);

	// Add a response interceptor
	axios.interceptors.response.use(
		(response) => {
			// request was successfull
			return response;
		},
		(error) => {
			const originalRequest = error.config;
			// try to refresh the token failed
			if (error.response.status === 401 && originalRequest._retry) {
				// router.push('/login');
				return Promise.reject(error);
			}
			if (
				error.response.status === 403 &&
				originalRequest._retry &&
				!getState().auth.token
			) {
				// router.push('/login');
				return Promise.reject(error);
			}
			// token was not valid and 1st try to refresh the token
			if (
				((error.response.status === 401 && !originalRequest._retry) ||
					(error.response.status === 403 && !originalRequest._retry)) &&
				!getState().auth.authError
			) {
				originalRequest._retry = true;
				// request to refresh the token, in request-cookies is the refreshToken

				const refreshtoken_config = {
					headers: {
						"Content-Type": "application/json",
						"X-CSRFToken": getState().security.csrf_token,
					},
				};

				axios
					.post("/backend/auth/refresh-token/", {}, refreshtoken_config)
					.then((res) => {
						if (res.status === 200) {
							// clearTimeout(logoutTimerId);
							// const logoutTimer = () =>
							//   setTimeout(() => dispatch(logout()), timeToLogout);
							// logoutTimerId = logoutTimer();
							dispatch({
								type: REFRESH_TOKEN_SUCCESS,
								payload: res.data,
							});
							axios.defaults.headers.common["Authorization"] =
								"Token " + getState().auth.token;
							// request was successfull, new request with the old parameters and the refreshed token
							return axios(originalRequest)
								.then((res) => {
									originalRequest.success(res);
								})
								.catch((err) => {
									originalRequest.error(err);
								});
						}
						return Promise.reject(error);
					})
					.catch((err) => {
						// request failed, token could not be refreshed
						if (err.response) {
							// dispatch(
							//   returnErrors(err.response.data.message, err.response.status)
							// );
						}
						dispatch({
							type: AUTH_ERROR,
						});
						return Promise.reject(error);
					});
			}
			// request status was unequal to 401 or 403, no possibility to refresh the token
			return Promise.reject(error);
		}
	);
};
