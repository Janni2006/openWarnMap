import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import {
	withWidth,
	Step,
	Stepper,
	StepLabel,
	StepContent,
} from "@material-ui/core";

import AuthWrapper from "../AuthWrapper";
import StepWrapper from "./StepWrapper";

import { register } from "../../../actions/authActions";
import { setTitle } from "../../../actions/generalActions";

import "../input.css";

import zxcvbn from "zxcvbn";

import { FormattedMessage, useIntl } from "react-intl";

import { motion, AnimateSharedLayout } from "framer-motion";
import InputField from "../../InputField";
import axios from "axios";

function Register(props) {
	const [passwordScore, setPasswordScore] = React.useState(0);
	const [input, setInput] = React.useState({
		username: "",
		email: "",
		password: "",
		conf_password: "",
	});
	const [errors, setErrors] = React.useState({
		username: "",
		email: "",
		password: "",
		conf_password: "",
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
				intl
			);
		}
	}

	React.useEffect(() => {
		console.log(input);
	}, [input]);

	React.useEffect(() => {
		setErrors({
			...errors,
			username: "",
		});
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
						console.log(res.data);
						if (res.data.not_ocupied == false) {
							setErrors({
								...errors,
								username: intl.formatMessage({
									id: "AUTH_ALREADY_USED_USERNAME",
								}),
							});
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
		setTimeout(() => {
			if (email == input.email && email && patternEmail.test(email)) {
				const config = {
					headers: {
						"Content-Type": "application/json",
						"X-CSRFToken": props.csrf_token,
					},
				};
				const body = JSON.stringify({ email: input.email });
				console.log(body);
				axios
					.post("/backend/auth/checks/email/", body, config)
					.then((res) => {
						console.log(res.data);
						if (res.data.not_ocupied == false) {
							setErrors({
								...errors,
								email: intl.formatMessage({ id: "AUTH_ALREADY_USED_EMAIL" }),
							});
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
		if (activeStep < 4) {
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

	function validate() {
		let errors = {};
		let isValid = true;

		if (!input["username"]) {
			isValid = false;
			errors["username"] = intl.formatMessage({
				id: "AUTH_REGISTER_ERROR_USERNAME_UNDEFINED",
			});
		}

		if (!input["email"]) {
			isValid = false;
			errors["email"] = intl.formatMessage({
				id: "AUTH_REGISTER_ERROR_EMAIL_UNDEFINED",
			});
		}

		if (!input["password"]) {
			isValid = false;
			errors["password"] = intl.formatMessage({
				id: "AUTH_REGISTER_ERROR_PASSWORD_UNDEFINED",
			});
		}

		if (!input["conf_password"]) {
			isValid = false;
			errors["conf_password"] = intl.formatMessage({
				id: "AUTH_REGISTER_ERROR_CONFIRM_PASSWORD_UNDEFINED",
			});
		}

		if (input["email"]) {
			if (!patternEmail.test(input["email"])) {
				isValid = false;
				errors["email"] = intl.formatMessage({
					id: "AUTH_REGISTER_ERROR_EMAIL_INVALID",
				});
			}
		}

		if (input["username"]) {
			if (patternEmail.test(input["username"])) {
				isValid = false;
				errors["username"] = intl.formatMessage({
					id: "AUTH_REGISTER_ERROR_USERNAME_INVALID",
				});
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
				console.log(res.data);
				if (res.data.not_ocupied == false) {
					errors["username"] = intl.formatMessage({
						id: "AUTH_ALREADY_USED_USERNAME",
					});
					isValid = false;
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
				console.log(res.data);
				if (res.data.not_ocupied == false) {
					errors["email"] = intl.formatMessage({
						id: "AUTH_ALREADY_USED_EMAIL",
					});
					isValid = false;
				}
			})
			.catch((err) => {
				console.log(err);
			});

		if (zxcvbn(input.password).score < 3) {
			errors["password"] = intl.formatMessage({
				id: "AUTH_PASSWORD_NOT_STRONG",
			});
			addErrorStep(2);
			isValid = false;
		}

		setErrors(errors);

		return isValid;
	}

	const registerContent = [
		{
			label: intl.formatMessage({ id: "AUTH_REGISTER_STEPS_FIRST" }),
			content: (
				<StepWrapper
					handleNext={handleNext}
					handleBack={handleBack}
					register={register}
					first
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
				</StepWrapper>
			),
		},
		{
			label: intl.formatMessage({ id: "AUTH_REGISTER_STEPS_SECOND" }),
			content: (
				<StepWrapper
					handleNext={handleNext}
					handleBack={handleBack}
					register={register}
				>
					<InputField
						type="password"
						name="password"
						error={errors.password}
						input={input.password}
						placeholder={intl.formatMessage({
							id: "AUTH_REGISTER_PASSWORD_PLACEHOLDER",
						})}
						onChange={(e) => {
							setPasswordScore(zxcvbn(e.target.value).score);
							setInput({ ...input, password: e.target.value });
						}}
						underline={{
							width: passwordScore * 25,
							color:
								passwordScore == 1
									? "red"
									: passwordScore == 2
									? "orange"
									: passwordScore == 3
									? "yellow"
									: passwordScore == 4
									? "green"
									: "#cccccc",
						}}
					/>
					<InputField
						type="password"
						name="conf-password"
						error={
							errors.conf_password || input.password != input.conf_password
						}
						input={input.conf_password}
						placeholder={intl.formatMessage({
							id: "AUTH_REGISTER_CONFIRM_PASSWORD_PLACEHOLDER",
						})}
						onChange={(e) => {
							setInput({
								...input,
								conf_password: e.target.value,
							});
						}}
					/>
				</StepWrapper>
			),
		},
		{
			label: intl.formatMessage({ id: "AUTH_REGISTER_STEPS_THIRD" }),
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
				</StepWrapper>
			),
		},
	];

	return (
		<AuthWrapper>
			<div style={{ margin: "0px -20%" }}>
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
					{registerContent.map((item, index) => (
						<Step key={index}>
							<StepLabel>{item.label}</StepLabel>
							<StepContent>{item.content}</StepContent>
						</Step>
					))}
				</Stepper>
			</div>
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

export default connect(mapStateToProps, { register, setTitle })(
	withWidth()(Register)
);
