import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { setTitle } from "../../actions/generalActions";

import { useIntl, FormattedMessage } from "react-intl";

import { Grid, Paper, Typography, makeStyles, Hidden } from "@material-ui/core";

import { MoneyOff, Place, CheckCircleOutline } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
	wrapper: {
		position: "relative",
		width: "100%",
		height: "100%",
		overflowY: "hidden",
	},
	background: {
		position: "absolute",
		top: "0px",
		left: "0px",
		width: "100%",
		zIndex: 0,
	},
	foreground: {
		position: "relative",
		zIndex: 50,
		width: "100%",
		paddingBottom: "25px",
		overflowY: "hidden",
		[theme.breakpoints.up("md")]: {
			margin: "auto",
			maxWidth: "1300px",
			padding: "0px 50px 25px 50px",
			width: "calc(100% - 100px)",
		},
	},
	section1: {
		height: "calc(100vh - 64px)",
		width: "100%",
		position: "relative",
	},
	section1Content: {
		position: "absolute",
		transform: "translate(-50%, -50%)",
		top: "50%",
		left: "50%",
		width: "100%",
	},
	title: {
		marginTop: "40px",
		color: "white",
		fontFamily: "'Open sans', sans-serrif",
		[theme.breakpoints.only("xs")]: {
			textAlign: "center",
			width: "75%",
			maxWidth: "328.5px",
			fontSize: "32px",
			fontWeight: "700",
			marginLeft: "50%",
			transform: "translate(-50%, 0%)",
			lineHeight: 1.2,
		},
		[theme.breakpoints.only("sm")]: {
			textAlign: "center",
			width: "75%",
			maxWidth: "400px",
			fontSize: "40px",
			fontWeight: "700",
			marginLeft: "50%",
			transform: "translate(-50%, 0%)",
			lineHeight: 1.2,
		},
		[theme.breakpoints.up("md")]: {
			textAlign: "left",
			width: "75%",
			maxWidth: "688px",
			fontSize: "51.2px",
			fontWeight: "800",
			lineHeight: 1.2,
		},
	},
	description: {
		color: "white",
		fontFamily: "'Open sans', sans-serrif",
		fontWeight: "300",
		[theme.breakpoints.only("xs")]: {
			textAlign: "center",
			width: "87.5%",
			marginTop: "25px",
			marginLeft: "auto",
			marginRight: "auto",
			fontSize: "19.2px",
		},
		[theme.breakpoints.only("sm")]: {
			textAlign: "center",
			width: "75%",
			marginTop: "25px",
			marginLeft: "auto",
			marginRight: "auto",
			fontSize: "20px",
		},
		[theme.breakpoints.up("md")]: {
			textAlign: "left",
			marginTop: "25px",
			fontSize: "22px",
			width: "100%",
		},
	},
	buttonWrapper: {
		display: "flex",

		[theme.breakpoints.down("sm")]: {
			justifyContent: "center",
			padding: "25px 0px 0px 0px",
		},
		[theme.breakpoints.up("md")]: {
			justifyContent: "flex-start",
			padding: "25px 50px 0px 0px",
		},
	},
	button: {
		// position: "absolute",
		backgroundColor: "red",
		borderRadius: "25px",
		height: "50px",
		padding: "6px 18px",
		color: "white",
		fontSize: "16px",
		[theme.breakpoints.down("sm")]: {
			// transform: "translate(-50%, 0%)",
			// left: "50%",
			// bottom: "25px",
		},
		[theme.breakpoints.up("md")]: {
			// right: "50px",
			// bottom: "50px",
			marginTop: "50px",
		},
	},
	section: { width: "100%" },
	sectionTitle: {
		position: "relative",
		width: "100%",
		height: "150px",
	},
	sectionFirstTitle: {
		position: "absolute",
		top: "50%",
		fontFamily: "'Open sans', sans-serrif",
		color: "#ffffff",
		width: "100%",
		textAlign: "center",
		letterSpacing: "6px",
		fontWeight: "700",
		transform: "translate(0%, -50%)",
		lineHeight: 0.9,

		[theme.breakpoints.down("sm")]: {
			fontSize: "27.5px",
		},
		[theme.breakpoints.up("md")]: {
			fontSize: "59.2px",
		},
	},
	sectionScondTitle: {
		position: "absolute",
		top: "50%",
		fontFamily: "'Open sans', sans-serrif",
		color: "#ffffff",
		opacity: "37.5%",
		width: "100%",
		textAlign: "center",
		letterSpacing: "7.5px",
		textTransform: "uppercase",
		fontWeight: "800",
		transform: "translate(0%, -50%)",

		[theme.breakpoints.down("sm")]: {
			display: "none",
		},
		[theme.breakpoints.only("md")]: {
			letterSpacing: "5px",
		},
		[theme.breakpoints.up("md")]: {
			fontSize: "100px",
		},
	},
	sectionContent: {
		width: "calc(100% - 100px)",
		padding: "0px 50px",
		overflowY: "hidden",
	},
	sectionCard: {
		height: "auto",
		width: "calc(100% - 40px)",
		padding: "10px 20px",
	},

	img: {
		height: "auto",
		width: "calc(100% - 48px)",
		position: "absolute",
		top: "50%",
		transform: "translate(0%, -50%)",
	},
}));

function FunctionsOverview(props) {
	const intl = useIntl();
	const classes = useStyles();

	React.useEffect(() => {
		props.setTitle(intl.formatMessage({ id: "FUNCTIONS_OVERVIEW" }));
		return () => {
			props.setTitle();
		};
	}, []);

	return (
		<div className={classes.wrapper}>
			<div className={classes.background}>
				<div
					style={{
						backgroundColor: "#378d40",
						width: "100%",
						height: "102.5vh",
						marginBottom: "-10px",
					}}
				></div>
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
					<path
						fill="#378d40"
						fillOpacity={1}
						d="M0,224L60,234.7C120,245,240,267,360,240C480,213,600,139,720,117.3C840,96,960,128,1080,128C1200,128,1320,96,1380,80L1440,64L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"
					></path>
				</svg>
			</div>
			<div className={classes.foreground}>
				<section className={classes.section1}>
					<div className={classes.section1Content}>
						<Grid container>
							<Grid item xs={12} md={6}>
								<Typography className={classes.title}>
									<FormattedMessage id="FUNCTIONS_MORE" />
								</Typography>
								<Typography className={classes.description}>
									<FormattedMessage id="ABOUT_DESCRIPTION" />
								</Typography>
							</Grid>
							<Hidden smDown>
								<Grid item md={6} style={{ position: "relative" }}></Grid>
							</Hidden>
						</Grid>
					</div>
				</section>

				<section className={classes.section}>
					<div className={classes.sectionTitle}>
						<Typography className={classes.sectionFirstTitle}>
							<FormattedMessage id="ABOUT_SECTION_WHY_1TITLE" />
						</Typography>
						<Typography className={classes.sectionScondTitle}>
							<FormattedMessage id="ABOUT_SECTION_WHY_2TITLE" />
						</Typography>
					</div>
					<div className={classes.sectionContent}>
						<Grid container spacing={4} style={{ justifyContent: "center" }}>
							<Grid item xs={12} sm={6} md={4}>
								<Paper className={classes.sectionCard}>
									<div
										style={{
											width: "100%",
											display: "flex",
											justifyContent: "center",
											marginBottom: "10px",
										}}
									>
										<MoneyOff style={{ color: "#378d40", fontSize: "36px" }} />
									</div>
									<Typography
										style={{
											width: "100%",
											textAlign: "center",
											fontWeight: "bold",
											color: "#3f3f3f",
										}}
									>
										<FormattedMessage id="ABOUT_SECTION_WHY_1_TITLE" />
									</Typography>
									<Typography
										style={{
											width: "100%",
											textAlign: "center",
											color: "#444444",
										}}
									>
										<FormattedMessage id="ABOUT_SECTION_WHY_1_CONTENT" />
									</Typography>
								</Paper>
							</Grid>
							<Grid item xs={12} sm={6} md={4}>
								<Paper className={classes.sectionCard}>
									<div
										style={{
											width: "100%",
											display: "flex",
											justifyContent: "center",
											marginBottom: "10px",
										}}
									>
										<Place style={{ color: "#378d40", fontSize: "36px" }} />
									</div>
									<Typography
										style={{
											width: "100%",
											textAlign: "center",
											fontWeight: "bold",
											color: "#3f3f3f",
										}}
									>
										<FormattedMessage id="ABOUT_SECTION_WHY_2_TITLE" />
									</Typography>
									<Typography
										style={{
											width: "100%",
											textAlign: "center",
											color: "#444444",
										}}
									>
										<FormattedMessage id="ABOUT_SECTION_WHY_2_CONTENT" />
									</Typography>
								</Paper>
							</Grid>
							<Grid item xs={12} sm={6} md={4}>
								<Paper className={classes.sectionCard}>
									<div
										style={{
											width: "100%",
											display: "flex",
											justifyContent: "center",
											marginBottom: "10px",
										}}
									>
										<CheckCircleOutline
											style={{ color: "#378d40", fontSize: "36px" }}
										/>
									</div>
									<Typography
										style={{
											width: "100%",
											textAlign: "center",
											fontWeight: "bold",
											color: "#3f3f3f",
										}}
									>
										<FormattedMessage id="ABOUT_SECTION_WHY_3_TITLE" />
									</Typography>
									<Typography
										style={{
											width: "100%",
											textAlign: "center",
											color: "#444444",
										}}
									>
										<FormattedMessage id="ABOUT_SECTION_WHY_3_CONTENT" />
									</Typography>
								</Paper>
							</Grid>
						</Grid>
					</div>
				</section>
			</div>
		</div>
	);
}

FunctionsOverview.propTypes = {
	setTitle: PropTypes.func.isRequired,
};

export default connect(null, { setTitle })(FunctionsOverview);
