import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { visitPage, setTitle } from "../../actions/generalActions";

import { Switch, withRouter, Route, Redirect } from "react-router-dom";

import PublicRoute from "./PublicRoute";
import AuthRoute from "./AuthRoute";

import About from "../About/About";
import Map from "../Map/Map";

import Login from "../Auth/Login";
import Register from "../Auth/Register";
import Logout from "../Auth/Logout";
import AddEntry from "../AddEntry";
import Profile from "../Private/Profile/Profile";
import PrivateEntrys from "../Private/PrivateEntrys";
import PublicProfile from "../PublicProfile";

import NotFound from "../NotFound";

class Routes extends Component {
	componentDidUpdate() {
		this.props.visitPage();
	}

	render() {
		return (
			<Switch>
				<PublicRoute path="/" exact>
					<Map />
				</PublicRoute>
				<PublicRoute path="/about" exact>
					<About />
				</PublicRoute>
				<PublicRoute path="/user/:user">
					<PublicProfile />
				</PublicRoute>
				{/* Auth */}
				<Route
					exact
					path="/login"
					render={({ location }) =>
						!this.props.isAuthenticated ? (
							<Login />
						) : (
							<Redirect
								to={{
									pathname: "/",
									state: { from: location },
								}}
							/>
						)
					}
				/>
				<Route
					exact
					path="/register"
					render={({ location }) =>
						!this.props.isAuthenticated ? (
							<Register />
						) : (
							<Redirect
								to={{
									pathname: "/",
									state: { from: location },
								}}
							/>
						)
					}
				/>
				<AuthRoute authenticated={true} path="/logout" exact>
					<Logout />
				</AuthRoute>
				{/* Private Profile */}
				<AuthRoute authenticated={true} path="/profile" exact>
					<Profile />
				</AuthRoute>
				<AuthRoute
					authenticated={true}
					path={["/private/:id", "/private"]}
					exact
				>
					<PrivateEntrys />
				</AuthRoute>
				{/*Add Entry*/}
				<AuthRoute authenticated={true} path="/add" exact>
					<AddEntry />
				</AuthRoute>
				{/* Not Found */}
				<PublicRoute>
					<NotFound />
				</PublicRoute>
			</Switch>
		);
	}
}

Routes.propTypes = {
	isAuthenticated: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
	isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { visitPage, setTitle })(
	withRouter(Routes)
);
