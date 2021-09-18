import React from "react";
import PropTypes from "prop-types";

import { Button } from "@material-ui/core";

import "../input.css";

import { FormattedMessage } from "react-intl";

function StepWrapper(props) {
	return (
		<>
			{props.children}
			<div
				style={{
					width: "calc(100% - 48px)",
					display: "flex",
					justifyContent: "flex-end",
					padding: "24px",
				}}
			>
				{!props.first && (
					<Button
						style={{
							background: "#bbbbbb",
							padding: "7.5px 25px",
							color: "white",
							fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
							fontSize: "15px",
							textTransform: "uppercase",
							borderRadius: "5px",
							border: "none",
							height: "40px",
						}}
						onClick={props.handleBack}
					>
						<FormattedMessage id="BACK" />
					</Button>
				)}

				{props.last ? (
					<Button
						style={{
							background: "linear-gradient(90deg, #378d40, #008259)",
							padding: "7.5px 25px",
							color: "white",
							fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
							fontSize: "15px",
							textTransform: "uppercase",
							borderRadius: "5px",
							border: "none",
							height: "40px",
							marginLeft: "10px",
						}}
						onClick={props.register}
					>
						<FormattedMessage id="AUTH_REGISTER" />
					</Button>
				) : (
					<Button
						style={{
							background: "linear-gradient(90deg, #378d40, #008259)",
							padding: "7.5px 25px",
							color: "white",
							fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
							fontSize: "15px",
							textTransform: "uppercase",
							borderRadius: "5px",
							border: "none",
							height: "40px",
							marginLeft: "10px",
						}}
						onClick={props.handleNext}
					>
						<FormattedMessage id="NEXT" />
					</Button>
				)}
			</div>
		</>
	);
}

StepWrapper.propTypes = {
	children: PropTypes.any.isRequired,
	handleBack: PropTypes.func.isRequired,
	handleNext: PropTypes.func.isRequired,
	register: PropTypes.func,
	last: PropTypes.bool,
	first: PropTypes.bool,
};

export default StepWrapper;
