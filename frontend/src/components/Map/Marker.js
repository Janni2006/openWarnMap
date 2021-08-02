import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { openMarkerPopup } from "../../actions/mapActions";

import { Marker, Popup, Circle } from "react-leaflet";

import "leaflet-defaulticon-compatibility";
import "react-leaflet-markercluster/dist/styles.min.css";

import { VerifiedUser, Warning } from "@material-ui/icons";

import { Tooltip, Hidden } from "@material-ui/core";

import { ConvertMillisecondsToString } from "../../helpers/ConvertMillisecondsToString";

function MapMarker(props) {
	return (
		<Marker
			position={[props.item.gps_lat, props.item.gps_long]}
			key={props.item.code}
			eventHandlers={{
				click: () => {
					props.openMarkerPopup(props.item);
				},
			}}
		>
			<Hidden mdUp>
				<Popup>
					<strong>{props.item.code}</strong>
					<br />
					{ConvertMillisecondsToString(
						Date.now() - Date.parse(props.item.created)
					)}
					<br />
					{props.item.active ? (
						<Tooltip title="This entry is marked as active" arrow>
							<Warning style={{ color: "#CC1B29" }} />
						</Tooltip>
					) : null}
					{props.item.verified ? (
						<Tooltip title="Verified by multiple users" arrow>
							<VerifiedUser style={{ color: "#387600" }} />
						</Tooltip>
					) : null}
				</Popup>
			</Hidden>
		</Marker>
	);
}

MapMarker.propTypes = { openMarkerPopup: PropTypes.func.isRequired };

export default connect(null, { openMarkerPopup })(MapMarker);
