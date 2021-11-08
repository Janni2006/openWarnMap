import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import { Grid, Card, Hidden, Typography, isWidthUp } from "@mui/material";

import { register } from "../../actions/authActions";
import { setTitle } from "../../actions/generalActions";

import "./input.css";

import zxcvbn from "zxcvbn";

import AuthWrapper from "./AuthWrapper";

import { FormattedMessage, useIntl } from "react-intl";

import { motion, AnimateSharedLayout } from "framer-motion";

import SubmitButton from "../SubmitButton";
import axios from "axios";

// FIXME checkout https://mui.com/components/use-media-query/#migrating-from-withwidth
const withWidth = () => (WrappedComponent) => (props) => <WrappedComponent {...props} width="xs" />;

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
	const [cardHeight, setCardHeight] = React.useState(0);
	const cardRef = React.useRef(null);
	const intl = useIntl();

	const patternEmail = new RegExp(
		/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
	);

	React.useEffect(() => {
		props.setTitle("Register");
		setCardHeight(cardRef.current.offsetHeight);
		return () => {
			props.setTitle();
		};
	}, []);

	React.useEffect(() => {
		if (cardRef && cardRef.current.offsetHeight !== cardHeight) {
			setCardHeight(cardRef.current.offsetHeight);
		}
	}, [cardRef]);

	function handleSubmit(event) {
		event.preventDefault();

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
		const username = input.username;
		setErrors({
			...errors,
			username: "",
		});
		setTimeout(() => {
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
				JSON.stringify({ username: username }),
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
			isValid = false;
		}

		setErrors(errors);

		return isValid;
	}

	return (
		<AuthWrapper>
			{" "}
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
			<form onSubmit={handleSubmit}>
				<div
					className="wrapper"
					style={{ marginLeft: "-10px", marginRight: "-10px" }}
				>
					<div className="input-data">
						<input
							type="text"
							name="username"
							required
							value={input.username}
							onChange={(event) => {
								setInput({ ...input, username: event.target.value });
							}}
							id="username"
							disabled={props.progress}
						/>
						<div className="underline" />
						{errors.username ? (
							<div
								style={{
									height: "2px",
									width: "100%",
									backgroundColor: "red",
									position: "absolute",
									bottom: "2px",
								}}
							/>
						) : null}
						<label>
							<FormattedMessage id="AUTH_REGISTER_USERNAME_PLACEHOLDER" />
						</label>
					</div>
				</div>

				<div
					style={{
						color: "red",
						fontSize: "12px",
					}}
				>
					{errors.username}
				</div>
				<div
					className="wrapper"
					style={{ marginLeft: "-10px", marginRight: "-10px" }}
				>
					<div className="input-data">
						<input
							type="email"
							name="email"
							required
							value={input.email}
							onChange={(event) => {
								setInput({ ...input, email: event.target.value });
							}}
							id="email"
							disabled={props.progress}
						/>
						<div className="underline" />
						{errors.email ? (
							<div
								style={{
									height: "2px",
									width: "100%",
									backgroundColor: "red",
									position: "absolute",
									bottom: "2px",
								}}
							/>
						) : null}
						<label>
							<FormattedMessage id="AUTH_REGISTER_EMAIL_PLACEHOLDER" />
						</label>
					</div>
				</div>
				<div
					style={{
						color: "red",
						fontSize: "12px",
					}}
				>
					{errors.email}
				</div>
				<div
					className={"wrapper"}
					style={{ marginLeft: "-10px", marginRight: "-10px" }}
				>
					<div className={"input-data"}>
						<input
							type="password"
							required
							onChange={(e) => {
								setPasswordScore(zxcvbn(e.target.value).score);
								setInput({ ...input, password: e.target.value });
							}}
							value={input.password}
							disabled={props.progress}
							autoComplete="new-password"
						/>
						<div className={"underline"} />
						<AnimateSharedLayout>
							<motion.div
								layoutId="password_score_underline"
								style={{
									height: "2px",
									width: `${passwordScore * 25}%`,
									backgroundColor:
										passwordScore == 1
											? "red"
											: passwordScore == 2
											? "orange"
											: passwordScore == 3
											? "yellow"
											: passwordScore == 4
											? "green"
											: "#cccccc",
									position: "absolute",
									bottom: "2px",
								}}
							/>
						</AnimateSharedLayout>

						<label>
							<FormattedMessage id="AUTH_REGISTER_PASSWORD_PLACEHOLDER" />
						</label>
					</div>
				</div>
				<div
					style={{
						color: "red",
						fontSize: "12px",
					}}
				>
					{errors.password}
				</div>
				<div
					className={"wrapper"}
					style={{ marginLeft: "-10px", marginRight: "-10px" }}
				>
					<div className={"input-data"}>
						<input
							type="password"
							required
							onChange={(e) => {
								setInput({ ...input, conf_password: e.target.value });
							}}
							value={input.conf_password}
							disabled={props.progress}
							autoComplete="new-password"
						/>
						<div className={"underline"} />
						{(input.password != input.conf_password) | errors.conf_password ? (
							<div
								style={{
									height: "2px",
									width: "100%",
									backgroundColor: "red",
									position: "absolute",
									bottom: "2px",
								}}
							/>
						) : null}

						<label>
							<FormattedMessage id="AUTH_REGISTER_CONFIRM_PASSWORD_PLACEHOLDER" />
						</label>
					</div>
				</div>
				<div
					style={{
						color: "red",
						fontSize: "12px",
					}}
				>
					{errors.conf_password}
				</div>
				<SubmitButton
					loading={props.progress}
					success={false}
					title={intl.formatMessage({ id: "AUTH_REGISTER" })}
				/>
			</form>
			<p style={{ marginLeft: "5px" }}>
				<FormattedMessage id="AUTH_REGISTER_QUESTION" />{" "}
				<Link
					style={{ color: "#008259", textDecoration: "none" }}
					to={"/login"}
				>
					<FormattedMessage id="AUTH_REGISTER_QUESTION_LINK" />
				</Link>
			</p>
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
