import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { motion, AnimateSharedLayout } from "framer-motion";

import { closeMarkerPopup } from "../../../actions/mapActions";

import { VerifiedUser, Warning, Close } from "@material-ui/icons";

import {
	Typography,
	IconButton,
	withWidth,
	isWidthDown,
} from "@material-ui/core";

import Votes from "./Votes";

import { FormattedMessage, FormattedRelativeTime } from "react-intl";
import getDistance from "geolib/es/getDistance";

//  Add details accordion

function MarkerPopup(props) {
	const [zIndex, setZIndex] = React.useState("auto");
	const [distance, setDistance] = React.useState(null);

	var old_code;

	React.useEffect(() => {
		if (old_code == props.content.code || props.open) {
			old_code = props.content.code;
			if (props.map && props.content.gps_coords) {
				props.map?.flyTo([
					props.content.gps_coords[1],
					props.content.gps_coords[0],
				]);
			}
			if (props.gpsAvailable) {
				navigator.geolocation.getCurrentPosition(
					function (e) {
						setDistance(
							props.content.gps_coords != undefined
								? getDistance(
										{ lat: e.coords.latitude, lon: e.coords.longitude },
										{
											lat: props.content.gps_coords[1],
											lon: props.content.gps_coords[0],
										}
								  )
								: null
						);
					},
					function () {
						console.log("error");
					}
				);
			}
		} else {
			setDistance(null);
		}
	}, [props.content]);

	const spring = {
		type: "spring",
		stiffness: 500,
		damping: 60,
	};

	React.useEffect(() => {
		if (props.open == true) {
			setZIndex("auto");
		} else {
			setTimeout(() => {
				setZIndex("-10");
			}, 250);
		}
	}, [props.open]);

	return (
		<>
			<AnimateSharedLayout>
				<div
					style={{
						height: "50vh",
						width: isWidthDown("sm", props.width) ? "calc(100% - 20px)" : "25%",
						maxWidth: isWidthDown("sm", props.width) ? "100%" : "355px",
						position: "fixed",
						right: "10px",
						top: "74px",
						zIndex: zIndex,
					}}
				>
					{props.open ? (
						<motion.div
							initial={false}
							animate={{ visibility: "visible" }}
							transition={spring}
							layoutId="popup"
							style={{
								height: "calc(100% - 44px)",
								width: "calc(100% - 44px)",
								position: "relative",
								zIndex: 9,
								backgroundColor: "white",
								borderRadius: "5px",
								padding: "22px",
							}}
						>
							<IconButton
								style={{
									position: "absolute",
									right: "0px",
									marginTop: "-22px",
								}}
								onClick={props.closeMarkerPopup}
							>
								<Close />
							</IconButton>
							<h2 style={{ margin: "0px" }}>{props.content.code}</h2>
							<Typography
								style={{
									color: "#D5D5D5",
									marginTop: "0px",
									textAlign: "right",
								}}
							>
								<FormattedRelativeTime
									value={
										(Date.now() - Date.parse(props.content.created)) * -0.001
									}
									numeric="auto"
									updateIntervalInSeconds={1}
								/>
							</Typography>
							{props.content.active ? (
								<div style={{ display: "flex", alignItems: "center" }}>
									<Warning style={{ color: "#CC1B29" }} />
									<Typography
										style={{
											color: "#CC1B29",
											display: "inline-block",
											marginLeft: "5px",
											fontWeight: "bolder",
										}}
									>
										<FormattedMessage id="ACTIVE" />
									</Typography>
									<br />
								</div>
							) : null}
							{props.content.verified ? (
								<div style={{ display: "flex", alignItems: "center" }}>
									<VerifiedUser style={{ color: "#387600" }} />
									<Typography
										style={{
											color: "#387600",
											display: "inline-block",
											marginLeft: "5px",
											fontWeight: "bolder",
										}}
									>
										<FormattedMessage id="VERIFIED" />
									</Typography>
								</div>
							) : null}
							<Typography>Höhe: {props.content.height}</Typography>
							<Typography>Größe: {props.content.size}</Typography>
							<Typography>Position: {props.content.localization}</Typography>
							{distance != null && props.gpsAvailable ? (
								<Typography>
									Distance:{" "}
									{distance >= 1000
										? Math.round(distance / 100) / 10
										: distance}
									{distance >= 1000 ? "km" : "m"}
								</Typography>
							) : null}
							<Votes />
						</motion.div>
					) : (
						<motion.div
							animate={false}
							transition={spring}
							layoutId="popup"
							style={{
								height: "calc(100% - 44px)",
								width: "calc(100% - 44px)",
								position: "relative",
								zIndex: 9,
								backgroundColor: "white",
								borderRadius: "5px",
								padding: "22px",
								marginLeft: "150%",
							}}
						>
							<IconButton
								style={{
									position: "absolute",
									right: "0px",
									marginTop: "-22px",
								}}
								onClick={props.closeMarkerPopup}
							>
								<Close />
							</IconButton>
						</motion.div>
					)}
				</div>
			</AnimateSharedLayout>
		</>
	);
}

MarkerPopup.propTypes = {
	closeMarkerPopup: PropTypes.func.isRequired,
	open: PropTypes.bool.isRequired,
	content: PropTypes.object.isRequired,
	isAuthenticated: PropTypes.bool.isRequired,
	gpsAvailable: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
	open: state.map.markerPopup.open,
	content: state.map.markerPopup.content,
	isAuthenticated: state.auth.isAuthenticated,
	gpsAvailable: state.client.gps.available,
});

export default connect(mapStateToProps, { closeMarkerPopup })(
	withWidth()(MarkerPopup)
);
