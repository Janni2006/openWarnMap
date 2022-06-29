import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { withRouter } from "react-router-dom";

import zxcvbn from "zxcvbn";

import { Button } from "@mui/material";

import { setTitle } from "../../actions/generalActions";

import { useIntl, FormattedMessage } from "react-intl";

import { CircularProgress } from "@mui/material";

import InputField from "../InputField";
import SubmitButton from "../SubmitButton";
import AuthWrapper from "./AuthWrapper";

import axios from "axios";

function PasswordReset(props, { match }) {
	const [checkRunning, setCheckRunning] = React.useState(true);
	const [linkValid, setLinkValid] = React.useState(false);
	const [passwordScore, setPasswordScore] = React.useState(0);
	const [input, setInput] = React.useState({ password: "", conf_password: "" });
	const [errors, setErrors] = React.useState({
		password: "",
		conf_password: "",
	});
	const [valid, setValid] = React.useState({
		password: false,
		conf_password: false,
	});

	const intl = useIntl();

	const passwordField = React.useRef(null);

	React.useEffect(() => {
		props.setTitle(intl.formatMessage({ id: "AUTH_PASSWORD_RESET" }));

		return () => {
			props.setTitle();
		};
	}, []);

	React.useEffect(() => {
		setCheckRunning(true);
		setLinkValid(false);
		checkLink(props, props.match.params.uidb64, props.match.params.token);
	}, [props.match.params]);

	React.useEffect(() => {
		if (input.password) {
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
				setValid({ ...valid, password: true });
			}
		} else {
			setValid({ ...valid, password: false });
			setErrors({
				...errors,
				password: "",
			});
		}
	}, [input.password]);

	const checkLink = (props, uidb64, token) => {
		const config = {
			headers: {
				"Content-Type": "application/json",
				"X-CSRFToken": props.csrf,
			},
		};
		axios
			.get(`/backend/auth/password-reset/check/${uidb64}/${token}/`, config)
			.then((res) => {
				if (res.status == 200 && res.data.valid == true) {
					setCheckRunning(false);
					setLinkValid(true);
				}
				console.log(res);
			})
			.catch((err) => {
				console.log(err);
				setCheckRunning(false);
				setLinkValid(false);
			});
	};

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
			{checkRunning ? (
				<div style={{ margin: "auto" }}>
					<div style={{ margin: "auto", width: "7.5rem" }}>
						<CircularProgress color="style" size="7.5rem" />
					</div>

					<p style={{ textAlign: "center" }}>validating your link</p>
				</div>
			) : (
				<>
					{linkValid ? (
						<form>
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
									width: passwordScore * 25,
								}}
								info={`Strength: ${passwordScore}`}
								reference={passwordField}
								autoComplete="new-password"
							/>
							<InputField
								type="password"
								name="conf-password"
								error={errors.conf_password}
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
								autoComplete="new-password"
							/>
							<SubmitButton
								// loading={props.progress}
								// success={props.isAuthenticated && !props.progress}
								title={intl.formatMessage({ id: "AUTH_PASSWORD_RESET" })}
							/>
						</form>
					) : null}
				</>
			)}
		</AuthWrapper>
	);
}

PasswordReset.PropTypes = { csrf: PropTypes.string.isRequired };

const mapStateToProps = (state) => ({ csrf: state.security.csrf_token });

export default connect(mapStateToProps, { setTitle })(
	withRouter(PasswordReset)
);
