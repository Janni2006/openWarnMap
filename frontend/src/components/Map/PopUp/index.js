import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { motion, AnimateSharedLayout } from "framer-motion";

import { closeMarkerPopup } from "../../../actions/mapActions";

import { VerifiedUser, Warning, Close, ExpandMore } from "@mui/icons-material";

import {
	Typography,
	IconButton,
	Divider,
	CircularProgress,
} from "@mui/material";

import { makeStyles } from "@mui/styles";

import withStyles from "@mui/styles/withStyles";

import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";

import Votes from "./Votes";

import { FormattedMessage, FormattedRelativeTime } from "react-intl";
import getDistance from "geolib/es/getDistance";

import ErrirBoundary from "../../ErrorBoundary";

const useStyles = makeStyles((theme) => ({
	z_wrapper: {
		height: "50vh",
		width: "25%",
		maxWidth: "355px",
		position: "fixed",
		right: "10px",
		top: "74px",
		[theme.breakpoints.down("sm")]: {
			width: "calc(100% - 20px)",
			maxWidth: "100%",
		},
	},
}));

const Accordion = withStyles({
	root: {
		// border: "1px solid rgba(0, 0, 0, .125)",
		boxShadow: "none",
		"&:not(:last-child)": {
			borderBottom: 0,
		},
		"&:before": {
			display: "none",
		},
		"&$expanded": {
			margin: "auto",
		},
	},
	expanded: {},
})(MuiAccordion);

const AccordionSummary = withStyles({
	root: {
		// backgroundColor: "rgba(0, 0, 0, .03)",
		// borderBottom: "1px solid rgba(0, 0, 0, .125)",
		marginBottom: -1,
		padding: "0px",
		minHeight: 24,
		"&$expanded": {
			minHeight: 24,
		},
	},
	content: {
		"&$expanded": {
			margin: "0px",
		},
	},
	expanded: {},
})(MuiAccordionSummary);

const AccordionDetails = withStyles((theme) => ({
	root: {
		padding: "0px 0px 12px 0px",
	},
}))(MuiAccordionDetails);

function I18nHeight(props) {
	switch (props.height) {
		case 0:
			return (
				<Typography>
					<FormattedMessage id="ADD_HEIGHT" />:{" "}
					<FormattedMessage id="ADD_HEIGHT_OPTION_1" />
				</Typography>
			);
		case 1:
			return (
				<Typography>
					<FormattedMessage id="ADD_HEIGHT" />:{" "}
					<FormattedMessage id="ADD_HEIGHT_OPTION_2" />
				</Typography>
			);
		case 2:
			return (
				<Typography>
					<FormattedMessage id="ADD_HEIGHT" />:{" "}
					<FormattedMessage id="ADD_HEIGHT_OPTION_3" />
				</Typography>
			);
		default:
			return (
				<Typography>There was an error while gethering the height</Typography>
			);
	}
}

function I18nSize(props) {
	switch (props.size) {
		case 0:
			return (
				<Typography>
					<FormattedMessage id="ADD_SIZE" />:{" "}
					<FormattedMessage id="ADD_SIZE_OPTION_1" />
				</Typography>
			);
		case 1:
			return (
				<Typography>
					<FormattedMessage id="ADD_SIZE" />:{" "}
					<FormattedMessage id="ADD_SIZE_OPTION_2" />
				</Typography>
			);
		case 2:
			return (
				<Typography>
					<FormattedMessage id="ADD_SIZE" />:{" "}
					<FormattedMessage id="ADD_SIZE_OPTION_3" />
				</Typography>
			);
		default:
			return (
				<Typography>There was an error while gethering the size</Typography>
			);
	}
}

function I18nLocalization(props) {
	switch (props.localization) {
		case 0:
			return (
				<Typography>
					<FormattedMessage id="ADD_LOCALIZATION" />:{" "}
					<FormattedMessage id="ADD_LOCALIZATION_OPTION_1" />
				</Typography>
			);
		case 1:
			return (
				<Typography>
					<FormattedMessage id="ADD_LOCALIZATION" />:{" "}
					<FormattedMessage id="ADD_LOCALIZATION_OPTION_2" />
				</Typography>
			);
		case 2:
			return (
				<Typography>
					<FormattedMessage id="ADD_LOCALIZATION" />:{" "}
					<FormattedMessage id="ADD_LOCALIZATION_OPTION_3" />
				</Typography>
			);
		default:
			return (
				<Typography>There was an error while gethering the position</Typography>
			);
	}
}

function MarkerPopup(props) {
	const classes = useStyles();
	const [zIndex, setZIndex] = React.useState("auto");
	const [distance, setDistance] = React.useState(null);
	const [expanded, setExpanded] = React.useState(false);

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

	const handleChange = (panel) => (event, newExpanded) => {
		setExpanded(newExpanded ? panel : false);
	};

	return (
		<>
			<AnimateSharedLayout>
				<div
					className={classes.z_wrapper}
					style={{
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
								size="large"
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
							<Accordion
								square
								expanded={expanded === "details_panel"}
								onChange={handleChange("details_panel")}
							>
								<AccordionSummary
									expandIcon={<ExpandMore />}
									aria-controls="details_panel-content"
									id="details_panel-header"
								>
									Details
									<Divider flexItem />
								</AccordionSummary>
								<AccordionDetails>
									<div style={{ display: "block" }}>
										<I18nHeight height={props.content.height} />
										<I18nSize size={props.content.size} />
										<I18nLocalization
											localization={props.content.localization}
										/>
										{distance != null && props.gpsAvailable ? (
											<Typography>
												Distance:{" "}
												{distance >= 1000
													? Math.round(distance / 100) / 10
													: distance}
												{distance >= 1000 ? "km" : "m"}
											</Typography>
										) : null}
									</div>
								</AccordionDetails>
							</Accordion>
							{props.loading ? <CircularProgress /> : <></>}
							<ErrirBoundary>
								<Votes />
							</ErrirBoundary>
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
								size="large"
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
	loading: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
	open: state.map.markerPopup.open,
	content: state.map.markerPopup.content,
	isAuthenticated: state.auth.isAuthenticated,
	gpsAvailable: state.client.gps.available,
	loading: state.map.markerPopup.loading,
});

export default connect(mapStateToProps, { closeMarkerPopup })(MarkerPopup);
