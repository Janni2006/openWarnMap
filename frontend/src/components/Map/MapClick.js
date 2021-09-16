import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { useMapEvents, Popup } from "react-leaflet";

import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css"; // Re-uses images from ~leaflet package
import "leaflet-defaulticon-compatibility";

import { withWidth, isWidthUp, Button, isWidthDown } from "@material-ui/core";

import { Link } from "react-router-dom";

import { Add } from "@material-ui/icons";

import { FormattedMessage } from "react-intl";

function MapClick(props) {
	const [key, setKey] = React.useState(0);
	const [position, setPosition] = React.useState([0, 0]);
	const [show, setShow] = React.useState(false);

	React.useEffect(() => {
		if (isWidthDown("xs", props.width) || !props.clickToAdd) {
			setPosition([0, 0]);
			setShow(false);
			setKey(key + 1);
		}
	}, [props]);

	const map = useMapEvents({
		click(e) {
			if (
				isWidthUp("sm", props.width) &&
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

export default connect(mapStateToProps)(withWidth()(MapClick));
