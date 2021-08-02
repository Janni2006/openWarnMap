import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import {
	Grid,
	Card,
	Hidden,
	Typography,
	withWidth,
	isWidthUp,
} from "@material-ui/core";

import { register } from "../../actions/authActions";
import { setTitle } from "../../actions/generalActions";

import { FormattedMessage, useIntl } from "react-intl";

import SubmitButton from "../SubmitButton";

function Register(props) {
	const [input, setInput] = React.useState({
		username: "",
		email: "",
		password: "",
		conf_password: "",
	});
	const [errors, setErrors] = React.useState({});
	const [cardHeight, setCardHeight] = React.useState(0);
	const cardRef = React.useRef(null);
	const intl = useIntl();

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
			props.register(input["username"], input["email"], input["password"]);
		}
	}

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
		var patternEmail = new RegExp(
			/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
		);

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

		setErrors(errors);

		return isValid;
	}

	return (
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
								height: `${cardHeight + 64}px`,
								marginBottom: "-64px",
								position: "relative",
							}}
						>
							<div
								style={{
									position: "absolute",
									transform: "translate(0%, -50%)",
									top: "50%",
									width: "calc(100% - 100px)",
									marginTop: "-64px",
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
									OpenWarnMap
								</Typography>
								<Typography
									style={{
										width: "100%",
										textAlign: "center",
										fontFamily: "sans-serif",
										color: "white",
										fontWeight: "300",
										fontSize: isWidthUp("lg", props.width) ? "16.5px" : "14px",
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
							<FormattedMessage id="AUTH_REGISTER_TITLE" />
						</p>
						<form onSubmit={handleSubmit}>
							<input
								type="text"
								name="username"
								placeholder={intl.formatMessage({
									id: "AUTH_REGISTER_USERNAME_PLACEHOLDER",
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
								type="email"
								name="email"
								placeholder={intl.formatMessage({
									id: "AUTH_REGISTER_EMAIL_PLACEHOLDER",
								})}
								value={input.email}
								onChange={(event) => {
									setInput({ ...input, email: event.target.value });
								}}
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
								{errors.email}
							</div>
							<input
								type="password"
								name="password"
								autocomplete="new-password"
								placeholder={intl.formatMessage({
									id: "AUTH_REGISTER_PASSWORD_PLACEHOLDER",
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
							<input
								type="password"
								name="conf_password"
								autocomplete="new-password"
								placeholder={intl.formatMessage({
									id: "AUTH_REGISTER_CONFIRM_PASSWORD_PLACEHOLDER",
								})}
								value={input.conf_password}
								onChange={(event) => {
									setInput({ ...input, conf_password: event.target.value });
								}}
								style={{
									height: "45px",
									width: "calc(100% - 50px)",
									backgroundColor: props.progress ? "#dddddd" : "#faf6f2",
									border: "none",
									padding: "5px 25px",
									marginTop: "25px",
								}}
								id="conf_password"
								disabled={props.progress}
							/>
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
								style={{ color: "#f45c43", textDecoration: "none" }}
								to={"/login"}
							>
								<FormattedMessage id="AUTH_REGISTER_QUESTION_LINK" />
							</Link>
						</p>
					</Grid>
				</Grid>
			</Card>
		</div>
	);
}

Register.propTypes = {
	progress: PropTypes.bool.isRequired,
	register: PropTypes.func.isRequired,
	setTitle: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
	progress: state.auth.progress,
});

export default connect(mapStateToProps, { register, setTitle })(
	withWidth()(Register)
);
