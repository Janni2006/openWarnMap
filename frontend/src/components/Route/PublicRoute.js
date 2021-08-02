import React, { Component } from "react";
import { connect } from "react-redux";

import { Route } from "react-router-dom";

class PublicRoute extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<Route
				{...this.props.exact}
				render={({ location }) => this.props.children}
			/>
		);
	}
}

export default connect(null)(PublicRoute);
