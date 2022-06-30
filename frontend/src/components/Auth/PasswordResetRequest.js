import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { Button, Typography } from "@mui/material";

import { setTitle } from "../../actions/generalActions";

import { useIntl, FormattedMessage } from "react-intl";

import InputField from "../InputField";
import SubmitButton from "../SubmitButton";
import AuthWrapper from "./AuthWrapper";

import { toast } from "react-toastify";
import axios from "axios";

function PasswordReset(props) {
	const [input, setInput] = React.useState("");
	const [errors, setErrors] = React.useState("");
	const [loading, setLoading] = React.useState(false);
	const [success, setSuccess] = React.useState(false);

	const intl = useIntl();

	React.useEffect(() => {
		props.setTitle(intl.formatMessage({ id: "AUTH_PASSWORD_RESET" }));

		return () => {
			props.setTitle();
		};
	}, []);

	function handleSubmit(event) {
		event.preventDefault();

		if (validate()) {
			setLoading(true);
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
						toast.success(
							intl.formatMessage({ id: "AUTH_RESET_PASSWORD_DIALOG_SUCCESS" })
						);
					}
					setLoading(false);
					setSuccess(true);
				})
				.catch((err) => {
					setLoading(false);
				});
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
				<FormattedMessage id="AUTH_PASSWORD_RESET_TITLE" />
			</p>
			<Typography>
				<FormattedMessage id="AUTH_RESET_PASSWORD_DIALOG_DESCRIPTION" />
			</Typography>
			<form>
				<InputField
					error={errors}
					type="email"
					input={input}
					onChange={(e) => {
						setInput(e.target.value);
					}}
					onSubmit={handleSubmit}
					placeholder={intl.formatMessage({
						id: "AUTH_RESET_PASSWORD_DIALOG_EMAIL_PLACEHOLDER",
					})}
					disabled={loading || success}
					name="email"
				/>
				<SubmitButton
					loading={loading}
					success={success}
					title={intl.formatMessage({ id: "AUTH_PASSWORD_RESET" })}
					onClick={handleSubmit}
				/>
			</form>
		</AuthWrapper>
	);
}

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, { setTitle })(PasswordReset);
