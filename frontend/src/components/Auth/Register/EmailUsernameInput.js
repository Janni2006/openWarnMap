import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import StepWrapper from "./StepWrapper";

import "../input.css";

import zxcvbn from "zxcvbn";

import { useIntl } from "react-intl";

import InputField from "../../InputField";
import axios from "axios";

function EmailUsernameInputfield(props) {
	const [input, setInput] = React.useState({
		username: { state: "", valid: false, progress: false },
		email: { state: "", valid: false, progress: false },
	});
	const [valid, setValid] = React.useState({ username: false, email: false });
	const [progress, setProgress] = React.useState({
		username: false,
		email: false,
	});
	const [errors, setErrors] = React.useState({
		username: { present: false, msg: "" },
		email: { present: false, msg: "" },
	});
	// const [errorSteps, setErrorSteps] = React.useState(new Set());
	const intl = useIntl();

	const patternEmail = new RegExp(
		/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
	);

	const typeWatch = () => {
		var timer = 0;
		return function (callback, ms) {
			clearTimeout(timer);
			timer = setTimeout(callback, ms);
		};
	};

	React.useEffect(() => {
		if (input.username == "" && input.email == "") {
			setInput({
				...input,
				username: { ...input.username, state: props.input.username },
				email: { ...input.email, state: props.input.email },
			});
		}
	}, [props.input]);

	React.useEffect(() => {
		if (errors.email.present || errors.username.present) {
			if (!props.isErrorStep(props.number)) {
				props.addErrorStep(props.number);
			}
		} else {
			if (props.isErrorStep(props.number)) {
				props.removeErrorStep(props.number);
			}
		}
	}, [errors]);

	React.useEffect(() => {
		if (input.username.state == "") {
			setValid({ ...valid, username: false });
		} else {
			setErrors({
				...errors,
				username: { msg: "", present: false },
			});
			// setInput({ ...input, username: { ...input.username, progress: true } });
			setTimeout((username = input.username.state) => {
				if (username == input.username.state && username) {
					const config = {
						headers: {
							"Content-Type": "application/json",
							"X-CSRFToken": props.csrf_token,
						},
					};
					const body = JSON.stringify({ username: username });
					axios
						.post("/backend/auth/checks/username/", body, config)
						.then((res) => {
							if (res.data.not_ocupied == false) {
								setErrors({
									...errors,
									username: {
										msg: intl.formatMessage({
											id: "AUTH_ALREADY_USED_USERNAME",
										}),
										present: true,
									},
								});
								setProgress({ ...progress, username: false });
								setValid({ ...valid, username: false });
							} else {
								setErrors({
									...errors,
									username: { present: false, msg: "" },
								});
								setValid({ ...valid, username: true });
								setProgress({ ...progress, username: false });
							}
							console.log(username, input.username.state);
						})
						.catch((err) => {
							console.log(err);
						});
				}
			}, 1500);
			console.log(input.username.state);
		}
	}, [input.username.state]);

	React.useEffect(() => {
		const email = input.email.state;
		if (email == "") {
			setValid({ ...valid, email: false });
		} else {
			setErrors({
				...errors,
				email: { msg: "", present: false },
			});
			setInput({ ...input, email: { ...input.email, progress: true } });
			setProgress({ ...progress, email: true });
			setTimeout(() => {
				if (email == input.email.state && email && patternEmail.test(email)) {
					const config = {
						headers: {
							"Content-Type": "application/json",
							"X-CSRFToken": props.csrf_token,
						},
					};
					const body = JSON.stringify({ email: input.email.state });
					axios
						.post("/backend/auth/checks/email/", body, config)
						.then((res) => {
							if (res.data.not_ocupied == false) {
								setErrors({
									...errors,
									email: {
										msg: intl.formatMessage({ id: "AUTH_ALREADY_USED_EMAIL" }),
										present: true,
									},
								});
								setValid({ ...valid, email: false });
							} else {
								setErrors({
									...errors,
									email: { present: false, msg: "" },
								});
								setValid({ ...valid, email: true });
							}
							console.log(email, input.email.state);
							setProgress({ ...progress, email: false });
							// setInput({ ...input, email: { ...input.email, progress: false } });
						})
						.catch((err) => {
							console.log(err);
						});
				}
			}, 1500);
		}
	}, [input.email.state]);

	const handleNext = () => {
		props.setValues(input.username.state, input.email.state);
		props.handleNext();
	};

	function validate() {
		let errorSteps_cache = new Set();
		let errors = {};
		let isValid = true;

		if (!input["username"]) {
			isValid = false;
			errors["username"] = intl.formatMessage({
				id: "AUTH_REGISTER_ERROR_USERNAME_UNDEFINED",
			});
			if (!errorSteps_cache.has(0)) {
				errorSteps_cache.add(0);
			}
		}

		if (!input["email"]) {
			isValid = false;
			errors["email"] = intl.formatMessage({
				id: "AUTH_REGISTER_ERROR_EMAIL_UNDEFINED",
			});
			if (!errorSteps_cache.has(0)) {
				errorSteps_cache.add(0);
			}
		}

		if (!input["password"]) {
			isValid = false;
			errors["password"] = intl.formatMessage({
				id: "AUTH_REGISTER_ERROR_PASSWORD_UNDEFINED",
			});
			if (!errorSteps_cache.has(1)) {
				errorSteps_cache.add(1);
			}
		}

		if (!input["conf_password"]) {
			isValid = false;
			errors["conf_password"] = intl.formatMessage({
				id: "AUTH_REGISTER_ERROR_CONFIRM_PASSWORD_UNDEFINED",
			});
			if (!errorSteps_cache.has(1)) {
				errorSteps_cache.add(1);
			}
		}

		if (input["email"]) {
			if (!patternEmail.test(input["email"])) {
				isValid = false;
				errors["email"] = intl.formatMessage({
					id: "AUTH_REGISTER_ERROR_EMAIL_INVALID",
				});
				if (!errorSteps_cache.has(0)) {
					errorSteps_cache.add(0);
				}
			}
		}

		if (input["username"]) {
			if (patternEmail.test(input["username"])) {
				isValid = false;
				errors["username"] = intl.formatMessage({
					id: "AUTH_REGISTER_ERROR_USERNAME_INVALID",
				});
				if (!errorSteps_cache.has(0)) {
					errorSteps_cache.add(0);
				}
			}
		}

		if (input["password"] !== input["conf_password"]) {
			isValid = false;
			errors["password"] = intl.formatMessage({
				id: "AUTH_REGISTER_ERROR_PASSWORD_NO_MATCH",
			});
			errors["conf_password"] = intl.formatMessage({
				id: "AUTH_REGISTER_ERROR_PASSWORD_NO_MATCH",
			});
			if (!errorSteps_cache.has(1)) {
				errorSteps_cache.add(1);
			}
		}

		const config = {
			headers: {
				"Content-Type": "application/json",
				"X-CSRFToken": props.csrf_token,
			},
		};

		axios
			.post(
				"/backend/auth/checks/username/",
				JSON.stringify({ username: input.username }),
				config
			)
			.then((res) => {
				if (res.data.not_ocupied == false) {
					errors["username"] = intl.formatMessage({
						id: "AUTH_ALREADY_USED_USERNAME",
					});
					isValid = false;
					if (!errorSteps_cache.has(0)) {
						errorSteps_cache.add(0);
					}
				}
			})
			.catch((err) => {
				console.log(err);
			});

		axios
			.post(
				"/backend/auth/checks/email/",
				JSON.stringify({ email: input.email }),
				config
			)
			.then((res) => {
				if (res.data.not_ocupied == false) {
					errors["email"] = intl.formatMessage({
						id: "AUTH_ALREADY_USED_EMAIL",
					});
					isValid = false;
					if (!errorSteps_cache.has(0)) {
						errorSteps_cache.add(0);
					}
				}
			})
			.catch((err) => {
				console.log(err);
			});

		if (zxcvbn(input.password).score < 2) {
			errors["password"] = intl.formatMessage({
				id: "AUTH_PASSWORD_NOT_STRONG",
			});
			if (!errorSteps_cache.has(1)) {
				errorSteps_cache.add(1);
			}
			isValid = false;
		}

		setErrors(errors);
		// setErrorSteps(errorSteps_cache);
		return isValid;
	}

	React.useEffect(() => {
		console.log(valid);
	}, [valid]);

	return (
		<StepWrapper
			handleNext={handleNext}
			first
			disabled={!valid.username || !valid.email}
		>
			<InputField
				placeholder={intl.formatMessage({
					id: "AUTH_REGISTER_USERNAME_PLACEHOLDER",
				})}
				error={errors.username.msg}
				input={input.username.state}
				type="text"
				name="username"
				onChange={(event) => {
					setInput({
						...input,
						username: {
							progress: true,
							valid: false,
							state: event.target.value,
						},
					});
				}}
				disabled={props.progress}
				onKeyUp={() => {
					typeWatch(() => {
						console.log("Hi");
					}, 1000);
				}}
				progress={progress.username}
				valid={valid.username}
				underline={{
					width: valid.username ? 100 : 0,
					color: valid.username ? "green" : null,
				}}
				autoComplete="username"
			/>
			<InputField
				placeholder={intl.formatMessage({
					id: "AUTH_REGISTER_EMAIL_PLACEHOLDER",
				})}
				error={errors.email.msg}
				input={input.email.state}
				type="email"
				name="email"
				onChange={(event) => {
					setInput({
						...input,
						email: { ...input.email, state: event.target.value },
					});
				}}
				disabled={props.progress}
				progress={progress.email}
				valid={valid.email}
				underline={{
					width: valid.email ? 100 : 0,
					color: valid.email ? "green" : null,
				}}
				autoComplete="email"
			/>
		</StepWrapper>
	);
}

EmailUsernameInputfield.propTypes = {
	progress: PropTypes.bool.isRequired,
	csrf_token: PropTypes.string.isRequired,
	handleNext: PropTypes.func.isRequired,
	number: PropTypes.number.isRequired,
	addErrorStep: PropTypes.func.isRequired,
	removeErrorStep: PropTypes.func.isRequired,
	setValues: PropTypes.func.isRequired,
	input: PropTypes.shape({
		username: PropTypes.string.isRequired,
		email: PropTypes.string.isRequired,
	}),
};

const mapStateToProps = (state) => ({
	progress: state.auth.progress,
	csrf_token: state.security.csrf_token,
});

export default connect(mapStateToProps)(EmailUsernameInputfield);
