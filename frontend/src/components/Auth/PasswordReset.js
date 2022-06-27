import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { Button } from "@mui/material";

import { setTitle } from "../../actions/generalActions";

import { useIntl, FormattedMessage } from "react-intl";

import InputField from "../InputField";
import AuthWrapper from "./AuthWrapper";

function PasswordReset(props) {
	const [input, setInput] = React.useState({});

	const intl = useIntl();

	React.useEffect(() => {
		props.setTitle(intl.formatMessage({ id: "AUTH_PASSWORD_RESET_TITLE" }));

		return () => {
			props.setTitle();
		};
	}, []);

	return <AuthWrapper></AuthWrapper>;
}

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, { setTitle })(PasswordReset);
