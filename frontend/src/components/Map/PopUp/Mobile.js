import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { openMarkerPopup } from "../../../actions/mapActions";

import { Popup } from "react-leaflet";

import { VerifiedUser, Warning } from "@material-ui/icons";

import { Tooltip, Hidden } from "@material-ui/core";

import { FormattedRelativeTime } from "react-intl";

function MobilePopup(props) {
	return (
		<Hidden mdUp>
			<Popup key={"popup-" + props.item.code}>
				<div
					onClick={() => {
						props.openMarkerPopup(props.item);
					}}
				>
					<strong>{props.item.code}</strong>
					<br />
					<FormattedRelativeTime
						value={(Date.now() - Date.parse(props.item.created)) * -0.001}
						numeric="auto"
						updateIntervalInSeconds={1}
					/>
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
				</div>
			</Popup>
		</Hidden>
	);
}

MobilePopup.propTypes = {
	item: PropTypes.object.isRequired,
	openMarkerPopup: PropTypes.func.isRequired,
};

export default connect(null, { openMarkerPopup })(MobilePopup);
