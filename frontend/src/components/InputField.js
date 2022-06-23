import React from "react";
import PropTypes from "prop-types";

// import makeStyles from "@mui/styles/makeStyles";

// import { motion, AnimateSharedLayout } from "framer-motion";

import { CircularProgress } from "@mui/material";
import CheckIcon from "@material-ui/icons/Check";

import "./input.css";

// const useStyles = makeStyles((theme) => ({
// 	wrapper: {
// 		width: "100%",
// 		background: "#ffffff",
// 		padding: "20px 10px 2.5px",
// 		margin: "0px -10px",
// 		boxSizing: "border-box",
// 		outline: "none",
// 	},
// 	input_data: {
// 		height: "30px",
// 		width: "100%",
// 		margin: 0,
// 		padding: 0,
// 		outline: "none",
// 		position: "relative",
// 	},
// 	input: {
// 		height: "100%",
// 		width: "100%",
// 		border: "none",
// 		fontSize: "17px",
// 		outline: "none",
// 		margin: 0,
// 		padding: 0,
// 	},
// 	underline: {
// 		height: "2px",
// 		width: "100%",
// 		backgroundColor: "#cccccc",
// 		position: "absolute",
// 		bottom: "2px",
// 	},
// 	errorUnderline: {
// 		height: "2px",
// 		width: "100%",
// 		backgroundColor: "red",
// 		position: "absolute",
// 		bottom: "2px",
// 	},
// 	label: {
// 		position: "absolute",
// 		bottom: "25px",
// 		left: 0,
// 		color: "#cccccc",
// 		pointerEvents: "none",
// 		margin: 0,
// 		padding: 0,
// 		boxSizing: "border-box",
// 		outline: "none",
// 	},
// 	secondLabel: {
// 		position: "absolute",
// 		bottom: "7.5px",
// 		left: 0,
// 		color: "#cccccc",
// 		pointerEvents: "none",
// 		margin: 0,
// 		padding: 0,
// 		boxSizing: "border-box",
// 		outline: "none",
// 	},
// 	error: { color: "red", fontSize: "12px" },
// }));

function InputField(props) {
	// const [open, setOpen] = React.useState(false);
	const [valid, setValid] = React.useState({ state: false, last_change: 0 });
	// const classes = useStyles();

	// React.useEffect(() => {
	// 	if (props.input != "") {
	// 		setOpen(true);
	// 	}
	// }, [props.input]);

	// React.useEffect(() => console.log(props.underline), [props.underline]);

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

	// function onFocus() {
	// 	setOpen(true);
	// 	console.log("Focus");
	// }

	// function onBlur() {
	// 	if (props.input == "") {
	// 		setOpen(false);
	// 		console.log("Blur");
	// 	}
	// }

	return (
		<>
			{/* <div className={classes.wrapper}>
				<div className={classes.input_data}>
					<input
						className={classes.input}
						type={props.type}
						name={props.name}
						value={props.input}
						onChange={props.onChange}
						id={props.name}
						disabled={props.disabled}
						onFocus={onFocus}
						onBlur={onBlur}
						onKeyUp={() => {
							if (typeof props.onKeyUp == "function") {
								props.onKeyUp();
							}
						}}
					/>
					<AnimateSharedLayout>
						{props.error ? (
							<motion.div
								layoutId={`_${props.name}-underline`}
								className={classes.errorUnderline}
							/>
						) : (
							<motion.div
								layoutId={`_${props.name}-underline`}
								className={classes.underline}
							/>
						)}
						{props.underline ? (
							<motion.div
								layoutId={`_${props.name}-secondUnderline`}
								className={classes.underline}
								style={{
									width: `${props.underline.width}%`,
									backgroundColor: props.underline.color,
								}}
							/>
						) : (
							<motion.div
								layoutId={`_${props.name}-secondUnderline`}
								className={classes.underline}
								style={{
									width: `0%`,
								}}
							/>
						)}
						{open ? (
							<motion.p
								className={classes.label}
								layoutId={`_${props.name}-label`}
							>
								{props.placeholder}
							</motion.p>
						) : (
							<motion.p
								className={classes.secondLabel}
								layoutId={`_${props.name}-label`}
							>
								{props.placeholder}
							</motion.p>
						)}
					</AnimateSharedLayout>
				</div>
			</div> */}

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
						placeholder=" "
						required
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

			{props.error && props.error != true && props.error != false && (
				<div className={classes.error}>{props.error}</div>
			)}
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
	name: PropTypes.string.isRequired,
	progress: PropTypes.bool,
	valid: PropTypes.bool,
	onKeyUp: PropTypes.func,
};

export default InputField;
