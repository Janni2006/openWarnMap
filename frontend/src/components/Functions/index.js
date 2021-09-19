import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { setTitle } from "../../actions/generalActions";

import { Grid, Paper, Typography } from "@material-ui/core";

function FunctionsOverview(props) {
	React.useEffect(() => {
		props.setTitle(`More functions`);
		return () => {
			props.setTitle();
		};
	}, []);

	return <></>;
}

FunctionsOverview.propTypes = {
	setTitle: PropTypes.func.isRequired,
};

export default connect(null, { setTitle })(FunctionsOverview);
