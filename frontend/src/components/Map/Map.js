import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";

import { viewChanges, updateData } from "../../actions/mapActions";

import {
	MapContainer,
	TileLayer,
	useMapEvents,
	useMap,
	ScaleControl,
	CircleMarker,
} from "react-leaflet";

import { withWidth, Hidden } from "@material-ui/core";

import MarkerClusterGroup from "react-leaflet-markercluster";

import MapMarker from "./Marker";
import MarkerPopup from "./MarkerPopup";
import AddActionButton from "./AddActionButton";

function MapObject(props) {
	const [key, setKey] = new React.useState(0);

	const [map, setMap] = React.useState(null);

	const initial_center = [props.lattitude ?? 0, props.longitude ?? 0];
	const initial_zoom = props.zoom ?? 0;

	React.useEffect(() => {
		setKey(key + 1);
	}, [props.data]);

	React.useEffect(() => {
		props.updateData();
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
		<>
			<MapContainer
				center={initial_center}
				zoom={initial_zoom}
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
				<ScaleControl />
				{props.data ? (
					<MarkerClusterGroup>
						{props.data.map((item, index) => (
							<MapMarker index={index} item={item} />
						))}
					</MarkerClusterGroup>
				) : null}
			</MapContainer>
			<AddActionButton />
			<Hidden smDown>
				<MarkerPopup map={map} />
			</Hidden>
		</>
	);
}

MapObject.propTypes = {
	viewChanges: PropTypes.func.isRequired,
	lattitude: PropTypes.number.isRequired,
	longitude: PropTypes.number.isRequired,
	zoom: PropTypes.number.isRequired,
	data: PropTypes.array,
};

const mapStateToProps = (state) => ({
	lattitude: state.map.view.lattitude,
	longitude: state.map.view.longitude,
	zoom: state.map.view.zoom,
	data: state.map.data,
});

export default connect(mapStateToProps, { viewChanges, updateData })(
	withWidth()(MapObject)
);
