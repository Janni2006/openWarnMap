import React from "react";
import PropTypes from "prop-types";

import { makeStyles } from "@material-ui/core";

import { motion, AnimateSharedLayout } from "framer-motion";

const useStyles = makeStyles((theme) => ({
	wrapper: {
		width: "100%",
		background: "#ffffff",
		padding: "20px 10px 2.5px",
		margin: "0px -10px",
		boxSizing: "border-box",
		outline: "none",
	},
	input_data: {
		height: "30px",
		width: "100%",
		margin: 0,
		padding: 0,
		outline: "none",
		position: "relative",
	},
	input: {
		height: "100%",
		width: "100%",
		border: "none",
		fontSize: "17px",
		outline: "none",
		margin: 0,
		padding: 0,
	},
	underline: {
		height: "2px",
		width: "100%",
		backgroundColor: "#cccccc",
		position: "absolute",
		bottom: "2px",
	},
	errorUnderline: {
		height: "2px",
		width: "100%",
		backgroundColor: "red",
		position: "absolute",
		bottom: "2px",
	},
	label: {
		position: "absolute",
		bottom: "25px",
		left: 0,
		color: "#cccccc",
		pointerEvents: "none",
		margin: 0,
		padding: 0,
		boxSizing: "border-box",
		outline: "none",
	},
	secondLabel: {
		position: "absolute",
		bottom: "7.5px",
		left: 0,
		color: "#cccccc",
		pointerEvents: "none",
		margin: 0,
		padding: 0,
		boxSizing: "border-box",
		outline: "none",
	},
	error: { color: "red", fontSize: "12px" },
}));

function InputField(props) {
	const [open, setOpen] = React.useState(false);
	const classes = useStyles();

	React.useEffect(() => {
		if (props.input != "") {
			setOpen(true);
		}
	}, [props.input]);

	React.useEffect(() => console.log(props.underline), [props.underline]);

	function onFocus() {
		setOpen(true);
		console.log("Focus");
	}

	function onBlur() {
		if (props.input == "") {
			setOpen(false);
			console.log("Blur");
		}
	}

	return (
		<>
			<div className={classes.wrapper}>
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
	input: PropTypes.string.isRequired,
	type: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
	name: PropTypes.string.isRequired,
};

export default InputField;
