import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import {
	Step,
	Stepper,
	StepLabel,
	StepContent,
	CircularProgress,
} from "@mui/material";

import AuthWrapper from "../AuthWrapper";
import StepWrapper from "./StepWrapper";

import { register } from "../../../actions/authActions";
import { setTitle } from "../../../actions/generalActions";

import "../input.css";

import zxcvbn from "zxcvbn";

import { FormattedMessage, useIntl } from "react-intl";

import InputField from "../../InputField";
import axios from "axios";

import ErrorBoundary from "../../ErrorBoundary"; //! only for testing

import EmailUsernameInput from "./EmailUsernameInput";
import Password from "./Password";

function Register(props) {
	const [passwordScore, setPasswordScore] = React.useState(0);
	const [input, setInput] = React.useState({
		username: "",
		email: "",
		password: "",
		conf_password: "",
		firstname: "",
		lastname: "",
	});
	const [errors, setErrors] = React.useState({
		username: "",
		email: "",
		password: "",
		conf_password: "",
		firstname: "",
		lastname: "",
	});
	const [errorSteps, setErrorSteps] = React.useState(new Set());
	const [activeStep, setActiveStep] = React.useState(0);
	const intl = useIntl();

	const patternEmail = new RegExp(
		/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
	);

	React.useEffect(() => {
		props.setTitle("Register");
		return () => {
			props.setTitle();
		};
	}, []);

	React.useEffect(() => {
		for (var x = 0; x < registerContent.length; x++) {
			if (isErrorStep(x) && activeStep > x) {
				setActiveStep(x);
				return;
			}
		}
	}, [errorSteps]);

	function register(event) {
		event.preventDefault();

		if (activeStep < 4) {
			setActiveStep((prevActiveStep) => prevActiveStep + 1);
		}

		if (validate()) {
			props.register(
				input["username"],
				input["email"],
				input["password"],
				input["firstname"],
				input["lastname"],
				intl
			);
		}
	}

	React.useEffect(() => {
		setErrors({
			...errors,
			username: "",
		});
		if (!errors.email) {
			removeErrorStep(0);
		}
		setTimeout((username = input.username) => {
			if (username == input.username && username) {
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
								username: intl.formatMessage({
									id: "AUTH_ALREADY_USED_USERNAME",
								}),
							});
							addErrorStep(0);
						} else {
							setErrors({
								...errors,
								username: "",
							});
							if (!errors.email) {
								removeErrorStep(0);
							}
						}
					})
					.catch((err) => {
						console.log(err);
					});
			}
		}, 1500);
	}, [input.username]);

	React.useEffect(() => {
		const email = input.email;
		setErrors({
			...errors,
			email: "",
		});
		if (!errors.username) {
			removeErrorStep(0);
		}
		setTimeout(() => {
			if (email == input.email && email && patternEmail.test(email)) {
				const config = {
					headers: {
						"Content-Type": "application/json",
						"X-CSRFToken": props.csrf_token,
					},
				};
				const body = JSON.stringify({ email: input.email });
				axios
					.post("/backend/auth/checks/email/", body, config)
					.then((res) => {
						if (res.data.not_ocupied == false) {
							setErrors({
								...errors,
								email: intl.formatMessage({ id: "AUTH_ALREADY_USED_EMAIL" }),
							});
							addErrorStep(0);
						} else {
							setErrors({
								...errors,
								email: "",
							});
							if (!errors.username) {
								removeErrorStep(0);
							}
						}
					})
					.catch((err) => {
						console.log(err);
					});
			}
		}, 1500);
	}, [input.email]);

	React.useEffect(() => {
		if (input.errors) {
			if (zxcvbn(input.password).score < 3) {
				setErrors({
					...errors,
					password: intl.formatMessage({ id: "AUTH_PASSWORD_NOT_STRONG" }),
				});
			} else {
				setErrors({
					...errors,
					password: "",
				});
			}
		}
	}, [input.password]);

	const handleNext = () => {
		if (activeStep < registerContent.length) {
			setActiveStep((prevActiveStep) => prevActiveStep + 1);
		}
	};

	const handleBack = () => {
		if (activeStep > 0) {
			setActiveStep((prevActiveStep) => prevActiveStep - 1);
		}
	};

	const isErrorStep = (step) => {
		return errorSteps.has(step);
	};

	const addErrorStep = (step) => {
		if (!isErrorStep(step)) {
			setErrorSteps((prevError) => {
				const newError = new Set(prevError.values());
				newError.add(step);
				return newError;
			});
		}
	};

	const removeErrorStep = (step) => {
		if (isErrorStep(step)) {
			setErrorSteps((prevError) => {
				const newError = new Set(prevError.values());
				newError.delete(step);
				return newError;
			});
		}
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
		setErrorSteps(errorSteps_cache);
		return isValid;
	}

	const registerContent = [
		{
			label: intl.formatMessage({ id: "AUTH_REGISTER_STEPS_FIRST" }),
			content: (
				// <StepWrapper
				// 	handleNext={handleNext}
				// 	handleBack={handleBack}
				// 	register={register}
				// 	first
				// >
				// 	<InputField
				// 		placeholder={intl.formatMessage({
				// 			id: "AUTH_REGISTER_USERNAME_PLACEHOLDER",
				// 		})}
				// 		error={errors.username}
				// 		input={input.username}
				// 		type="text"
				// 		name="username"
				// 		onChange={(event) => {
				// 			setInput({
				// 				...input,
				// 				username: event.target.value,
				// 			});
				// 		}}
				// 		disabled={props.progress}
				// 	/>
				// 	<InputField
				// 		placeholder={intl.formatMessage({
				// 			id: "AUTH_REGISTER_EMAIL_PLACEHOLDER",
				// 		})}
				// 		error={errors.email}
				// 		input={input.email}
				// 		type="email"
				// 		name="email"
				// 		onChange={(event) => {
				// 			setInput({
				// 				...input,
				// 				email: event.target.value,
				// 			});
				// 		}}
				// 		disabled={props.progress}
				// 	/>
				// </StepWrapper>
				<EmailUsernameInput
					handleNext={handleNext}
					onChange={() => {}}
					number={0}
					addErrorStep={addErrorStep}
					removeErrorStep={removeErrorStep}
					isErrorStep={isErrorStep}
					setValues={(username, email) => {
						setInput({ ...input, username: username, email: email });
					}}
					input={{ username: input.username, email: input.email }}
				/>
			),
		},
		{
			label: intl.formatMessage({ id: "AUTH_REGISTER_STEPS_SECOND" }),
			content: (
				// <StepWrapper
				// 	handleNext={handleNext}
				// 	handleBack={handleBack}
				// 	register={register}
				// >
				// 	<InputField
				// 		type="password"
				// 		name="password"
				// 		error={errors.password}
				// 		input={input.password}
				// 		placeholder={intl.formatMessage({
				// 			id: "AUTH_REGISTER_PASSWORD_PLACEHOLDER",
				// 		})}
				// 		onChange={(e) => {
				// 			setPasswordScore(zxcvbn(e.target.value).score);
				// 			setInput({ ...input, password: e.target.value });
				// 		}}
				// 		underline={{
				// 			width: passwordScore * 25,
				// 			color:
				// 				passwordScore == 1
				// 					? "red"
				// 					: passwordScore == 2
				// 					? "orange"
				// 					: passwordScore == 3
				// 					? "yellow"
				// 					: passwordScore == 4
				// 					? "green"
				// 					: "#cccccc",
				// 		}}
				// 	/>
				// 	<InputField
				// 		type="password"
				// 		name="conf-password"
				// 		error={
				// 			errors.conf_password || input.password != input.conf_password
				// 		}
				// 		input={input.conf_password}
				// 		placeholder={intl.formatMessage({
				// 			id: "AUTH_REGISTER_CONFIRM_PASSWORD_PLACEHOLDER",
				// 		})}
				// 		onChange={(e) => {
				// 			setInput({
				// 				...input,
				// 				conf_password: e.target.value,
				// 			});
				// 		}}
				// 	/>
				// </StepWrapper>
				<Password
					handleNext={handleNext}
					handleBack={handleBack}
					onChange={() => {}}
					number={1}
					addErrorStep={addErrorStep}
					removeErrorStep={removeErrorStep}
					isErrorStep={isErrorStep}
					setValues={(password, conf_password) => {
						setInput({
							...input,
							password: password,
							conf_password: conf_password,
						});
					}}
					input={{
						password: input.password,
						conf_password: input.conf_password,
					}}
				/>
			),
		},
		{
			label: intl.formatMessage({ id: "AUTH_REGISTER_STEPS_THIRD" }),
			content: (
				<StepWrapper
					handleNext={handleNext}
					handleBack={handleBack}
					register={register}
				>
					<InputField
						type="text"
						name="lastname"
						error={errors.firstname}
						input={input.firstname}
						placeholder={intl.formatMessage({
							id: "AUTH_REGISTER_FIRSTNAME_PLACEHOLDER",
						})}
						onChange={(e) => {
							setInput({ ...input, firstname: e.target.value });
						}}
					/>
					<InputField
						type="text"
						name="lastname"
						error={errors.lastname}
						input={input.lastname}
						placeholder={intl.formatMessage({
							id: "AUTH_REGISTER_LASTNAME_PLACEHOLDER",
						})}
						onChange={(e) => {
							setInput({
								...input,
								lastname: e.target.value,
							});
						}}
					/>
				</StepWrapper>
			),
		},
		{
			label: intl.formatMessage({ id: "AUTH_REGISTER_STEPS_FOURTH" }),
			content: (
				<StepWrapper
					handleNext={handleNext}
					handleBack={handleBack}
					register={register}
					last
				>
					<InputField
						placeholder={intl.formatMessage({
							id: "AUTH_REGISTER_USERNAME_PLACEHOLDER",
						})}
						error={errors.username}
						input={input.username}
						type="text"
						name="username"
						onChange={(event) => {
							setInput({
								...input,
								username: event.target.value,
							});
						}}
						disabled={props.progress}
					/>
					<InputField
						placeholder={intl.formatMessage({
							id: "AUTH_REGISTER_EMAIL_PLACEHOLDER",
						})}
						error={errors.email}
						input={input.email}
						type="email"
						name="email"
						onChange={(event) => {
							setInput({
								...input,
								email: event.target.value,
							});
						}}
						disabled={props.progress}
					/>
					<InputField
						type="text"
						name="lastname"
						error={errors.firstname}
						input={input.firstname}
						placeholder={intl.formatMessage({
							id: "AUTH_REGISTER_FIRSTNAME_PLACEHOLDER",
						})}
						onChange={(e) => {
							setInput({ ...input, firstname: e.target.value });
						}}
						disabled={props.progress}
					/>
					<InputField
						type="text"
						name="lastname"
						error={errors.lastname}
						input={input.lastname}
						placeholder={intl.formatMessage({
							id: "AUTH_REGISTER_LASTNAME_PLACEHOLDER",
						})}
						onChange={(e) => {
							setInput({
								...input,
								lastname: e.target.value,
							});
						}}
						disabled={props.progress}
					/>
				</StepWrapper>
			),
		},
	];

	return (
		<AuthWrapper>
			<p
				style={{
					textTransform: "uppercase",
					marginBottom: "50px",
					color: "#008259",
					fontSize: "25px",
				}}
			>
				<FormattedMessage id="AUTH_REGISTER_TITLE" />
			</p>

			{activeStep == 0 ? (
				<p style={{ marginLeft: "5px", textAlign: "center" }}>
					<FormattedMessage id="AUTH_REGISTER_QUESTION" />{" "}
					<Link
						style={{ color: "#008259", textDecoration: "none" }}
						to={"/login"}
					>
						<FormattedMessage id="AUTH_REGISTER_QUESTION_LINK" />
					</Link>
				</p>
			) : null}

			<Stepper activeStep={activeStep} orientation="vertical">
				{registerContent.map((item, index) => {
					const labelProps = {};
					if (isErrorStep(index)) {
						labelProps.error = true;
					}

					return (
						<Step key={index}>
							<StepLabel {...labelProps}>{item.label}</StepLabel>
							<StepContent>{item.content}</StepContent>
						</Step>
					);
				})}
			</Stepper>
			{props.progress && (
				<></>
				// <ErrorBoundary>
				// 	<div
				// 		style={{
				// 			height: "100%",
				// 			width: "100%",
				// 			display: "flex",
				// 			justifyContent: "center",
				// 			alignItems: "center",
				// 		}}
				// 	>
				// 		<CircularProgress color="#378d40" />
				// 	</div>
				// </ErrorBoundary>
			)}
		</AuthWrapper>
	);
}

Register.propTypes = {
	progress: PropTypes.bool.isRequired,
	register: PropTypes.func.isRequired,
	setTitle: PropTypes.func.isRequired,
	csrf_token: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
	progress: state.auth.progress,
	csrf_token: state.security.csrf_token,
});

export default connect(mapStateToProps, { register, setTitle })(Register);
