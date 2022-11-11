import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { setTitle } from "../actions/generalActions";

import Breadcrumbs from "./Breadcrumbs";

import { withRouter } from "react-router-dom";

import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import { FormattedMessage } from "react-intl";

class NotFound extends Component {
	componentDidMount() {
		this.forceUpdate();
		this.props.setTitle("Error");
	}

	componentWillUnmount() {
		this.props.setTitle();
	}

	render() {
		return (
			<div
				style={{
					padding: "22px",
				}}
			>
				<Breadcrumbs
					content={[{ link: this.props.location.pathname, title: "Error" }]}
				/>
				<Typography
					variant="h4"
					style={{ marginBottom: "5px", marginTop: "20px" }}
				>
					<FormattedMessage id="ERROR_404_TITLE" />
				</Typography>
				<Typography variant="body1">
					<FormattedMessage id="ERROR_404_DESCRIPTION" />
				</Typography>
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
						<FormattedMessage id="ERROR_404_BUTTON" />
					</Button>
				)}
			</div>
		);
	}
}

NotFound.propTypes = {
	setTitle: PropTypes.func.isRequired,
};

export default connect(null, { setTitle })(withRouter(NotFound));
