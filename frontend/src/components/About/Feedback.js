import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { Button } from "@material-ui/core";

import {
	Typography,
	Dialog,
	DialogTitle,
	DialogActions,
	Grid,
} from "@material-ui/core";

import { useIntl, FormattedMessage } from "react-intl";

import SubmitButton from "../SubmitButton";

import { toast } from "react-toastify";

import "./input.css";

import axios from "axios";

function Feedback(props) {
	const { onClose, open } = props;

	const [input, setInput] = React.useState({
		email: "",
		nickname: "",
		feedback: "",
	});
	const [errors, setErrors] = React.useState({
		email: null,
		nickname: null,
		feedback: null,
	});

	const intl = useIntl();

	React.useEffect(() => {
		console.log(input);
	}, [input]);

	React.useEffect(() => {
		if (props.isAuthenticated) {
			setInput({
				...input,
				email: props.user.email,
				nickname: props.user.username,
			});
		}
	}, [props.user, props.isAuthenticated]);

	function handleSubmit(event) {
		event.preventDefault();

		if (validate()) {
			const config = {
				headers: {
					"Content-Type": "application/json",
					"X-CSRFToken": props.csrf,
				},
			};

			const body = JSON.stringify({ email: input });

			// axios
			// 	.post("/react/login/reset/", body, config)
			// 	.then((res) => {
			// 		if (res.status == 200) {
			// 			handleClose();
			// 			toast.success(
			// 				intl.formatMessage({ id: "AUTH_RESET_PASSWORD_SUCCESS" })
			// 			);
			// 		}
			// 	})
			// 	.catch((err) => {});
		}
	}

	function validate() {
		let isValid = true;
		var c_errors = {
			email: null,
			nickname: null,
			feedback: null,
		};

		if (!input.email) {
			isValid = false;
			c_errors = {
				...c_errors,
				email: intl.formatMessage({ id: "FEEDBACK_EMAIL_UNDEFINED" }),
			};
		}

		if (!input.nickname) {
			isValid = false;
			c_errors = {
				...c_errors,
				nickname: intl.formatMessage({ id: "FEEDBACK_NICKNAME_UNDEFINED" }),
			};
		}

		if (!input.feedback) {
			isValid = false;
			c_errors = {
				...c_errors,
				feedback: intl.formatMessage({ id: "FEEDBACK_FEEDBACK_UNDEFINED" }),
			};
		}

		var patternEmail = new RegExp(
			/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
		);

		if (input.email) {
			if (!patternEmail.test(input.email)) {
				isValid = false;
				c_errors = {
					...c_errors,
					email: intl.formatMessage({ id: "FEEDBACK_INVALID_EMAIL" }),
				};
			}
		}

		if (input.nickname) {
			if (patternEmail.test(input.nickname)) {
				isValid = false;
				c_errors = {
					...c_errors,
					nickname: intl.formatMessage({ id: "FEEDBACK_INVALID_NICKNAME" }),
				};
			}
		}

		if (isValid) {
			setErrors({
				email: null,
				nickname: null,
				feedback: null,
			});
		} else {
			setErrors(c_errors);
		}

		return isValid;
	}

	const handleClose = () => {
		onClose();
	};

	return (
		<Dialog open={open} onClose={handleClose}>
			<DialogTitle>
				<FormattedMessage id="FEEDBACK_TITLE" />
			</DialogTitle>
			<div style={{ padding: "0px 24px" }}>
				<Typography>
					<FormattedMessage id="FEEDBACK_DESCRIPTION" />
				</Typography>
				<Grid container style={{ marginTop: "25px" }}>
					{!props.isAuthenticated ? (
						<>
							<Grid item xs={12} sm={6}>
								<div className="wrapper">
									<div className="input-data">
										<input
											type="email"
											required
											onChange={(event) => {
												setInput({ ...input, email: event.target.value });
											}}
											value={input.email}
											id="email"
											name="email"
											// disabled={loading}
										/>
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
										) : (
											<div className="underline" />
										)}
										<label>
											<FormattedMessage id="FEEDBACK_EMAIL" />
										</label>
									</div>
									<div
										style={{
											color: "red",
											fontSize: "12px",
										}}
									>
										{errors.email}
									</div>
								</div>
							</Grid>
							<Grid item xs={12} sm={6}>
								<div className="wrapper">
									<div className="input-data">
										<input
											type="text"
											required
											onChange={(event) => {
												setInput({ ...input, nickname: event.target.value });
											}}
											value={input.nickname}
											id="username"
											name="username"
											// disabled={loading}
										/>
										{errors.nickname ? (
											<div
												style={{
													height: "2px",
													width: "100%",
													backgroundColor: "red",
													position: "absolute",
													bottom: "2px",
												}}
											/>
										) : (
											<div className="underline" />
										)}

										<label>
											<FormattedMessage id="FEEDBACK_NICKNAME" />
										</label>
									</div>
									<div
										style={{
											color: "red",
											fontSize: "12px",
										}}
									>
										{errors.nickname}
									</div>
								</div>
							</Grid>
						</>
					) : null}
					<Grid item xs={12} style={{ padding: "10px 10px 2.5px" }}>
						<textarea
							style={{
								width: "calc(100% - 10px)",
								minWidth: "calc(100% - 10px)",
								maxWidth: "calc(100% - 10px)",
								height: "25vh",
								minHeight: "25vh",
								maxHeight: "50vh",
								fontSize: "15px",
								outline: "none",
								padding: "2.5px 5px",
								borderColor: errors.feedback ? "red" : "#3f3f3f",
							}}
							onChange={(e) => setInput({ ...input, feedback: e.target.value })}
						/>
						<div
							style={{
								color: "red",
								fontSize: "12px",
							}}
						>
							{errors.feedback}
						</div>
					</Grid>
				</Grid>
			</div>

			<DialogActions>
				<Button
					style={{
						padding: "7.5px 25px",
						color: "#3f3f3f",
						fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
						fontSize: "15px",
						textTransform: "uppercase",
						borderRadius: "5px",
						border: "none",
						height: "40px",
						marginTop: "25px",
					}}
					onClick={handleClose}
				>
					<FormattedMessage id="CANCEL" />
				</Button>
				<SubmitButton
					onClick={handleSubmit}
					title={intl.formatMessage({ id: "SUBMIT" })}
				/>
			</DialogActions>
		</Dialog>
	);
}

Feedback.propTypes = {
	csrf: PropTypes.string.isRequired,
	isAuthenticated: PropTypes.bool.isRequired,
	user: PropTypes.object,
};

const mapStateToProps = (state) => ({
	csrf: state.security.csrf_token,
	isAuthenticated: state.auth.isAuthenticated,
	user: state.auth.user,
});

export default connect(mapStateToProps)(Feedback);
