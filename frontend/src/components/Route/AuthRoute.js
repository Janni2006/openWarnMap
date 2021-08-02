import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { Route, Redirect } from "react-router-dom";

class AuthRoute extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return !this.props.progress ? (
			<Route
				{...this.props.exact}
				render={({ location }) =>
					this.props.authenticated === this.props.isAuthenticated ? (
						this.props.children
					) : (
						<>
							{!this.props.progress ? (
								<Redirect
									to={{
										pathname: "/",
										state: { from: location },
									}}
								/>
							) : null}
						</>
					)
				}
			/>
		) : null;
	}
}

AuthRoute.propTypes = {
	isAuthenticated: PropTypes.bool.isRequired,
	progress: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
	isAuthenticated: state.auth.isAuthenticated,
	progress: state.auth.progress,
});

export default connect(mapStateToProps)(AuthRoute);
