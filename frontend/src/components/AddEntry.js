import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { setTitle } from "../actions/generalActions";

import "leaflet/dist/leaflet.css";

import L from "leaflet";

import {
	Typography,
	withWidth,
	isWidthDown,
	IconButton,
	makeStyles,
	Grid,
	Paper,
	Button,
	Backdrop,
	CircularProgress,
} from "@material-ui/core";

import { toast } from "react-toastify";

import { Warning, Add, MyLocation, CheckCircle } from "@material-ui/icons";

import CoordinateInput from "react-coordinate-input";

import { MapContainer, TileLayer, Marker } from "react-leaflet";

import Select from "react-select";

import axios from "axios";

import { Redirect } from "react-router-dom";

import {
	useIntl,
	FormattedMessage,
	FormattedDate,
	FormattedTime,
} from "react-intl";

import marker_icon from "../media/marker-icon.png";

const useStyles = makeStyles((theme) => ({
	root: {
		maxWidth: "100%",
		height: "calc(100vh - 90px)",
	},
	paper: {
		height: 140,
		width: 100,
	},
	map: {
		height: "100%",
		width: "100%",
	},
	control: {
		padding: theme.spacing(2),
	},
	backdrop: { zIndex: 1, color: "#fff" },
	grid_create_container: { marginBottom: "15px" },
	grid_create_item_4: { display: "flex", alignItems: "center" },
}));

function AddEntry(props) {
	const classes = useStyles();
	const intl = useIntl();

	const [map, setMap] = React.useState(null);
	const [geo_a, setGeoA] = React.useState(false);
	const [loading, setLoading] = React.useState(false);
	const [success, setSuccess] = React.useState(false);
	const [position, setPosition] = React.useState([0, 0]);
	const [triedToAdd, setTriedToAdd] = React.useState(false);
	const [error, setError] = React.useState({
		error: false,
		fields: {
			position: { error: false, error_msg: "" },
			height: { error: false, error_msg: "" },
			size: { error: false, error_msg: "" },
			localization: { error: false, error_msg: "" },
			status: { error: false, error_msg: "" },
		},
	});

	const [options, setOptions] = React.useState({
		position: [0, 0],
		height: null,
		size: null,
		localization: null,
		status: null,
		created: new Date().toISOString(),
	});

	const customStyles = (error = false) => ({
		control: (provided, state) => ({
			...provided,
			borderColor: state.isFocused ? "white" : error ? "red" : "#cccccc",
			"&:hover": {
				borderColor: state.isFocused ? "white" : error ? "red" : "#aaaaaa",
			},
		}),
	});

	React.useEffect(() => {
		props.setTitle(intl.formatMessage({ id: "NAVBAR_ADD" }));
		setGeoA("geolocation" in navigator);
		return () => {
			props.setTitle();
		};
	}, []);

	React.useEffect(() => {
		map?.flyTo(position);
		setOptions({ ...options, position: position });
	}, [position]);

	React.useEffect(() => {
		if (triedToAdd) {
			checkForErrors();
		}
	}, [options]);

	function getLocation() {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				function (position) {
					setPosition([position.coords.latitude, position.coords.longitude]);
				},
				function (error) {
					toast.error(`Error Code = ${error.code} - ${error.message}`);
					console.error("Error Code = " + error.code + " - " + error.message);
				}
			);
		}
	}

	function checkForErrors() {
		var err_object = {
			error: false,
			fields: {
				position: { error: false, error_msg: "" },
				height: { error: false, error_msg: "" },
				size: { error: false, error_msg: "" },
				localization: { error: false, error_msg: "" },
				status: { error: false, error_msg: "" },
			},
		};

		if (options.position == [0, 0]) {
			err_object = {
				...err_object,
				error: true,
				fields: {
					...err_object.fields,
					position: {
						error: true,
						error_msg: "Please insert a valid coordinate input.",
					},
				},
			};
		}
		if (options.height == null) {
			err_object = {
				...err_object,
				error: true,
				fields: {
					...err_object.fields,
					height: {
						error: true,
						error_msg: intl.formatMessage({ id: "ADD_ERROR_UNDEFINED" }),
					},
				},
			};
		}
		if (options.size == null) {
			err_object = {
				...err_object,
				error: true,
				fields: {
					...err_object.fields,
					size: {
						error: true,
						error_msg: intl.formatMessage({ id: "ADD_ERROR_UNDEFINED" }),
					},
				},
			};
		}
		if (options.localization == null) {
			err_object = {
				...err_object,
				error: true,
				fields: {
					...err_object.fields,
					localization: {
						error: true,
						error_msg: intl.formatMessage({ id: "ADD_ERROR_UNDEFINED" }),
					},
				},
			};
		}
		if (options.status == null) {
			err_object = {
				...err_object,
				error: true,
				fields: {
					...err_object.fields,
					status: {
						error: true,
						error_msg: intl.formatMessage({ id: "ADD_ERROR_UNDEFINED" }),
					},
				},
			};
		}

		setError(err_object);

		if (!err_object.error) {
			return false;
		}
		return true;
	}

	function addEntry() {
		setTriedToAdd(true);
		if (!checkForErrors()) {
			setLoading(true);
			const config = {
				headers: {
					"Content-Type": "application/json",
					"X-CSRFToken": props.csrf_token,
				},
			};
			const body = JSON.stringify({
				gps_lat: options.position[0],
				gps_long: options.position[1],
				size: options.size,
				height: options.height,
				localization: options.localization,
				created: options.created,
			});
			axios
				.post("/react/create/", body, config)
				.then((res) => {
					if (res.status == 200) {
						toast.success(intl.formatMessage({ id: "ADD_SUCCESS_UPDATED" }));
					} else if (res.status == 201) {
						toast.success(intl.formatMessage({ id: "ADD_SUCCESS_ADDED" }));
					}
					setLoading(false);
					setSuccess(true);
				})
				.catch((err) => {
					setLoading(false);
					console.log(err);
					toast.error(intl.formatMessage({ id: "ADD_ERROR_BAD_REQUEST" }));
				});
		}
	}

	return (
		<>
			<div style={{ padding: "22px" }}>
				<Grid container spacing={2}>
					<Grid item xs={12} md={6}>
						<Paper
							style={{
								width: "100%",
								height: isWidthDown("sm", props.width)
									? "50vh"
									: "calc(100vh - 134px)",
								backgroundColor: "white",
							}}
						>
							<MapContainer
								center={[0, 0]}
								zoom={16}
								scrollWheelZoom={false}
								closePopupOnClick={false}
								dragging={false}
								boxZoom={false}
								doubleClickZoom={false}
								trackResize={false}
								zoomControl={false}
								style={{
									height: isWidthDown("sm", props.width)
										? "50vh"
										: "calc(100vh - 134px)",
									width: "100%",
									zIndex: 0,
								}}
								whenCreated={setMap}
							>
								<TileLayer
									attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
									url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
								/>
								<Marker position={position} />
							</MapContainer>
						</Paper>
					</Grid>

					<Grid item xs={12} md={6}>
						<Paper
							style={{
								height: "calc(100% - 50px)",
								width: "calc(100% - 50px)",
								minHeight: "300px",
								padding: "25px",
								position: "relative",
							}}
						>
							<Grid container className={classes.grid_create_container}>
								<Grid
									item
									xs={12}
									sm={4}
									className={classes.grid_create_item_4}
								>
									<Typography>
										<FormattedMessage id="ADD_GPS" />:
									</Typography>
								</Grid>
								<Grid item xs={12} sm={8}>
									<div style={{ display: "block" }}>
										<CoordinateInput
											value={`${position[0]}, ${position[1]}`}
											onChange={(value, { unmaskedValue, dd, dms }) => {
												setPosition(dd);
											}}
											style={{
												fontSize: "16px",
												border: error.fields.position.error
													? "1px solid #CC1B29"
													: "1px solid #cccccc",
												padding: "10px 8px",
												borderRadius: "5px",
												width: "200px",
												outline: "none",
											}}
										/>
										{geo_a ? (
											<IconButton
												style={{
													backgroundColor: "#7a7a7a",
													marginLeft: "10px",
													height: "36px",
													width: "36px",
												}}
												onClick={getLocation}
											>
												<MyLocation
													style={{ fontSize: "24px", color: "white" }}
												/>
											</IconButton>
										) : null}
									</div>
									{error.fields.position.error ? (
										<Typography style={{ fontSize: "12px", color: "#CC1B29" }}>
											{error.fields.position.error_msg}
										</Typography>
									) : null}
								</Grid>
							</Grid>
							<Grid container className={classes.grid_create_container}>
								<Grid
									item
									xs={12}
									sm={4}
									className={classes.grid_create_item_4}
								>
									<Typography>
										<FormattedMessage id="ADD_HEIGHT" />:
									</Typography>
								</Grid>
								<Grid item xs={12} sm={8}>
									<Select
										placeholder={intl.formatMessage({ id: "ADD_SELECT" })}
										isDisabled={loading}
										options={[
											{
												value: 0,
												label: intl.formatMessage({
													id: "ADD_HEIGHT_OPTION_1",
												}),
											},
											{
												value: 1,
												label: intl.formatMessage({
													id: "ADD_HEIGHT_OPTION_2",
												}),
											},
											{
												value: 2,
												label: intl.formatMessage({
													id: "ADD_HEIGHT_OPTION_3",
												}),
											},
										]}
										onChange={(option) => {
											setOptions({ ...options, height: option?.value });
										}}
										styles={customStyles(error.fields.height.error)}
									/>
									{error.fields.height.error ? (
										<Typography style={{ fontSize: "12px", color: "#CC1B29" }}>
											{error.fields.height.error_msg}
										</Typography>
									) : null}
								</Grid>
							</Grid>
							<Grid container className={classes.grid_create_container}>
								<Grid
									item
									xs={12}
									sm={4}
									className={classes.grid_create_item_4}
								>
									<Typography>
										<FormattedMessage id="ADD_SIZE" />:
									</Typography>
								</Grid>
								<Grid item xs={12} sm={8}>
									<Select
										placeholder={intl.formatMessage({ id: "ADD_SELECT" })}
										isDisabled={loading}
										options={[
											{
												value: 0,
												label: intl.formatMessage({
													id: "ADD_SIZE_OPTION_1",
												}),
											},
											{
												value: 1,
												label: intl.formatMessage({
													id: "ADD_SIZE_OPTION_2",
												}),
											},
											{
												value: 2,
												label: intl.formatMessage({
													id: "ADD_SIZE_OPTION_3",
												}),
											},
										]}
										onChange={(option) => {
											setOptions({ ...options, size: option?.value });
										}}
										styles={customStyles(error.fields.size.error)}
									/>
									{error.fields.size.error ? (
										<Typography style={{ fontSize: "12px", color: "#CC1B29" }}>
											{error.fields.size.error_msg}
										</Typography>
									) : null}
								</Grid>
							</Grid>
							<Grid container className={classes.grid_create_container}>
								<Grid
									item
									xs={12}
									sm={4}
									className={classes.grid_create_item_4}
								>
									<Typography>
										<FormattedMessage id="ADD_LOCALIZATION" />:
									</Typography>
								</Grid>
								<Grid item xs={12} sm={8}>
									<Select
										placeholder={intl.formatMessage({ id: "ADD_SELECT" })}
										isDisabled={loading}
										options={[
											{
												value: 0,
												label: intl.formatMessage({
													id: "ADD_LOCALIZATION_OPTION_1",
												}),
											},
											{
												value: 1,
												label: intl.formatMessage({
													id: "ADD_LOCALIZATION_OPTION_2",
												}),
											},
											{
												value: 2,
												label: intl.formatMessage({
													id: "ADD_LOCALIZATION_OPTION_3",
												}),
											},
										]}
										onChange={(option) => {
											setOptions({ ...options, localization: option?.value });
										}}
										styles={customStyles(error.fields.localization.error)}
									/>
									{error.fields.localization.error ? (
										<Typography style={{ fontSize: "12px", color: "#CC1B29" }}>
											{error.fields.localization.error_msg}
										</Typography>
									) : null}
								</Grid>
							</Grid>
							<Grid container className={classes.grid_create_container}>
								<Grid
									item
									xs={12}
									sm={4}
									className={classes.grid_create_item_4}
								>
									<Typography>
										<FormattedMessage id="ADD_STATUS" />:
									</Typography>
								</Grid>
								<Grid item xs={12} sm={8}>
									<Select
										placeholder={intl.formatMessage({ id: "ADD_SELECT" })}
										isDisabled={loading}
										options={[
											{
												value: true,
												label: (
													<div
														style={{ display: "flex", alignItems: "center" }}
													>
														<Warning style={{ color: "#CC1B29" }} />
														<Typography
															style={{
																display: "inline-block",
																marginLeft: "25px",
																color: "black",
															}}
														>
															<FormattedMessage id="ACTIVE" />
														</Typography>
													</div>
												),
											},
											{
												value: false,
												label: (
													<div
														style={{ display: "flex", alignItems: "center" }}
													>
														<CheckCircle style={{ color: "#387600" }} />
														<Typography
															style={{
																display: "inline-block",
																marginLeft: "25px",
																color: "black",
															}}
														>
															<FormattedMessage id="INACTIVE" />
														</Typography>
													</div>
												),
											},
										]}
										onChange={(option) => {
											setOptions({ ...options, status: option?.value });
										}}
										styles={customStyles(error.fields.status.error)}
									/>
									{error.fields.status.error ? (
										<Typography style={{ fontSize: "12px", color: "#CC1B29" }}>
											{error.fields.status.error_msg}
										</Typography>
									) : null}
								</Grid>
							</Grid>
							<Grid container className={classes.grid_create_container}>
								<Grid
									item
									xs={12}
									sm={4}
									className={classes.grid_create_item_4}
								>
									<Typography>
										<FormattedMessage id="ADD_CREATED" />:
									</Typography>
								</Grid>
								<Grid item xs={12} sm={8}>
									<div
										style={{
											height: "32px",
											width: "calc(100% - 18px)",
											border: "1px solid #cccccc",
											borderRadius: "5px",
											display: "flex",
											alignItems: "center",
											padding: "2px 8px",
										}}
									>
										<Typography style={{ color: "black", margin: "0px 2px" }}>
											<FormattedDate value={Date.now()} />,{" "}
											<FormattedTime value={Date.now()} />
										</Typography>
									</div>
								</Grid>
							</Grid>
							<div
								style={{
									display: "flex",
									justifyContent: "flex-end",
									width: "100%",
									height: "44px",
								}}
							>
								<Button
									variant="contained"
									color="secondary"
									// className={classes.button}
									startIcon={<Add />}
									onClick={addEntry}
									style={{
										borderRadius: "22px",
										height: "44px",
									}}
									disabled={error.error}
								>
									<FormattedMessage id="ADD_SUBMIT" />
								</Button>
							</div>
						</Paper>
					</Grid>
				</Grid>
			</div>
			<Backdrop open={loading} className={classes.backdrop}>
				<CircularProgress />
			</Backdrop>
			{success ? <Redirect to="/" /> : null}
		</>
	);
}

AddEntry.propTypes = {
	setTitle: PropTypes.func.isRequired,
	csrf_token: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
	csrf_token: state.security.csrf_token,
});

export default withWidth()(connect(mapStateToProps, { setTitle })(AddEntry));
