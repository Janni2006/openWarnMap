import * as React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";

import { logout } from "../../actions/authActions";
import { setLanguage } from "../../actions/generalActions";

import logo from "../../logo.svg";

import ProfileDropdown from "./ProfileDropdown";

import { FormattedMessage } from "react-intl";

import { Settings } from "@mui/icons-material";

import SettingsDialog from "./SettingsDialog";

import { AppBar, Hidden, IconButton, List, ListItem, Toolbar } from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import SideDrawer from "./SideDrawer";

const useStyles = makeStyles((theme) => ({
	navListDisplayFlex: {
		display: `flex`,
		justifyContent: `space-between`,
		alignItems: "center",
	},
	logoWrapper: {
		marginTop: "2px",
		marginBottom: "-2px",
		[theme.breakpoints.up("md")]: { marginLeft: "20px" },
		[theme.breakpoints.only("sm")]: { marginLeft: "0px" },
		[theme.breakpoints.only("xs")]: { marginLeft: "-12px" },
	},
	linkText: {
		textDecoration: `none`,
		color: `white`,
		fontSize: "18px",
		fontFamily: "sans-serif",
		"&:hover": {
			color: "#cfcfcf",
		},
	},
	linkLogin: {
		textDecoration: `none`,
		color: `white`,
		fontSize: "18px",
		fontFamily: "sans-serif",
		height: "37px",
		border: "2px solid #bbbbbb",
		borderRadius: "18.5px",
		"&:hover": {
			backgroundColor: "#bbbbbb",
		},
	},
	linkReg: {
		textDecoration: `none`,
		color: `white`,
		fontSize: "18px",
		fontFamily: "sans-serif",
		height: "37px",
		border: "2px solid #bbbbbb",
		backgroundColor: "#bbbbbb",
		borderRadius: "18.5px",
		"&:hover": {
			backgroundColor: "#3f3f3f",
		},
	},
	buttonSettings: {
		color: `white`,
		fontSize: "18px",
		marginLeft: "5px",
		"&:hover": {
			color: "#cfcfcf",
		},
	},
}));

function Header(props) {
	const classes = useStyles();
	const [open, setOpen] = React.useState(false);

	return <>
        <AppBar style={{ position: "fixed" }}>
            <Toolbar
                component="nav"
                style={{ display: "flex", justifyContent: "space-between" }}
            >
                <Link to={"/"} className={classes.logoWrapper}>
                    <img src={logo} alt="EPS Warner" style={{ height: "60px" }} />
                </Link>

                <Hidden lgDown>
                    <List
                        component="nav"
                        aria-labelledby="main navigation"
                        className={classes.navListDisplayFlex}
                    >
                        <Link
                            to={"/"}
                            style={{
                                textDecoration: "none",
                            }}
                        >
                            <ListItem className={classes.linkText}>
                                <FormattedMessage id="NAVBAR_HOME" />
                            </ListItem>
                        </Link>
                        <Link
                            to={"/about"}
                            style={{
                                textDecoration: "none",
                            }}
                        >
                            <ListItem className={classes.linkText}>
                                <FormattedMessage id="NAVBAR_ABOUT" />
                            </ListItem>
                        </Link>
                        <Link
                            to={"/functions"}
                            style={{
                                textDecoration: "none",
                            }}
                        >
                            <ListItem className={classes.linkText}>
                                <FormattedMessage id="NAVBAR_FUNCTIONS" />
                            </ListItem>
                        </Link>
                        {!props.progress ? (
                            <>
                                {!props.isAuthenticated ? (
                                    <>
                                        <Link
                                            to={"/login"}
                                            style={{
                                                textDecoration: "none",
                                            }}
                                        >
                                            <ListItem className={classes.linkLogin}>
                                                <FormattedMessage id="NAVBAR_LOGIN" />
                                            </ListItem>
                                        </Link>
                                        <Link
                                            to={"/register"}
                                            style={{
                                                textDecoration: "none",
                                                marginLeft: "16px",
                                            }}
                                        >
                                            <ListItem className={classes.linkReg}>
                                                <FormattedMessage id="NAVBAR_REGISTER" />
                                            </ListItem>
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        <Link
                                            to="/add"
                                            style={{
                                                textDecoration: "none",
                                            }}
                                        >
                                            <ListItem className={classes.linkText}>
                                                <FormattedMessage id="NAVBAR_ADD" />
                                            </ListItem>
                                        </Link>
                                        <ProfileDropdown />
                                    </>
                                )}
                            </>
                        ) : null}
                        <IconButton
                            onClick={() => {
                                setOpen(true);
                            }}
                            className={classes.buttonSettings}
                            size="large">
                            <Settings />
                        </IconButton>
                    </List>
                </Hidden>
                <Hidden mdUp>
                    <List
                        component="nav"
                        aria-labelledby="main navigation"
                        className={classes.navListDisplayFlex}
                        style={{ padding: "0px" }}
                    >
                        <Hidden mdDown>
                            {!props.progress && props.isAuthenticated ? (
                                <Link
                                    to="/add"
                                    style={{
                                        textDecoration: "none",
                                        marginRight: "20px",
                                    }}
                                >
                                    <ListItem className={classes.linkText}>
                                        <FormattedMessage id="NAVBAR_ADD" />
                                    </ListItem>
                                </Link>
                            ) : null}
                        </Hidden>

                        <SideDrawer
                            openSettings={() => {
                                setOpen(true);
                            }}
                        />
                    </List>
                </Hidden>
            </Toolbar>
        </AppBar>
        <SettingsDialog open={open} onClose={() => setOpen(false)} />
    </>;
}

Header.propTypes = {
	isAuthenticated: PropTypes.bool.isRequired,
	progress: PropTypes.bool.isRequired,
	logout: PropTypes.func.isRequired,
	setLanguage: PropTypes.func.isRequired,
	language: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
	isAuthenticated: state.auth.isAuthenticated,
	progress: state.auth.progress,
	language: state.general.language,
});

export default connect(mapStateToProps, { logout, setLanguage })(
	withRouter(Header)
);
