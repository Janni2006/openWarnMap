import React from "react";
import PropTypes from "prop-types";

import CircularProgress from "@mui/material/CircularProgress";
import { Button } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import { green } from "@mui/material/colors";

const useStyles = makeStyles({
	root: {
		display: "flex",
		alignItems: "center",
		marginTop: "25px",
	},
	wrapper: {
		position: "relative",
	},
	buttonProgress: {
		color: green[500],
		position: "absolute",
		top: "50%",
		left: "50%",
		marginTop: -12,
		marginLeft: -12,
	},
});

function SubmitButton(props) {
	const classes = useStyles();
	const [loading, setLoading] = React.useState(false);
	const [success, setSuccess] = React.useState(false);

	React.useEffect(() => {
		setLoading(props.loading);
		setSuccess(props.success);
	}, [props]);

	return (
		<div className={classes.root}>
			<div className={classes.wrapper}>
				{props.onClick ? (
					<Button
						style={{
							background: loading
								? "#bbbbbb"
								: success
								? green[500]
								: "linear-gradient(90deg, #378d40, #008259)",
							padding: "7.5px 25px",
							color: "white",
							fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
							fontSize: "15px",
							textTransform: "uppercase",
							borderRadius: "5px",
							border: "none",
							height: "60px",
						}}
						onClick={props.onClick}
					>
						{props.title}
					</Button>
				) : (
					<input
						type="submit"
						style={{
							background: loading
								? "#bbbbbb"
								: success
								? green[500]
								: "linear-gradient(90deg, #378d40, #008259)",
							padding: "7.5px 25px",
							color: "white",
							fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
							fontSize: "15px",
							textTransform: "uppercase",
							borderRadius: "5px",
							border: "none",
							height: "60px",
							cursor: "pointer",
						}}
						value={props.title}
					/>
				)}
				{loading && (
					<CircularProgress size={24} className={classes.buttonProgress} />
				)}
			</div>
		</div>
	);
}

SubmitButton.propTypes = {
	title: PropTypes.string,
	loading: PropTypes.bool,
	success: PropTypes.bool,
	onClick: PropTypes.func,
};

export default SubmitButton;
