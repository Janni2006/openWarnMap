import React from "react";
import PropTypes from "prop-types";

import { CircularProgress } from "@mui/material";
import CheckIcon from "@material-ui/icons/Check";

import "./input.css";

function InputField(props) {
	const [valid, setValid] = React.useState({ state: false, last_change: 0 });

	React.useEffect(() => {
		if (props.valid) {
			setValid({ state: true, last_change: new Date() });
			setTimeout(() => {
				if (props.valid && valid.last_change <= new Date() - 2500) {
					setValid({ state: true, last_change: 0 });
				}
			}, 3000);
		} else {
			setValid({ state: true, last_change: 0 });
		}
	}, [props.valid]);

	React.useEffect(() => {
		console.log(typeof props.underline);
	}, [props.underline]);

	return (
		<>
			<div
				className={"wrapper"}
				style={{
					marginLeft: "-10px",
					marginRight: "-10px",
					marginTop: "15px",
				}}
			>
				<div className={"input-data"}>
					<input
						type={props.type}
						name={props.name}
						value={props.input}
						onChange={props.onChange}
						disabled={props.disabled}
						// onKeyUp={() => {
						// 	if (typeof props.onKeyUp == "function") {
						// 		props.onKeyUp();
						// 	}
						// }}
						onSubmit={() => {
							if (typeof props.onSubmit == "function") {
								props.onSubmit();
							}
						}}
						placeholder=" "
						required
						autoComplete={props.autoComplete}
					/>
					<div className={"underline"} />
					{props.error ? (
						<div
							style={{
								height: "2px",
								width: "100%",
								backgroundColor: "red",
								position: "absolute",
								bottom: "2px",
							}}
						/>
					) : null}
					<div
						style={{
							position: "absolute",
							bottom: "2px",
							right: "0px",
						}}
					>
						{props.progress && <CircularProgress size="20px" />}
						{valid.state ?? <CheckIcon style={{ fontColor: "#378d40" }} />}
					</div>
					{typeof props.underline == "object" ?? props.underline}

					<label>{props.placeholder}</label>
				</div>
			</div>
			<div
				style={{
					color: "red",
					fontSize: "12px",
				}}
			>
				{props.error}
			</div>
		</>
	);
}

InputField.propTypes = {
	underline: PropTypes.object,
	error: PropTypes.any,
	placeholder: PropTypes.string.isRequired,
	disabled: PropTypes.bool,
	input: PropTypes.string,
	type: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
	onKeyUp: PropTypes.func,
	onSubmit: PropTypes.func,
	name: PropTypes.string.isRequired,
	progress: PropTypes.bool,
	valid: PropTypes.bool,
	autoComplete: PropTypes.string,
};

export default InputField;
