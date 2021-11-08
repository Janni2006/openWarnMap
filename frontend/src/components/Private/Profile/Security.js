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
} from "@mui/material";

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
			<Grid container spacing={2}>
				<Grid item xs={6} sm={12} md={6}>
					<Typography>Für andere Sichtbar</Typography>
					<FormGroup>
						<FormControlLabel
							control={
								<Switch
									checked={test}
									onChange={(event) => setTest(event.target.checked)}
								/>
							}
							label="Daten einsehbar machen"
						/>
						{test ? (
							<>
								<FormControlLabel
									control={<Switch checked={test} disabled />}
									label="Nutzername"
								/>
								<FormControlLabel
									control={<Switch disabled={!test} />}
									label="E-Mail"
								/>
								<FormControlLabel
									control={<Switch disabled={!test} />}
									label="Name"
								/>
							</>
						) : null}
					</FormGroup>
				</Grid>
				<Grid item xs={6} sm={12} md={6}>
					<Typography>Gesammelte Daten</Typography>
					<FormGroup>
						<FormControlLabel control={<Switch />} label="Test" />
					</FormGroup>
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
