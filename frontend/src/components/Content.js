import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { Helmet } from "react-helmet-async";

import { IntlProvider } from "react-intl";
import messages from "../i18n/messages";

import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

import Navbar from "./Navbar/Navbar";
import Footer from "./Footer";
import Routes from "./Route/Routes";
import Cookies from "./Cookies";

function Content(props) {
	return (
		<>
			<IntlProvider
				textComponent={React.Fragment}
				locale={props.locale}
				messages={messages[props.locale]}
			>
				<Helmet>
					<title>{props.pageTitle}</title>
				</Helmet>
				<Navbar />
				<div
					style={{
						marginTop: "64px",
						width: "100%",
						position: "absolute",
						backgroundColor: "#dddddd",
						minHeight: "calc(100vh - 90px)",
						display: "block",
					}}
				>
					<div style={{ minHeight: "calc(100vh - 90px)" }}>
						<Routes />
						<ToastContainer
							autoClose={5000}
							position="bottom-left"
							newestOnTop
							closeOnClick
							pauseOnFocusLoss
							pauseOnHover
							draggable
						/>
					</div>
					<Cookies />
					<Footer />
				</div>
			</IntlProvider>
		</>
	);
}

Content.propTypes = {
	pageTitle: PropTypes.string.isRequired,
	locale: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
	pageTitle: state.general.pageTitle,
	locale: state.general.language,
});

export default connect(mapStateToProps)(Content);
