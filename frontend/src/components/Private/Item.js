import React from "react";

import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import "leaflet/dist/leaflet.css";

import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { Typography, makeStyles } from "@material-ui/core";

import { VerifiedUser, Warning, Close } from "@material-ui/icons";

import { FormattedMessage, FormattedRelativeTime } from "react-intl";

import { ConvertMillisecondsToString } from "../../helpers/ConvertMillisecondsToString";

const useStyles = makeStyles((theme) => ({
	cardList: {
		display: "flex",
		flexWrap: "wrap",
		alignContent: "flex-start",
		maxHeight: "calc(100vh - 154px)",
		overflow: "hidden",
		overflowY: "auto",
		padding: "0px",
		margin: "0px",
		listStyle: "none",
	},
	card: {
		position: "relative",
		marginRight: "25px",
		marginBottom: "25px",
		height: "160px",
		flex: "0 0 40%",
		maxWidth: "calc(100% / 3 - 25px)",
		[theme.breakpoints.only("sm")]: {
			flex: "0 0 50%",
			maxWidth: "calc(50% - 25px)",
			padding: "10px 0px",
			marginBottom: "2.55px",
		},
		[theme.breakpoints.down("xs")]: {
			flex: "1 0 100%",
			maxWidth: "calc(100% - 30px)",
			padding: "10px 0px",
			marginBottom: "2.55px",
		},
	},
	contentContainerOpen: {
		width: "100%",
		height: "calc(100vh - 90px)",
		top: "0px",
		left: "0px",
		right: "0px",
		position: "fixed",
		zIndex: 1,
		overflow: "hidden",
		display: "block",
		pointerEvents: "none",
		padding: "104px 0px 40px 0px",
		[theme.breakpoints.down("sm")]: {
			left: "10px",
			right: "10px",
			width: "calc(100% - 20px)",
			padding: "104px 0px 40px 0px",
		},
	},
	contentOpen: {
		pointerEvents: "none",
		position: "relative",
		borderRadius: "15px",
		background: "#f3efe9",
		overflow: "hidden",
		height: "auto",
		width: "100%",
		maxWidth: "900px",
		margin: "0 auto",
		zIndex: 1000,
	},
	contentMap: {},
	titleContainerOpen: ({ isSelected }) => ({
		position: "absolute",
		top: "30px",
		left: "30px",
		maxWidth: "300px",
		zIndex: 9,
		"& h2": {
			margin: "0px",
			marginBottom: "2.5px",
			color: isSelected == true ? "red" : "#3f3f3f",
		},
	}),
	overlay: {
		display: "block",
		position: "fixed",
		top: "64px",
		bottom: "0px",
		width: "100vw",
		background: "rgba(82, 82, 82, 0.8)",
		left: "50%",
		transform: "translateX(-50%)",
	},
}));

function Item(props) {
	const { created, gps_lat, gps_long, active, verified } = props.data.find(
		(item) => item.code === props.id
	);

	const classes = useStyles();

	const created_date = Date.parse(created);

	return (
		<>
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0, transition: { duration: 0.15 } }}
				transition={{ duration: 0.2, delay: 0.15 }}
				style={{ pointerEvents: "auto" }}
				className={classes.overlay}
			></motion.div>
			<div className={classes.contentContainerOpen}>
				<motion.div
					className={classes.contentOpen}
					layoutId={`card-container-${props.id}`}
				>
					<motion.div
						className="card-map-container"
						layoutId={`card-map-container-${props.id}`}
					>
						<MapContainer
							center={[gps_lat, gps_long]}
							zoom={13}
							scrollWheelZoom={false}
							closePopupOnClick={false}
							dragging={false}
							boxZoom={false}
							doubleClickZoom={false}
							trackResize={false}
							zoomControl={false}
							style={{
								height: "75vh",
								width: "100%",
								zIndex: 0,
							}}
							className="card-map"
						>
							<TileLayer
								attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
								url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
							/>
							<Marker position={[gps_lat, gps_long]} style={{ color: "red" }} />
						</MapContainer>
					</motion.div>
					<motion.div
						className={classes.titleContainerOpen}
						layoutId={`title-container-${props.id}`}
						initial={{ backgroundColor: "transparent", borderRadius: "0px" }}
						animate={{
							backgroundColor: "white",
							borderRadius: "15px",
							padding: "20px",
						}}
					>
						<h2>{props.id}</h2>
						<Typography
							style={{ color: "#D5D5D5", marginTop: "0px", textAlign: "right" }}
						>
							{/* {ConvertMillisecondsToString(Date.now() - created_date)} */}
							<FormattedRelativeTime
								value={(Date.now() - created_date) * -0.001}
								numeric="auto"
								updateIntervalInSeconds={1}
							/>
						</Typography>
						{active ? (
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
						{verified ? (
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
					</motion.div>
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0, transition: { duration: 0.15, delay: -0.3 } }}
						transition={{ duration: 0.2, delay: 0.3 }}
						style={{
							pointerEvents: "auto",
							backgroundColor: "white",
							height: "36px",
							width: "36px",
							position: "absolute",
							top: "20px",
							right: "20px",
							borderRadius: "100%",
						}}
					>
						<Link
							to="/private"
							onClick={() => {
								props.setID("");
							}}
						>
							<Close style={{ fontSize: "36px", color: "#3f3f3f" }} />
						</Link>
					</motion.div>
				</motion.div>
			</div>
		</>
	);
}

export default Item;
