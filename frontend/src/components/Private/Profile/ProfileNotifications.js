import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { setTitle } from "../../../actions/generalActions";

import {
	Grid,
	Button,
	Paper,
	Typography,
	Switch,
	FormControlLabel,
	FormGroup,
} from "@material-ui/core";

import {
	FormattedMessage,
	useIntl,
	FormattedDate,
	FormattedTime,
} from "react-intl";

import "./input.css";

import { toast } from "react-toastify";

import { loadUser } from "../../../actions/authActions";

import axios from "axios";

function Profile(props) {
	const [input, setInput] = React.useState({
		firstname: props.firstname,
		lastname: props.lastname,
	});
	const [test, setTest] = React.useState(false);
	const [loading, setLoading] = React.useState(false);
	const intl = useIntl();

	React.useEffect(() => {
		props.setTitle(intl.formatMessage({ id: "PROFILE_PAGE_TITLE_ACCOUNT" }));

		return () => {
			props.setTitle(intl.formatMessage({ id: "PROFILE" }));
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
			<FormGroup>
				<FormControlLabel
					control={
						<Switch
							checked={test}
							onChange={(event) => setTest(event.target.checked)}
						/>
					}
					label="Abonieren Sie unseren Newsletter. Wir bringen ungefähr 
						einmal pro Jahr einen Newsletter mit allen wichtigen 
						Informationen zum Status dieses Projekts raus."
				/>
			</FormGroup>

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
	loadUser: PropTypes.func.isRequired,
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

export default connect(mapStateToProps, { setTitle, loadUser })(Profile);
