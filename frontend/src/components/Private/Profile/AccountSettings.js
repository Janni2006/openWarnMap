import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { setTitle } from "../../../actions/generalActions";

import { Grid, Button, Paper, Typography } from "@material-ui/core";

import {
	FormattedMessage,
	useIntl,
	FormattedDate,
	FormattedTime,
} from "react-intl";

import "./input.css";

import axios from "axios";

function Profile(props) {
	const [input, setInput] = React.useState({
		firstname: props.firstname,
		lastname: props.lastname,
	});
	const [loading, setLoading] = React.useState(false);
	const intl = useIntl();

	React.useEffect(() => {
		props.setTitle("Profile (Account)");

		return () => {
			props.setTitle("Profile");
		};
	});

	function updateProfile() {
		setLoading(true);
		const config = {
			headers: {
				"Content-Type": "application/json",
				"X-CSRFToken": props.csrf,
			},
		};
		const body = JSON.stringify({
			firstname: input.firstname,
			lastname: input.lastname,
		});
	}

	return (
		<Paper style={{ padding: "22px" }}>
			<Grid container spacing={2} style={{ overflow: "hidden" }}>
				<Grid item xs={12} md={6}>
					<div className="wrapper">
						<div className="input-data">
							<input
								type="text"
								required
								onChange={(event) => {
									setInput({ ...input, firstname: event.target.value });
								}}
								value={input.firstname}
								id="firstname"
								name="firstname"
								disabled={loading}
							/>
							<div className="underline" />
							<label>
								<FormattedMessage id="PROFILE_PAGE_ACCOUNT_FIRSTNAME" />
							</label>
						</div>
					</div>
				</Grid>
				<Grid item xs={12} md={6}>
					<div className="wrapper">
						<div className="input-data">
							<input
								type="text"
								required
								onChange={(event) => {
									setInput({ ...input, lastname: event.target.value });
								}}
								value={input.lastname}
								id="lastname"
								name="lastname"
								disabled={loading}
							/>
							<div className="underline" />
							<label>
								<FormattedMessage id="PROFILE_PAGE_ACCOUNT_LASTNAME" />
							</label>
						</div>
					</div>
				</Grid>
			</Grid>
			<Grid container spacing={2}>
				<Grid item xs={12} md={6}>
					<Typography style={{ padding: "0px 10px" }}>
						<FormattedMessage id="PROFILE_PAGE_ACCOUNT_LAST_LOGIN" />:{" "}
						<FormattedDate value={props.last_login} />,{" "}
						<FormattedTime value={props.last_login} />
					</Typography>
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
					disabled={loading}
					onClick={() => {
						setInput({ firstname: props.firstname, lastname: props.lastname });
					}}
				>
					<FormattedMessage id="CANCEL" />
				</Button>
				<Button
					variant="contained"
					color="secondary"
					style={{
						borderRadius: "2.5px",
						height: "44px",
						marginLeft: "15px",
					}}
					disabled={loading}
					onClick={updateProfile}
				>
					<FormattedMessage id="UPDATE" />
				</Button>
			</div>
		</Paper>
	);
}

Profile.propTypes = {
	setTitle: PropTypes.func.isRequired,
	firstname: PropTypes.string.isRequired,
	lastname: PropTypes.string.isRequired,
	last_login: PropTypes.number.isRequired,
	csrf: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
	firstname: state.auth.user.firstname,
	lastname: state.auth.user.lastname,
	last_login: state.auth.user.last_login,
	csrf: state.security.csrf_token,
});

export default connect(mapStateToProps, { setTitle })(Profile);
