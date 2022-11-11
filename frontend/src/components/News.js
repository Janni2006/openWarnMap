import React, { Component } from "react";

import Breadcrumbs from "./Breadcrumbs";

import { withRouter } from "react-router-dom";

import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

class News extends Component {
	render() {
		return (
			<div>
				<Breadcrumbs
					content={[{ link: this.props.location.pathname, title: "News" }]}
				/>
				<Container fixed>
					<Typography variant="body1"></Typography>
				</Container>
				{this.props.button ? (
					<Button
						style={{ marginTop: "20px" }}
						variant="contained"
						color="primary"
						onClick={() => {
							this.props.history.push(this.props.button.link);
						}}
					>
						{this.props.button.title}
					</Button>
				) : (
					<Button
						style={{ marginTop: "20px" }}
						variant="contained"
						color="primary"
						onClick={() => {
							this.props.history.push("/");
						}}
					>
						Back
					</Button>
				)}
			</div>
		);
	}
}

export default withRouter(News);
