import * as React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import { Drawer, IconButton, List, ListItem, Divider } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Menu, Close } from "@material-ui/icons";
import { useState } from "react";

import { FormattedMessage } from "react-intl";

const useStyles = makeStyles((theme) => ({
	drawer: { zIndex: theme.zIndex.drawer },
	list: {
		width: "100vw",
		height: "100vh",
		backgroundColor: "#3f3f3f",
		overflowY: "hidden",
	},
	linkText: {
		textDecoration: "none",
		color: "white",
		fontSize: "24px",
		fontFamily: "sans-serif",
		textAlign: "center",
		width: "100%",
	},
}));

function SideDrawer(props) {
	const { isAuthenticated, progress, openSettings } = props;
	const classes = useStyles();
	const [drawerOpen, setDrawerOpen] = useState(false);

	const toggleDrawer = (open) => (event) => {
		if (
			event.type === "keydown" &&
			(event.key === "Tab" || event.key === "Shift")
		) {
			return;
		}

		setDrawerOpen(open);
	};

	function sideDrawerList(authenticated, progress) {
		return (
			<div className={classes.list} role="presentation">
				<div style={{ display: "flex", justifyContent: "flex-end" }}>
					<IconButton onClick={toggleDrawer(false)}>
						<Close fontSize="large" style={{ color: "white" }} />
					</IconButton>
				</div>
				<List component="nav" style={{ width: "100%" }}>
					<ListItem>
						<Link
							to={"/"}
							className={classes.linkText}
							onClick={toggleDrawer(false)}
						>
							<FormattedMessage id="NAVBAR_HOME" />
						</Link>
					</ListItem>

					<ListItem>
						<Link
							to={"/about"}
							className={classes.linkText}
							onClick={toggleDrawer(false)}
						>
							<FormattedMessage id="NAVBAR_ABOUT" />
						</Link>
					</ListItem>
					<ListItem>
						<Link
							className={classes.linkText}
							onClick={() => {
								setDrawerOpen(false);
								openSettings();
							}}
						>
							<FormattedMessage id="SETTINGS_TITLE" />
						</Link>
					</ListItem>
					{!progress ? (
						<>
							{!authenticated ? (
								<>
									<ListItem>
										<Link
											to={"/login"}
											className={classes.linkText}
											onClick={toggleDrawer(false)}
										>
											<FormattedMessage id="NAVBAR_LOGIN" />
										</Link>
									</ListItem>
									<ListItem>
										<Link
											to={"/register"}
											className={classes.linkText}
											onClick={toggleDrawer(false)}
										>
											<FormattedMessage id="NAVBAR_REGISTER" />
										</Link>
									</ListItem>
								</>
							) : (
								<>
									<ListItem>
										<Link
											to="/add"
											className={classes.linkText}
											onClick={toggleDrawer(false)}
										>
											<FormattedMessage id="NAVBAR_ADD" />
										</Link>
									</ListItem>
									<Divider
										style={{ backgroundColor: "#7a7a7a", margin: "5px 25px" }}
									/>
									<ListItem>
										<Link
											to="/profile"
											className={classes.linkText}
											onClick={toggleDrawer(false)}
										>
											<FormattedMessage id="NAVBAR_PROFILE" />
										</Link>
									</ListItem>
									<ListItem>
										<Link
											to="/private"
											className={classes.linkText}
											onClick={toggleDrawer(false)}
										>
											<FormattedMessage id="NAVBAR_PRIVATE_ENTRYS" />
										</Link>
									</ListItem>
									<ListItem>
										<Link
											to="/logout"
											className={classes.linkText}
											onClick={toggleDrawer(false)}
										>
											<FormattedMessage id="NAVBAR_LOGOUT" />
										</Link>
									</ListItem>
								</>
							)}
						</>
					) : null}
				</List>
			</div>
		);
	}

	return (
		<React.Fragment>
			<IconButton edge="start" aria-label="menu" onClick={toggleDrawer(true)}>
				<Menu fontSize="large" style={{ color: `white` }} />
			</IconButton>

			<Drawer
				anchor="left"
				open={drawerOpen}
				onOpen={toggleDrawer(true)}
				onClose={toggleDrawer(false)}
				className={classes.drawer}
			>
				{sideDrawerList(isAuthenticated, progress)}
			</Drawer>
		</React.Fragment>
	);
}

SideDrawer.propTypes = {
	isAuthenticated: PropTypes.bool.isRequired,
	progress: PropTypes.bool.isRequired,
	openSetttings: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
	isAuthenticated: state.auth.isAuthenticated,
	progress: state.auth.progress,
});

export default connect(mapStateToProps)(SideDrawer);
