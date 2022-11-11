import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { Link } from "react-router-dom";

import makeStyles from '@mui/styles/makeStyles';
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import { Hidden } from "@mui/material";

const useStyles = makeStyles((theme) => ({
	actionButton: {
		position: "fixed",
		bottom: "47px",
		right: "10px",
	},
}));

function AddActionButton(props) {
	const classes = useStyles();

	return (
		<>
			{props.isAuthenticated && !props.popupOpened ? (
				<Hidden smUp>
					<Link to="/add">
						<Fab
							color="primary"
							aria-label="add"
							className={classes.actionButton}
						>
							<AddIcon />
						</Fab>
					</Link>
				</Hidden>
			) : null}
		</>
	);
}

AddActionButton.propTypes = {
	isAuthenticated: PropTypes.bool.isRequired,
	popupOpened: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
	isAuthenticated: state.auth.isAuthenticated,
	popupOpened: state.map.markerPopup.open,
});

export default connect(mapStateToProps)(AddActionButton);
