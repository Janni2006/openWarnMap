import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { useMapEvents, Popup } from "react-leaflet";

import { Button, useMediaQuery, useTheme } from "@mui/material";

import { Link } from "react-router-dom";

import { Add } from "@mui/icons-material";

import { FormattedMessage } from "react-intl";

function MapClick(props) {
	const theme = useTheme();
	const [key, setKey] = React.useState(0);
	const [position, setPosition] = React.useState([0, 0]);
	const [show, setShow] = React.useState(false);

	var xs = useMediaQuery(theme.breakpoints.down("xs")); // CHECK if the useMediaQuery updates its state on screen resize

	React.useEffect(() => {
		// if (useMediaQuery(theme.breakpoints.down("xs")) || !props.clickToAdd) {
		if (xs || !props.clickToAdd) {
			setPosition([0, 0]);
			setShow(false);
			setKey(key + 1);
		}
	}, [props]);

	const map = useMapEvents({
		click(e) {
			if (
				useMediaQuery(theme.breakpoints.up("sm")) &&
				map.getZoom() > 12 &&
				props.clickToAdd &&
				props.isAuthenticated
			) {
				map.flyTo(e.latlng, 18);
				setPosition(e.latlng);
				setShow(true);
				setKey(key + 1);
			}
		},
	});

	return (
		<>
			{show ? (
				<Popup
					onClose={() => setShow(false)}
					closeButton={false}
					position={position}
				>
					<Button
						variant="outlined"
						color="secondary"
						style={{
							borderRadius: "22px",
							height: "44px",
							borderWidth: "2px",
							marginRight: "10px",
						}}
						onClick={() => setShow(false)}
					>
						<FormattedMessage id="CANCEL" />
					</Button>
					<Link to="/add" style={{ textDecoration: "none" }}>
						<Button
							variant="contained"
							color="secondary"
							startIcon={<Add />}
							style={{
								borderRadius: "22px",
								height: "44px",
							}}
						>
							<FormattedMessage id="ADD_SUBMIT" />
						</Button>
					</Link>
				</Popup>
			) : null}
		</>
	);
}

MapClick.propTypes = {
	clickToAdd: PropTypes.bool.isRequired,
	isAuthenticated: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
	clickToAdd: state.general.settings.map.clickToAdd,
	isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps)(MapClick);
