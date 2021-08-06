import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { useMapEvents, Marker, Popup } from "react-leaflet";

import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css"; // Re-uses images from ~leaflet package
import "leaflet-defaulticon-compatibility";

import { withWidth, isWidthUp, Button, isWidthDown } from "@material-ui/core";

import { Link } from "react-router-dom";

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
				props.clickToAdd
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
					<Button onClick={() => setShow(false)}>Close</Button>
					<Link to="/add">
						<Button>Add</Button>
					</Link>
				</Popup>
			) : null}
		</>
	);
}

MapClick.propTypes = {
	clickToAdd: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
	clickToAdd: state.general.settings.map.clickToAdd,
});

export default connect(mapStateToProps)(withWidth()(MapClick));
