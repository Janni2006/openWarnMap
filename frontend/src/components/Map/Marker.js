import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { openMarkerPopup } from "../../actions/mapActions";

import { Marker } from "react-leaflet";

import { useTheme } from "@mui/material";

import { useMediaQuery } from "@mui/material";

import MobilePopup from "./PopUp/Mobile";

function MapMarker(props) {
	const theme = useTheme();
	const mdUp = useMediaQuery(theme.breakpoints.up("md"));
	return (
		<Marker
			position={[props.item.gps_coords[1], props.item.gps_coords[0]]}
			key={props.item.code}
			eventHandlers={{
				click: () => {
					if (mdUp) {
						props.openMarkerPopup(props.item);
					}
				},
			}}
		>
			<MobilePopup item={props.item} />
		</Marker>
	);
}

MapMarker.propTypes = {
	openMarkerPopup: PropTypes.func.isRequired,
};

export default connect(null, { openMarkerPopup })(MapMarker);
