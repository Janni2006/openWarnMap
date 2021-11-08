import React, { Component } from "react";

import { Link } from "react-router-dom";

import Typography from "@mui/material/Typography";

import { FormattedMessage } from "react-intl";

class Footer extends Component {
	render() {
		return (
			<footer style={{ position: "absolute", width: "100%", zIndex: 1 }}>
				<div
					style={{
						height: "24px",
						backgroundColor: "#3f3f3f",
						textAlign: "center",
						paddingTop: "2px",
					}}
				>
					<div style={{ color: "white", height: "100%" }}>
						<Link
							to={"/impressum"}
							style={{ textDecoration: "none", color: "inherit" }}
						>
							<FormattedMessage id="NAVBAR_IMPRESSUM" />
						</Link>
						<Typography
							style={{
								margin: "0px 10px 0px 10px",
								display: "initial",
								fontSize: "1rem",
							}}
						>
							|
						</Typography>
						<Link
							to={"/privacy"}
							style={{ textDecoration: "none", color: "inherit" }}
						>
							<FormattedMessage id="NAVBAR_PRIVACY" />
						</Link>
						<Typography
							style={{
								margin: "0px 10px 0px 10px",
								display: "initial",
								fontSize: "1rem",
							}}
						>
							|
						</Typography>
						<Link
							to={"/news"}
							style={{ textDecoration: "none", color: "inherit" }}
						>
							<FormattedMessage id="NAVBAR_NEWS" />
						</Link>
					</div>
				</div>
			</footer>
		);
	}
}

export default Footer;
