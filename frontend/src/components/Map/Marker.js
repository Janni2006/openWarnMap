import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { openMarkerPopup } from "../../actions/mapActions";

import { Marker, Popup } from "react-leaflet";

import { withWidth, isWidthUp } from "@material-ui/core";

import MobilePopup from "./PopUp/Mobile";

function MapMarker(props) {
	return (
		<Marker
			position={[props.item.gps_coords[1], props.item.gps_coords[0]]}
			key={props.item.code}
			eventHandlers={{
				click: () => {
					if (isWidthUp("md", props.width)) {
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
	width: PropTypes.string.isRequired,
};

export default connect(null, { openMarkerPopup })(withWidth()(MapMarker));
