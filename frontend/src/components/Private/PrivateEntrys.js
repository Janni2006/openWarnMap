import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { setTitle } from "../../actions/generalActions";
import { loadPrivateData } from "../../actions/privateActions";
import { withRouter } from "react-router-dom";

import { makeStyles, withStyles } from "@material-ui/core/styles";

import { Skeleton, ToggleButton, ToggleButtonGroup } from "@material-ui/lab";

import Breadcrumbs from "../Breadcrumbs";

import { AnimateSharedLayout, AnimatePresence } from "framer-motion";

import {
	Paper,
	Grid,
	Checkbox,
	FormGroup,
	FormControlLabel,
	FormControl,
	FormLabel,
	Card,
	CardContent,
	Button,
	Divider,
	Hidden,
	Typography,
} from "@material-ui/core";

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";

import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet-defaulticon-compatibility";

import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import ListIcon from "@material-ui/icons/List";
import ViewComfyIcon from "@material-ui/icons/ViewComfy";
import ArrowDropDown from "@material-ui/icons/ArrowDropDown";

import Badge from "@material-ui/core/Badge";

import List from "./List";
import Item from "./Item";
import Dropdown from "rc-dropdown";

const useStyles = makeStyles((theme) => ({
	card: {
		maxWidth: 345,
		width: "100vw",
		margin: theme.spacing(2),
	},
	media: {
		height: 190,
	},
}));

const StyledBadge = withStyles((theme) => ({
	badge: {
		right: -10,
		top: 11,
		padding: "0",
	},
}))(Badge);

function PrivateEntrys(props) {
	const classes = useStyles();
	const [listType, setListType] = React.useState("box");
	const [selectedId, setSelectedId] = React.useState(null);
	const [index, setIndex] = React.useState(0);

	React.useEffect(() => {
		props.setTitle("Profile Entrys");

		props.loadPrivateData();

		return () => {
			props.setTitle();
		};
	}, []);

	React.useEffect(() => {
		setSelectedId(
			window.location.pathname.replace("/private", "").replace("/", "")
		);
	}, [window]);

	const setID = (id) => {
		setSelectedId(id);
	};

	const handleListType = (event, newListType) => {
		if (newListType != null) {
			setListType(newListType);
		}
	};

	React.useEffect(() => {
		setIndex(index + 1);
	}, [selectedId]);

	React.useEffect(() => {
		console.log(listType);
	}, [listType]);

	return (
		<div
			style={{
				padding: "10px 15px 0px 15px",
				maxWidth: "1300px",
				margin: "auto",
			}}
		>
			<Grid container>
				<Grid item xs={7} md={11}>
					<Breadcrumbs
						content={[
							{ link: props.location.pathname, title: "Private Entrys" },
						]}
					/>
				</Grid>
				<Grid item xs={5} md={1}>
					<Hidden mdUp>
						<Dropdown
							trigger={["click"]}
							animation="slide-up"
							overlay={
								<Paper
									style={{
										padding: "20px 40px",
										marginTop: "15px",
										color: "#cccccc",
									}}
								>
									<FormControl component="fieldset">
										<FormLabel component="legend">Label Placement</FormLabel>
										<FormGroup aria-label="position">
											<FormControlLabel
												value="active"
												control={<Checkbox color="primary" />}
												label="Active"
												labelPlacement="end"
											/>
										</FormGroup>
									</FormControl>
								</Paper>
							}
						>
							<StyledBadge
								badgeContent={<ArrowDropDown style={{ color: "#7a7a7a" }} />}
								style={{ marginRight: "10px" }}
							>
								<Typography style={{ fontSize: "16px", color: "#7a7a7a" }}>
									Filter
								</Typography>
							</StyledBadge>
						</Dropdown>
					</Hidden>
					<ToggleButtonGroup
						value={listType}
						exclusive
						onChange={handleListType}
						style={{ position: "absolute", right: "15px" }}
					>
						<ToggleButton value="box" style={{ padding: "0 2.5px" }}>
							<ViewComfyIcon />
						</ToggleButton>
						<ToggleButton value="list" style={{ padding: "0 2.5px" }}>
							<ListIcon />
						</ToggleButton>
					</ToggleButtonGroup>
				</Grid>
			</Grid>

			<Divider style={{ margin: "5px 0px 20px 0px" }} />
			<Grid container spacing={2}>
				<Hidden smDown>
					<Grid item md={2}>
						{!props.loading ? (
							<Paper style={{ height: "50vh", padding: "20px" }}>
								<FormControl component="fieldset">
									<FormLabel component="legend">Apply Filters</FormLabel>
									<FormGroup aria-label="position">
										<FormControlLabel
											value="active"
											control={<Checkbox color="primary" />}
											label="Active"
											labelPlacement="end"
										/>
									</FormGroup>
								</FormControl>
							</Paper>
						) : null}
					</Grid>
				</Hidden>
				<Grid item xs={12} md={10} style={{ overflowX: "hidden" }}>
					{/* <div
						style={{
							display: "flex",
							flexWrap: "wrap",
							margin: "auto",
							justifyContent: "center",
						}}
					> */}
					{/* {(props.loading ? Array.from(new Array(3)) : props.data).map(
							(item, index) => (
								<Card className={classes.card} key={index}>
									{props.loading ? (
										<Skeleton
											animation="wave"
											variant="rect"
											className={classes.media}
										/>
									) : (
										<MapContainer
											center={[item.gps_lat, item.gps_long]}
											zoom={10}
											scrollWheelZoom={false}
											closePopupOnClick={false}
											dragging={false}
											boxZoom={false}
											doubleClickZoom={false}
											trackResize={false}
											zoomControl={false}
											style={{
												height: 190,
												width: "100%",
											}}
										>
											<TileLayer
												attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
												url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
											/>
											<Marker
												position={[item.gps_lat, item.gps_long]}
												style={{ color: "red" }}
											/>
										</MapContainer>
									)}

									<CardContent>
										{props.loading ? (
											<React.Fragment>
												<Skeleton
													animation="wave"
													height={10}
													style={{ marginBottom: 6 }}
												/>
												<Skeleton animation="wave" height={10} width="80%" />
											</React.Fragment>
										) : (
											<>
												{item.active ? (
													<CheckCircleOutlineIcon style={{ color: "green" }} />
												) : (
													<HighlightOffIcon style={{ color: "red" }} />
												)}
												<Button
													onClick={() => {
														setOpen(true);
													}}
												>
													Test
												</Button>
											</>
										)}
									</CardContent>
								</Card>
							)
						)} */}
					<AnimateSharedLayout type="crossfade">
						{!props.loading && props.data ? (
							<>
								<List
									selectedId={selectedId}
									setID={setID}
									data={props.data}
									listType={listType}
								/>
								<AnimatePresence>
									{selectedId && (
										<Item
											id={selectedId}
											key="item"
											data={props.data}
											setID={setID}
											layout={listType}
										/>
									)}
								</AnimatePresence>
							</>
						) : null}
					</AnimateSharedLayout>
					{/* </div> */}
				</Grid>
			</Grid>
		</div>
	);
}

PrivateEntrys.propTypes = {
	setTitle: PropTypes.func.isRequired,
	loadPrivateData: PropTypes.func.isRequired,
	loading: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
	loading: state.private.loading,
	data: state.private.data,
});

export default connect(mapStateToProps, { setTitle, loadPrivateData })(
	withRouter(PrivateEntrys)
);
