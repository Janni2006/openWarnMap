import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import "leaflet/dist/leaflet.css";

import { MapContainer, TileLayer, Marker } from "react-leaflet";

// import "./style.css";
import { VerifiedUser, Warning } from "@material-ui/icons";

import { FormattedMessage, FormattedRelativeTime } from "react-intl";

import { makeStyles, Typography } from "@material-ui/core";

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
		width: "calc(100% + 25px)",
	},
	card: ({ listType }) => ({
		position: "relative",
		marginRight: listType == "box" ? "25px" : "0px",
		marginBottom: "25px",
		height: "160px",
		flex: listType == "box" ? "0 0 40%" : "0 0 100%",
		maxWidth: listType == "box" ? "calc(100% / 3 - 25px)" : "calc(100% - 25px)",
		[theme.breakpoints.only("sm")]: {
			flex: "1 0 100%",
			maxWidth: "calc(50% - 30px)",
			padding: "10px 0px",
			marginBottom: "2.55px",
		},
		[theme.breakpoints.down("xs")]: {
			flex: "1 0 100%",
			maxWidth: "calc(100% - 30px)",
			padding: "10px 0px",
			marginBottom: "2.55px",
		},
	}),
	contentContainer: {
		width: "100%",
		height: "100%",
		position: "relative",
		display: "block",
		pointerEvents: "none",
	},
	content: ({ listType }) => ({
		pointerEvents: "auto",
		position: "relative",
		borderRadius: "15px",
		background: "#f3efe9",
		overflow: "hidden",
		height: "100%",
		height: "100%",
		margin: "0 auto",
		background: listType == "box" ? "auto" : "white",
	}),
	contentMap: ({ listType }) => ({ width: listType == "box" ? "100%" : "40%" }),
	contentMapMain: { height: 160, zIndex: 0, width: "100%" },
	titleContainer: ({ listType }) => ({
		position: "absolute",
		top: "15px",
		left: listType == "box" ? "15px" : "calc(40% + 15px)",
		maxWidth: "300px",
		"& h2": {
			margin: "0px",
			marginBottom: "2.5px",
			color: "#3f3f3f",
		},
	}),
	cardOpenLink: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0 },
}));

function Card({
	code,
	gps_coords,
	setID,
	active,
	verified,
	listType,
	created,
}) {
	const classes = useStyles({ listType });

	const created_date = Date.parse(created);

	return (
		<li className={classes.card}>
			<div className={classes.contentContainer}>
				<motion.div
					className={classes.content}
					layoutId={`card-container-${code}`}
				>
					<motion.div
						className={classes.contentMap}
						layoutId={`card-map-container-${code}`}
					>
						<MapContainer
							center={[gps_coords[1], gps_coords[0]]}
							zoom={16}
							scrollWheelZoom={false}
							closePopupOnClick={false}
							dragging={false}
							boxZoom={false}
							doubleClickZoom={false}
							trackResize={false}
							zoomControl={false}
							className={classes.contentMapMain}
							key={"map" + code + listType}
						>
							<TileLayer
								attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
								url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
								key={code + listType}
							/>
							<Marker
								position={[gps_coords[1], gps_coords[0]]}
								key={"marker" + code + listType}
							/>
						</MapContainer>
					</motion.div>
					<motion.div
						className={classes.titleContainer}
						layoutId={`title-container-${code}`}
					>
						<h2>{code}</h2>
						{listType == "list" ? (
							<Typography
								style={{
									color: "#D5D5D5",
									marginTop: "0px",
									textAlign: "right",
								}}
							>
								<FormattedRelativeTime
									value={(Date.now() - created_date) * -0.001}
									numeric="auto"
									updateIntervalInSeconds={1}
								/>
							</Typography>
						) : null}

						{active && listType == "box" ? (
							<Warning style={{ color: "#CC1B29" }} />
						) : (
							<>
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
							</>
						)}
						{verified && listType == "box" ? (
							<VerifiedUser style={{ color: "#387600" }} />
						) : (
							<>
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
							</>
						)}
					</motion.div>
				</motion.div>
			</div>
			<Link
				to={`/private/${code}`}
				className={classes.cardOpenLink}
				onClick={() => {
					setID(code);
				}}
			/>
		</li>
	);
}

function List(props) {
	const classes = useStyles();
	return (
		<>
			{props.data ? (
				<ul className={classes.cardList}>
					{props.data.map((card, index) => (
						<Card
							key={index}
							{...card}
							setID={props.setID}
							listType={props.listType}
							isSelected={card.id === props.selectedId}
						/>
					))}
				</ul>
			) : null}
		</>
	);
}

export default List;
