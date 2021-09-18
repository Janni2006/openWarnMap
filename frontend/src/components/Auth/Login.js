import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { Link } from "react-router-dom";

import {
	Grid,
	Card,
	Hidden,
	Typography,
	Button,
	withWidth,
	isWidthUp,
} from "@material-ui/core";

import AuthWrapper from "./AuthWrapper";

import { login } from "../../actions/authActions";
import { setTitle } from "../../actions/generalActions";

import "./input.css";

import { useIntl, FormattedMessage } from "react-intl";

import SubmitButton from "../SubmitButton";

import ResetPasswordDialog from "./ResetPasswordDialog";

function Login(props) {
	const [input, setInput] = React.useState({ username: "", password: "" });
	const [errors, setErrors] = React.useState({});
	const [resetDialog, setResetDialog] = React.useState(false);

	const intl = useIntl();

	React.useEffect(() => {
		props.setTitle(intl.formatMessage({ id: "NAVBAR_LOGIN" }));

		return () => {
			props.setTitle();
		};
	}, []);

	function handleSubmit(event) {
		event.preventDefault();

		if (validate()) {
			props.login(input.username, input.password);
		}
	}

	function validate() {
		let errors = {};
		let isValid = true;

		if (!input["username"]) {
			isValid = false;
			errors["username"] = intl.formatMessage({
				id: "AUTH_LOGIN_ERROR_USERNAME",
			});
		}

		if (!input["password"]) {
			isValid = false;
			errors["password"] = intl.formatMessage({
				id: "AUTH_LOGIN_ERROR_PASSWORD",
			});
		}

		setErrors(errors);

		return isValid;
	}

	function handleDialogClose() {
		setResetDialog(false);
	}

	return (
		<>
			<AuthWrapper>
				<p
					style={{
						textTransform: "uppercase",
						marginBottom: "50px",
						color: "#008259",
						fontSize: "25px",
					}}
				>
					<FormattedMessage id="AUTH_LOGIN_TITLE" />
				</p>
				<form onSubmit={handleSubmit}>
					<div
						className={"wrapper"}
						style={{ marginLeft: "-10px", marginRight: "-10px" }}
					>
						<div className={"input-data"}>
							<input
								type="text"
								required
								onChange={(e) => {
									setInput({ ...input, username: e.target.value });
								}}
								value={input.username}
								disabled={props.progress}
								id="username"
								name="username"
							/>
							<div className={"underline"} />

							<label>
								<FormattedMessage id="AUTH_LOGIN_USERNAME_PLACEHOLDER" />
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
						className={"wrapper"}
						style={{ marginLeft: "-10px", marginRight: "-10px" }}
					>
						<div className={"input-data"}>
							<input
								type="password"
								required
								onChange={(e) => {
									setInput({ ...input, password: e.target.value });
								}}
								value={input.password}
								disabled={props.progress}
								autoComplete="new-password"
							/>
							<div className={"underline"} />

							<label>
								<FormattedMessage id="AUTH_LOGIN_PASSWORD_PLACEHOLDER" />
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
					<div style={{ display: "flex", justifyContent: "flex-start" }}>
						<SubmitButton
							loading={props.progress}
							success={props.isAuthenticated && !props.progress}
							title={intl.formatMessage({ id: "AUTH_LOGIN" })}
						/>
						<Button
							onClick={() => setResetDialog(true)}
							style={{
								height: "40px",
								background: "linear-gradient(90deg, #378d40, #008259)",
								marginTop: "25px",
								marginLeft: "15px",
								color: "white",
							}}
						>
							<FormattedMessage id="AUTH_RESET_PASSWORD_QUESTION" />
						</Button>
					</div>
				</form>
				<p style={{ marginLeft: "5px" }}>
					<FormattedMessage id="AUTH_LOGIN_QUESTION" />{" "}
					<Link
						style={{ color: "#008259", textDecoration: "none" }}
						to={"/register"}
					>
						<FormattedMessage id="AUTH_LOGIN_QUESTION_LINK" />
					</Link>
				</p>
			</AuthWrapper>
			<ResetPasswordDialog open={resetDialog} onClose={handleDialogClose} />
		</>
	);
}

Login.propTypes = {
	isAuthenticated: PropTypes.bool.isRequired,
	progress: PropTypes.bool.isRequired,
	login: PropTypes.func.isRequired,
	setTitle: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
	isAuthenticated: state.auth.isAuthenticated,
	progress: state.auth.progress,
});

export default withWidth()(
	connect(mapStateToProps, { login, setTitle })(Login)
);
