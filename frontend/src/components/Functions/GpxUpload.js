import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { setTitle } from "../../actions/generalActions";

import "leaflet/dist/leaflet.css";
import "react-leaflet-markercluster/dist/styles.min.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css"; // Re-uses images from ~leaflet package
import "leaflet-defaulticon-compatibility";

import { useIntl, FormattedMessage } from "react-intl";

import { Grid, Paper, Typography, Hidden } from "@mui/material";

import {
	MapContainer,
	TileLayer,
	useMapEvents,
	useMap,
	ScaleControl,
	LayersControl,
} from "react-leaflet";

import Map from "../Map";

function GpxUpload(props) {
	const intl = useIntl();
	const [key, setKey] = new React.useState(0);

	const [map, setMap] = React.useState(null);

	const initial_center = [props.latitude ?? 0, props.longitude ?? 0];
	const initial_zoom = props.zoom ?? 0;

	React.useEffect(() => {
		props.setTitle(intl.formatMessage({ id: "FUNCTIONS_GPX_TITLE" }));
		return () => {
			props.setTitle();
		};
	}, []);

	function LastPosition() {
		const map = useMap();
		useMapEvents({
			moveend() {
				props.viewChanges(
					map.getCenter().lat,
					map.getCenter().lng,
					map.getZoom()
				);
			},
			zoomend() {
				props.viewChanges(
					map.getCenter().lat,
					map.getCenter().lng,
					map.getZoom()
				);
			},
		});

		return null;
	}

	return (
		<Paper>
			<MapContainer
				center={[0, 0]}
				zoom={0}
				scrollWheelZoom={true}
				style={{ height: "calc(100vh - 90px)", zIndex: 0 }}
				whenCreated={setMap}
				key={key}
			>
				<TileLayer
					attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				/>
				<LastPosition />
			</MapContainer>
		</Paper>
	);
}

GpxUpload.propTypes = {
	setTitle: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
	latitude: state.map.view.latitude,
	longitude: state.map.view.longitude,
	zoom: state.map.view.zoom,
	data: state.map.data,
	latitude: PropTypes.number.isRequired,
	longitude: PropTypes.number.isRequired,
	zoom: PropTypes.number.isRequired,
	data: PropTypes.array,
});

export default connect(mapStateToProps, { setTitle })(GpxUpload);
