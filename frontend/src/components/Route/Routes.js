import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { visitPage, setTitle } from "../../actions/generalActions";

import { Switch, withRouter, Route, Redirect } from "react-router-dom";

import PublicRoute from "./PublicRoute";
import AuthRoute from "./AuthRoute";

import About from "../About";
import Map from "../Map";

import Login from "../Auth/Login";
// import Register from "../Auth/Register";
import Logout from "../Auth/Logout";
// import PasswordReset from "../Auth/PasswordReset";
import PasswordResetRequest from "../Auth/PasswordResetRequest";
import AddEntry from "../AddEntry";
import Profile from "../Private/Profile";
import PrivateEntrys from "../Private/PrivateEntrys";
import PublicProfile from "../PublicProfile";
import News from "../News";

const Register = React.lazy(() => import("../Auth/Register"));
const PasswordReset = React.lazy(() => import("../Auth/PasswordReset"));

import { Suspense } from "react";
import AuthLoading from "../Auth/AuthLoading";
import ErrorBoundary from "../ErrorBoundary";

// import FunctionsOverview from "../Functions";

import NotFound from "../NotFound";

class Routes extends Component {
	componentDidUpdate() {
		this.props.visitPage();
	}

	render() {
		return (
			<Switch>
				<PublicRoute path="/" exact>
					<Map key="TEST" />
				</PublicRoute>
				{/* <PublicRoute path="/functions" exact>
					<FunctionsOverview />
				</PublicRoute> */}
				<PublicRoute path="/about" exact>
					<About />
				</PublicRoute>
				<PublicRoute path="/news" exact>
					<News />
				</PublicRoute>
				{/* <PublicRoute path="/user/:user">
					<PublicProfile />
				</PublicRoute> */}
				<Route path="/user/:user" exact>
					<PublicProfile />
				</Route>
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
							<ErrorBoundary>
								<Suspense fallback={<AuthLoading />}>
									<Register />
								</Suspense>
							</ErrorBoundary>
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
				<PublicRoute
					exact
					path="/reset-password"
					// render={({ location }) =>
					// 	!this.props.isAuthenticated ? (
					// 		<PasswordResetRequest />
					// 	) : (
					// 		<Redirect
					// 			to={{
					// 				pathname: "/",
					// 				state: { from: location },
					// 			}}
					// 		/>
					// 	)
					// }
				>
					<>
						{!this.props.isAuthenticated ? (
							<PasswordResetRequest />
						) : (
							<Redirect
								to={{
									pathname: "/",
								}}
							/>
						)}
					</>
				</PublicRoute>
				<Route
					exact
					path="/reset-password/:uidb64/:token"
					// render={({ location }) =>
					// 	!this.props.isAuthenticated ? (
					// 		<PasswordResetRequest />
					// 	) : (
					// 		<Redirect
					// 			to={{
					// 				pathname: "/",
					// 				state: { from: location },
					// 			}}
					// 		/>
					// 	)
					// }
				>
					<>
						{!this.props.isAuthenticated ? (
							<ErrorBoundary>
								<Suspense fallback={<AuthLoading />}>
									<PasswordReset />
								</Suspense>
							</ErrorBoundary>
						) : (
							<Redirect
								to={{
									pathname: "/",
								}}
							/>
						)}
					</>
				</Route>
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
