import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { Link } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import { Hidden } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
	actionButton: {
		position: "fixed",
		bottom: "47px",
		right: "10px",
	},
}));

function AddActionButton(props) {
	const classes = useStyles();

	const [popupOpen, setPopupOpen] = React.useState(false);

	React.useEffect(() => {
		console.log(props);
	}, [props.popupOpened]);

	return (
		<>
			{props.isAuthenticated && props.popupOpened ? (
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
