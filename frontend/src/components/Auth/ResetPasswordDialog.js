import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { Link } from "react-router-dom";

import { Button } from "@material-ui/core";

import {
	Card,
	Typography,
	Dialog,
	DialogTitle,
	DialogActions,
} from "@material-ui/core";

import { useIntl, FormattedMessage, FormattedTime } from "react-intl";

import SubmitButton from "../SubmitButton";

import { toast } from "react-toastify";

import axios from "axios";

function ResetPassword(props) {
	const { onClose, open } = props;

	const [input, setInput] = React.useState("");
	const [errors, setErrors] = React.useState("");

	const intl = useIntl();

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

			axios
				.post("/backend/auth/login/reset/", body, config)
				.then((res) => {
					if (res.status == 200) {
						handleClose();
						toast.success(
							intl.formatMessage({ id: "AUTH_RESET_PASSWORD_SUCCESS" })
						);
					}
				})
				.catch((err) => {});
		}
	}

	function validate() {
		let isValid = true;

		if (!input) {
			isValid = false;
			setErrors(
				intl.formatMessage({
					id: "AUTH_REGISTER_ERROR_EMAIL_UNDEFINED",
				})
			);
		}

		var patternEmail = new RegExp(
			/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
		);

		if (input) {
			if (!patternEmail.test(input)) {
				isValid = false;
				setErrors(
					intl.formatMessage({
						id: "AUTH_REGISTER_ERROR_EMAIL_INVALID",
					})
				);
			}
		}

		if (isValid) {
			setErrors("");
		}

		return isValid;
	}

	const handleClose = () => {
		onClose();
	};

	return (
		<Dialog open={open} onClose={handleClose}>
			<DialogTitle>
				<FormattedMessage id="AUTH_RESET_PASSWORD" />
			</DialogTitle>
			<div style={{ padding: "0px 24px" }}>
				<Typography>
					<FormattedMessage id="AUTH_RESET_PASSWORD_DESCRIPTION" />
				</Typography>
				<input
					type="email"
					name="email"
					placeholder={intl.formatMessage({
						id: "AUTH_RESET_PASSWORD_EMAIL_PLACEHOLDER",
					})}
					value={input}
					onChange={(event) => {
						setInput(event.target.value);
					}}
					onSubmit={handleSubmit}
					style={{
						height: "45px",
						width: "calc(100% - 50px)",
						backgroundColor: props.progress ? "#dddddd" : "#faf6f2",
						border: "none",
						padding: "5px 25px",
						marginTop: "25px",
					}}
					id="email"
					disabled={props.progress}
				/>
				<div
					style={{
						color: "red",
						fontSize: "12px",
					}}
				>
					{errors}
				</div>
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

ResetPassword.propTypes = { csrf: PropTypes.string.isRequired };

const mapStateToProps = (state) => ({ csrf: state.security.csrf_toek });

export default connect(mapStateToProps)(ResetPassword);
