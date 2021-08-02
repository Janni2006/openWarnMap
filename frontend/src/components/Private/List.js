import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import "leaflet/dist/leaflet.css";

import { MapContainer, TileLayer, Marker } from "react-leaflet";

import "./style.css";
import { VerifiedUser, Warning } from "@material-ui/icons";

function Card({ code, gps_lat, gps_long, setID, active, verified }) {
	return (
		<li className={`card`}>
			<div className="card-content-container">
				<motion.div
					className="card-content"
					layoutId={`card-container-${code}`}
				>
					<motion.div
						className="card-map-container"
						layoutId={`card-map-container-${code}`}
					>
						<MapContainer
							center={[gps_lat, gps_long]}
							zoom={10}
							scrollWheelZoom={false}
							closePopupOnClick={false}
							dragging={false}
							boxZoom={false}
							doubleClickZoom={false}
							trackResize={false}
							zoomControl={false}
							style={{
								height: 160,
								zIndex: 0,
							}}
						>
							<TileLayer
								attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
								url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
							/>
							<Marker position={[gps_lat, gps_long]} />
						</MapContainer>
					</motion.div>
					<motion.div
						className="title-container"
						layoutId={`title-container-${code}`}
					>
						<h2>{code}</h2>
						{active ? <Warning style={{ color: "#CC1B29" }} /> : null}
						{verified ? <VerifiedUser style={{ color: "#387600" }} /> : null}
					</motion.div>
				</motion.div>
			</div>
			<Link
				to={`/private/${code}`}
				className={`card-open-link`}
				onClick={() => {
					setID(code);
				}}
			/>
		</li>
	);
}

function List(props) {
	return (
		<>
			{props.data ? (
				<ul className="card-list" style={{ width: "calc(100% + 25px)" }}>
					{props.data.map((card, index) => (
						<Card
							key={index}
							{...card}
							setID={props.setID}
							isSelected={card.id === props.selectedId}
						/>
					))}
				</ul>
			) : null}
		</>
	);
}

export default List;
