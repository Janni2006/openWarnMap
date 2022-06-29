import React from "react";

import AuthWrapper from "./AuthWrapper";

import { setTitle } from "../../actions/generalActions";

import { CircularProgress } from "@mui/material";

import { FormattedMessage } from "react-intl";

function AuthLoading(props) {
	return (
		<AuthWrapper>
			<p
				style={{
					textTransform: "uppercase",
					marginBottom: "50px",
					color: "#008259",
					fontSize: "25px",
				}}
			>
				<FormattedMessage id="AUTH_LOADING" />
			</p>
			<div style={{ margin: "auto", width: "10rem" }}>
				<CircularProgress color="style" size="10rem" />
			</div>
		</AuthWrapper>
	);
}

export default AuthLoading;
