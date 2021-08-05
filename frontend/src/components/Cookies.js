import CookieConsent from "react-cookie-consent";

import React, { Component } from "react";

import { FormattedMessage } from "react-intl";

class Cookies extends Component {
	render() {
		return (
			<CookieConsent
				location="bottom"
				buttonText="Okay!!"
				cookieName="cookieConsent"
				style={{ background: "#2B373B" }}
				buttonStyle={{
					background: "white",
					color: "#4EAF47",
					fontSize: "1rem",
				}}
				expires={150}
			>
				<FormattedMessage id="COOKIE_CONSENT" />
			</CookieConsent>
		);
	}
}

export default Cookies;
