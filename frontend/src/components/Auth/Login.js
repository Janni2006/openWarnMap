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

import { login } from "../../actions/authActions";
import { setTitle } from "../../actions/generalActions";

import { useIntl, FormattedMessage } from "react-intl";

import SubmitButton from "../SubmitButton";

import ResetPasswordDialog from "./ResetPasswordDialog";

function Login(props) {
	const cardRef = React.useRef(null);
	const [input, setInput] = React.useState({ username: "", password: "" });
	const [errors, setErrors] = React.useState({});
	const [cardHeight, setCardHeight] = React.useState(0);
	const [resetDialog, setResetDialog] = React.useState(false);

	const intl = useIntl();

	React.useEffect(() => {
		props.setTitle(intl.formatMessage({ id: "NAVBAR_LOGIN" }));
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
			<div
				style={{
					width: "100%",
					minHeight: "calc(100vh - 90px)",
					height: "100%",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				<Card
					style={{
						borderRadius: "15px",
						height: "100%",
						maxWidth: "1200px",
						width: "calc(100% - 14%)",
						margin: "50px 0px",
					}}
				>
					<Grid container>
						<Hidden smDown>
							<Grid
								item
								md={5}
								xs={12}
								style={{
									background: "linear-gradient(90deg, #eb334a, #f45c43)",
									padding: "100px 50px",
									height: `${cardHeight + 32}px`,
									marginBottom: "-32px",
									position: "relative",
								}}
							>
								<div
									style={{
										position: "absolute",
										transform: "translate(0%, -50%)",
										top: "50%",
										width: "calc(100% - 100px)",
										marginTop: "-32px",
									}}
								>
									<Typography
										style={{
											width: "100%",
											textAlign: "center",
											fontFamily: "sans-serif",
											color: "white",
											fontWeight: "300",
											fontSize: isWidthUp("lg", props.width) ? "25px" : "20px",
										}}
									>
										<FormattedMessage id="AUTH_TITLE" />
									</Typography>
									<Typography
										style={{
											width: "100%",
											textAlign: "center",
											fontFamily: "sans-serif",
											color: "white",
											fontWeight: "300",
											fontSize: isWidthUp("lg", props.width) ? "50px" : "40px",
											margin: "0px",
										}}
									>
										openWarnMap
									</Typography>
									<Typography
										style={{
											width: "100%",
											textAlign: "center",
											fontFamily: "sans-serif",
											color: "white",
											fontWeight: "300",
											fontSize: isWidthUp("lg", props.width)
												? "16.5px"
												: "14px",
											marginTop: "50px",
										}}
									>
										<FormattedMessage id="AUTH_DESCRIPTION" />
									</Typography>
								</div>
							</Grid>
						</Hidden>

						<Grid
							item
							md={7}
							xs={12}
							style={{ padding: "50px 10%", height: "100%" }}
							ref={cardRef}
						>
							<p
								style={{
									textTransform: "uppercase",
									marginBottom: "50px",
									color: "#f45c43",
									fontSize: "25px",
								}}
							>
								<FormattedMessage id="AUTH_LOGIN_TITLE" />
							</p>
							<form onSubmit={handleSubmit}>
								<input
									type="text"
									name="username"
									placeholder={intl.formatMessage({
										id: "AUTH_LOGIN_USERNAME_PLACEHOLDER",
									})}
									value={input.username}
									onChange={(event) => {
										setInput({ ...input, username: event.target.value });
									}}
									style={{
										height: "45px",
										width: "calc(100% - 50px)",
										backgroundColor: props.progress ? "#dddddd" : "#faf6f2",
										border: "none",
										padding: "5px 25px",
									}}
									id="username"
									disabled={props.progress}
								/>
								<div
									style={{
										color: "red",
										fontSize: "12px",
									}}
								>
									{errors.username}
								</div>
								<input
									type="password"
									name="password"
									placeholder={intl.formatMessage({
										id: "AUTH_LOGIN_PASSWORD_PLACEHOLDER",
									})}
									value={input.password}
									onChange={(event) => {
										setInput({ ...input, password: event.target.value });
									}}
									style={{
										height: "45px",
										width: "calc(100% - 50px)",
										backgroundColor: props.progress ? "#dddddd" : "#faf6f2",
										border: "none",
										padding: "5px 25px",
										marginTop: "25px",
									}}
									id="password"
									disabled={props.progress}
								/>
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
											background: "linear-gradient(90deg, #eb334a, #f45c43)",
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
									style={{ color: "#f45c43", textDecoration: "none" }}
									to={"/register"}
								>
									<FormattedMessage id="AUTH_LOGIN_QUESTION_LINK" />
								</Link>
							</p>
						</Grid>
					</Grid>
				</Card>
			</div>
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
