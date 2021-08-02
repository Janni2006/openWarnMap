import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { setTitle } from "../actions/generalActions";

import { Grid, Paper, Typography } from "@material-ui/core";

function PublicProfile(props) {
	const [username, setUsername] = React.useState("");

	React.useEffect(() => {
		props.setTitle(`Profile ${username}`);
		return () => {
			props.setTitle();
		};
	}, [username]);

	React.useEffect(() => {
		setUsername(window.location.pathname.replace("/user", "").replace("/", ""));
	}, [window]);

	return (
		<>
			<Paper
				style={{
					maxWidth: "800px",
					width: "95vw",
					margin: "auto",
					marginTop: "8px",
				}}
			>
				<Grid container spacing={2}>
					<Grid item xs={12} sm={6} style={{ padding: "15px 2.5px 20px 30px" }}>
						<Typography
							style={{
								color: "#FFBD6D",
								fontSize: "36px",
								fontWeight: "bold",
							}}
						>
							Open Source
						</Typography>
						<Typography style={{ textAlign: "justify" }}>
							Developers across the world benefit from the Open Source software
							ecosystem and OpenWeather is not an exception. While influenced by
							the platforms like Wikipedia and OpenStreetMap, we have used the
							Open Source software in the foundation of our platform. To inspire
							the Open Source developers and to facilitate the accessibility of
							weather data, we choose to gear up those who contribute to the
							Open Source infrastructure.
						</Typography>
					</Grid>
					<Grid item xs={12} sm={6} style={{ padding: "20px" }}></Grid>
				</Grid>
			</Paper>
		</>
	);
}

PublicProfile.propTypes = {
	setTitle: PropTypes.func.isRequired,
};

export default connect(null, { setTitle })(PublicProfile);
