import React, { Component } from "react";
import clsx from "clsx";

import PropTypes from "prop-types";
import { connect } from "react-redux";
import { setTitle } from "../../../actions/generalActions";

import {
	Grid,
	Button,
	Paper,
	makeStyles,
	CircularProgress,
} from "@material-ui/core";

import { motion, AnimateSharedLayout } from "framer-motion";

import { green, red } from "@material-ui/core/colors";

import { toast } from "react-toastify";

import zxcvbn from "zxcvbn";

import { FormattedMessage, useIntl } from "react-intl";

import "./input.css";

import axios from "axios";

const useStyles = makeStyles((theme) => ({
	wrapper: {
		position: "relative",
	},
	buttonSuccess: {
		backgroundColor: green[500],
		"&:hover": {
			backgroundColor: green[700],
		},
	},
	buttonError: {
		backgroundColor: red[500],
		"&:hover": {
			backgroundColor: red[700],
		},
	},
	buttonProgress: {
		color: green[500],
		position: "absolute",
		top: "50%",
		left: "50%",
		marginTop: -12,
		marginLeft: -12,
	},
}));

function Profile(props) {
	const [passwordScore, setPasswordScore] = React.useState(0);
	const [loading, setLoading] = React.useState(false);
	const [success, setSuccess] = React.useState(false);
	const [error, setError] = React.useState(false);

	const classes = useStyles();
	const intl = useIntl();

	const buttonClassname = clsx({
		[classes.buttonSuccess]: success,
		[classes.buttonError]: error,
	});

	const [input, setInput] = React.useState({
		old_password: "",
		new_password: "",
		conf_password: "",
	});

	React.useEffect(() => {
		props.setTitle(intl.formatMessage({ id: "PROFILE_PAGE_TITLE_PASSWORD" }));

		return () => {
			props.setTitle(intl.formatMessage({ id: "PROFILE" }));
		};
	});

	function updatePassword() {
		setLoading(true);
		const config = {
			headers: {
				"Content-Type": "application/json",
				"X-CSRFToken": props.csrf,
			},
		};

		const body = JSON.stringify({
			old_password: input.old_password,
			new_password: input.new_password,
			conf_password: input.conf_password,
		});

		axios
			.post("/react/change-password/", body, config)
			.then((res) => {
				setLoading(false);
				if (res.status == 200) {
					toast.success(
						intl.formatMessage({
							id: "PROFILE_PAGE_PASSWORD_SUCCESS_CHANGE_PASSWORD",
						})
					);
					setSuccess(true);
					setError(false);
					setTimeout(() => {
						setSuccess(false);
					}, 2500);
					setInput({
						old_password: "",
						new_password: "",
						conf_password: "",
					});
				}
			})
			.catch((err) => {
				setLoading(false);
				setError(true);
				setSuccess(false);

				setTimeout(() => {
					setError(false);
				}, 2500);

				toast.error(
					intl.formatMessage({
						id: "PROFILE_PAGE_PASSWORD_ERROR_CHANGE_PASSWORD",
					})
				);
			});
	}

	return (
		<Paper style={{ padding: "22px" }}>
			<Grid container spacing={2} style={{ overflow: "hidden" }}>
				<Grid item xs={12} md={6}>
					<div className={"wrapper"}>
						<div className={"input-data"}>
							<input
								type="password"
								required
								onChange={(e) => {
									setInput({ ...input, old_password: e.target.value });
								}}
								value={input.old_password}
								disabled={loading}
							/>
							<div className={"underline"} />
							<label>
								<FormattedMessage id="PROFILE_PAGE_PASSWORD_OLD_PASSWORD" />
							</label>
						</div>
					</div>
				</Grid>
			</Grid>
			<Grid container spacing={2} style={{ overflow: "hidden" }}>
				<Grid item xs={12} md={6}>
					<div className={"wrapper"}>
						<div className={"input-data"}>
							<input
								type="password"
								required
								onChange={(e) => {
									setPasswordScore(zxcvbn(e.target.value).score);
									setInput({ ...input, new_password: e.target.value });
								}}
								value={input.new_password}
								disabled={loading}
								autoComplete="new-password"
							/>
							<div className={"underline"} />
							<AnimateSharedLayout>
								<motion.div
									layoutId="change_password_score"
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
								<FormattedMessage id="PROFILE_PAGE_PASSWORD_NEW_PASSWORD" />
							</label>
						</div>
					</div>
				</Grid>
				<Grid item xs={12} md={6}>
					<div className={"wrapper"}>
						<div className={"input-data"}>
							<input
								type="password"
								required
								onChange={(e) => {
									setInput({ ...input, conf_password: e.target.value });
								}}
								value={input.conf_password}
								onSubmit={updatePassword}
								disabled={loading}
								autoComplete="new-password"
							/>
							<div className={"underline"} />
							{input.new_password != input.conf_password ? (
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
								<FormattedMessage id="PROFILE_PAGE_PASSWORD_CONFIRM_PASSWORD" />
							</label>
						</div>
					</div>
				</Grid>
			</Grid>
			<div
				style={{
					height: "44px",
					marginTop: "25px",
					display: "flex",
					justifyContent: "flex-end",
				}}
			>
				<Button
					variant="outlined"
					color="secondary"
					style={{
						borderRadius: "2.5px",
						height: "44px",
					}}
					onClick={() => {
						setInput({
							old_password: "",
							new_password: "",
							conf_password: "",
						});
					}}
					disabled={loading}
				>
					<FormattedMessage id="CANCEL" />
				</Button>
				<div className={classes.wrapper}>
					<Button
						variant="contained"
						color="secondary"
						style={{
							borderRadius: "2.5px",
							height: "44px",
							marginLeft: "15px",
						}}
						onClick={updatePassword}
						disabled={loading}
						className={buttonClassname}
					>
						<FormattedMessage id="UPDATE" />
					</Button>
					{loading && (
						<CircularProgress size={24} className={classes.buttonProgress} />
					)}
				</div>
			</div>
		</Paper>
	);
}

Profile.propTypes = {
	setTitle: PropTypes.func.isRequired,
	csrf: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({ csrf: state.security.csrf_token });

export default connect(mapStateToProps, { setTitle })(Profile);
