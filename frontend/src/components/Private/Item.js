import React from "react";

import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";

import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet-defaulticon-compatibility";
import { Typography } from "@material-ui/core";

import { VerifiedUser, Warning, Close } from "@material-ui/icons";

import { ConvertMillisecondsToString } from "../../helpers/ConvertMillisecondsToString";

function Item(props) {
	const { created, gps_lat, gps_long, active, verified } = props.data.find(
		(item) => item.code === props.id
	);

	const created_date = Date.parse(created);

	return (
		<>
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0, transition: { duration: 0.15 } }}
				transition={{ duration: 0.2, delay: 0.15 }}
				style={{ pointerEvents: "auto" }}
				className="overlay"
			>
				{/* <Typography>Tap anywhere to close</Typography> */}
				{/* <Link
					to="/private"
					onClick={() => {
						props.setID("");
					}}
				/> */}
			</motion.div>
			<div className="card-content-container open">
				<motion.div
					className="card-content"
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
						className="title-container"
						layoutId={`title-container-${props.id}`}
						initial={{ backgroundColor: "transparent", borderRadius: "0px" }}
						animate={{
							backgroundColor: "white",
							borderRadius: "15px",
							padding: "20px",
						}}
						style={{ zIndex: 9 }}
					>
						<h2>{props.id}</h2>
						<Typography
							style={{ color: "#D5D5D5", marginTop: "0px", textAlign: "right" }}
						>
							{ConvertMillisecondsToString(Date.now() - created_date)}
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
									Active
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
									Verified
								</Typography>
							</div>
						) : null}
					</motion.div>
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						// exit={{ opacity: 0, transition: { duration: 0.15 } }}
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
							<Close style={{ fontSize: "36px", color: "black" }} />
						</Link>
					</motion.div>
				</motion.div>
			</div>
		</>
	);
}

export default Item;
