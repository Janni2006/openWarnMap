import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { setTitle } from "../../actions/generalActions";
import { loadPrivateData } from "../../actions/privateActions";
import { Link, withRouter, useLocation, useHistory } from "react-router-dom";

import { makeStyles, withStyles } from "@material-ui/core/styles";

import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";

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
	Divider,
	Hidden,
	Typography,
} from "@material-ui/core";

import { Skeleton } from "@material-ui/lab";

import "leaflet/dist/leaflet.css";
import ListIcon from "@material-ui/icons/List";
import ViewComfyIcon from "@material-ui/icons/ViewComfy";
import ArrowDropDown from "@material-ui/icons/ArrowDropDown";

import Badge from "@material-ui/core/Badge";
import Select from "react-select";

import { FormattedMessage, useIntl } from "react-intl";

import List from "./List";
import Item from "./Item";
import Dropdown from "rc-dropdown";

const useStyles = makeStyles((theme) => ({
	cardList: {
		display: "flex",
		flexWrap: "wrap",
		alignContent: "flex-start",
		maxHeight: "calc(100vh - 154px)",
		overflow: "hidden",
		overflowY: "auto",
		padding: "0px",
		margin: "0px",
		listStyle: "none",
		width: "calc(100% + 25px)",
	},
	card: ({ listType }) => ({
		position: "relative",
		marginRight: listType == "box" ? "25px" : "0px",
		marginBottom: "25px",
		height: "160px",
		flex: listType == "box" ? "0 0 40%" : "0 0 100%",
		maxWidth: listType == "box" ? "calc(100% / 3 - 25px)" : "calc(100% - 25px)",
		[theme.breakpoints.only("sm")]: {
			flex: "1 0 100%",
			maxWidth: "calc(50% - 30px)",
			padding: "10px 0px",
			marginBottom: "2.55px",
		},
		[theme.breakpoints.down("xs")]: {
			flex: "1 0 100%",
			maxWidth: "calc(100% - 30px)",
			padding: "10px 0px",
			marginBottom: "2.55px",
		},
	}),
	contentContainer: {
		width: "100%",
		height: "100%",
		position: "relative",
		display: "block",
		pointerEvents: "none",
	},
	content: ({ listType }) => ({
		pointerEvents: "auto",
		position: "relative",
		borderRadius: "15px",
		background: "#f3efe9",
		overflow: "hidden",
		height: "100%",
		height: "100%",
		margin: "0 auto",
		background: listType == "box" ? "auto" : "white",
	}),
	contentMap: ({ listType }) => ({ width: listType == "box" ? "100%" : "40%" }),
	contentMapMain: { height: 160, zIndex: 0, width: "100%" },
	titleContainer: ({ listType }) => ({
		position: "absolute",
		top: "15px",
		left: listType == "box" ? "15px" : "calc(40% + 15px)",
		maxWidth: "300px",
		"& h2": {
			margin: "0px",
			marginBottom: "2.5px",
			color: "#3f3f3f",
		},
	}),
	cardOpenLink: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0 },
}));

const StyledBadge = withStyles((theme) => ({
	badge: {
		right: -10,
		top: 11,
		padding: "0",
	},
}))(Badge);

function PrivateEntrys(props) {
	const [listType, setListType] = React.useState("box");
	const [selectedId, setSelectedId] = React.useState(null);
	const [index, setIndex] = React.useState(0);
	const [loading, setLoading] = React.useState(props.loading);
	const [filters, setFilters] = React.useState({
		active: false,
		verified: false,
		height: 0,
		size: 0,
		localization: 0,
		sort: 0,
	});

	const [data, setData] = React.useState([]);

	const classes = useStyles({ listType });
	const history = useHistory();
	const intl = useIntl();
	const search = useLocation().search;

	const urlListType = new URLSearchParams(search).get("listType");

	React.useEffect(() => {
		if (urlListType) {
			var req_listType = ["box", "list"].find((item) => item == urlListType);

			setListType(req_listType);
		}
	}, [urlListType]);

	React.useEffect(() => {
		props.setTitle("Profile Entrys");

		props.loadPrivateData();

		return () => {
			props.setTitle();
		};
	}, []);

	React.useEffect(() => {
		setLoading(true);
		var current_data = props.data;
		var cache_data = [];
		if (filters.active == true) {
			current_data.map((item) => {
				if (item.active == true) {
					cache_data.push(item);
				}
			});
		} else {
			cache_data = current_data;
		}
		current_data = cache_data;
		cache_data = [];

		if (filters.verified == true) {
			current_data.map((item) => {
				if (item.verified == true) {
					cache_data.push(item);
				}
			});
		} else {
			cache_data = current_data;
		}

		current_data = cache_data;
		cache_data = [];

		if (filters.size == 0) {
			cache_data = current_data;
		} else {
			current_data.map((item) => {
				if (item.size == filters.size - 1) {
					cache_data.push(item);
				}
			});
		}

		current_data = cache_data;
		cache_data = [];

		if (filters.height == 0) {
			cache_data = current_data;
		} else {
			current_data.map((item) => {
				if (item.height == filters.height - 1) {
					cache_data.push(item);
				}
			});
		}

		current_data = cache_data;
		cache_data = [];

		if (filters.localization == 0) {
			cache_data = current_data;
		} else {
			current_data.map((item) => {
				if (item.localization == filters.localization - 1) {
					cache_data.push(item);
				}
			});
		}

		current_data = cache_data;
		cache_data = [];

		if (filters.sort == 0) {
			cache_data = current_data;
			setData([]);
			cache_data.sort(function (a, b) {
				return Date.parse(b.created) - Date.parse(a.created);
			});
		} else if (filters.sort == 1) {
			cache_data = current_data;
			setData([]);
			cache_data.sort(function (a, b) {
				return Date.parse(a.created) - Date.parse(b.created);
			});
		}

		current_data = cache_data;
		cache_data = [];

		setData(current_data);
		setTimeout(() => setLoading(false), 1);
	}, [props.data, filters]);

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
			history.push(`/private?listType=${newListType}`);
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
					{!props.loading ? (
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
											<FormLabel component="legend">Apply Filters</FormLabel>
											<FormGroup aria-label="position">
												<FormControlLabel
													value="active"
													control={<Checkbox color="primary" />}
													label="Active"
													labelPlacement="end"
													onChange={(event) => {
														console.log(event);
													}}
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
					) : null}
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
					<div
						style={{
							width: "100%",
							display: "flex",
							justifyContent: "flex-end",
						}}
					>
						<ToggleButtonGroup
							value={listType}
							exclusive
							onChange={handleListType}
						>
							{/* <Link to="/private?listType=box"> */}
							<ToggleButton value="box" style={{ padding: "0 2.5px" }}>
								<ViewComfyIcon />
							</ToggleButton>
							{/* </Link> */}
							{/* <Link to="/private?listType=list"> */}
							<ToggleButton value="list" style={{ padding: "0 2.5px" }}>
								<ListIcon />
							</ToggleButton>
							{/* </Link> */}
						</ToggleButtonGroup>
					</div>
				</Grid>
			</Grid>

			<Divider style={{ margin: "5px 0px 20px 0px" }} />
			<Grid container spacing={2}>
				<Hidden smDown>
					<Grid item md={2}>
						{!props.loading ? (
							<Paper style={{ height: "calc(50vh - 40px)", padding: "20px" }}>
								<FormControl component="fieldset">
									<FormLabel component="legend">
										<FormattedMessage id="ENTRYS_FILTER" />
									</FormLabel>
									<FormGroup aria-label="position">
										<FormControlLabel
											value="active"
											control={<Checkbox color="primary" />}
											label={intl.formatMessage({
												id: "ENTRYS_FILTERS_ONLY_ACTIVE",
											})}
											labelPlacement="end"
											checked={filters.active}
											onChange={(event) => {
												setFilters({
													...filters,
													active: event.target.checked,
												});
											}}
										/>
										<FormControlLabel
											value="verified"
											control={<Checkbox color="primary" />}
											label={intl.formatMessage({
												id: "ENTRYS_FILTERS_ONLY_VERIFIED",
											})}
											labelPlacement="end"
											checked={filters.verified}
											onChange={(event) => {
												setFilters({
													...filters,
													verified: event.target.checked,
												});
											}}
										/>
									</FormGroup>
								</FormControl>
								<Select
									placeholder={intl.formatMessage({ id: "ADD_SELECT" })}
									options={[
										{
											value: 0,
											label: intl.formatMessage({
												id: "ENTRYS_FILTERS_SIZE_ALL",
											}),
										},
										{
											value: 1,
											label: intl.formatMessage({
												id: "ENTRYS_FILTERS_SIZE_OPTION_1",
											}),
										},
										{
											value: 2,
											label: intl.formatMessage({
												id: "ENTRYS_FILTERS_SIZE_OPTION_2",
											}),
										},
										{
											value: 3,
											label: intl.formatMessage({
												id: "ENTRYS_FILTERS_SIZE_OPTION_3",
											}),
										},
									]}
									defaultValue={{
										value: 0,
										label: intl.formatMessage({
											id: "ENTRYS_FILTERS_SIZE_ALL",
										}),
									}}
									onChange={(option) => {
										setFilters({ ...filters, size: option?.value });
									}}
									// styles={customStyles(error.fields.height.error)}
								/>
								<Select
									placeholder={intl.formatMessage({ id: "ADD_SELECT" })}
									options={[
										{
											value: 0,
											label: intl.formatMessage({
												id: "ENTRYS_FILTERS_HEIGHT_ALL",
											}),
										},
										{
											value: 1,
											label: intl.formatMessage({
												id: "ENTRYS_FILTERS_HEIGHT_OPTION_1",
											}),
										},
										{
											value: 2,
											label: intl.formatMessage({
												id: "ENTRYS_FILTERS_HEIGHT_OPTION_2",
											}),
										},
										{
											value: 3,
											label: intl.formatMessage({
												id: "ENTRYS_FILTERS_HEIGHT_OPTION_3",
											}),
										},
									]}
									defaultValue={{
										value: 0,
										label: intl.formatMessage({
											id: "ENTRYS_FILTERS_HEIGHT_ALL",
										}),
									}}
									onChange={(option) => {
										setFilters({ ...filters, height: option?.value });
									}}
									// styles={customStyles(error.fields.height.error)}
								/>
								<Select
									placeholder={intl.formatMessage({ id: "ADD_SELECT" })}
									options={[
										{
											value: 0,
											label: intl.formatMessage({
												id: "ENTRYS_FILTERS_LOCALIZATION_ALL",
											}),
										},
										{
											value: 1,
											label: intl.formatMessage({
												id: "ENTRYS_FILTERS_LOCALIZATION_OPTION_1",
											}),
										},
										{
											value: 2,
											label: intl.formatMessage({
												id: "ENTRYS_FILTERS_LOCALIZATION_OPTION_2",
											}),
										},
										{
											value: 3,
											label: intl.formatMessage({
												id: "ENTRYS_FILTERS_LOCALIZATION_OPTION_3",
											}),
										},
									]}
									defaultValue={{
										value: 0,
										label: intl.formatMessage({
											id: "ENTRYS_FILTERS_LOCALIZATION_ALL",
										}),
									}}
									onChange={(option) => {
										setFilters({ ...filters, localization: option?.value });
									}}
									// styles={customStyles(error.fields.height.error)}
								/>
								<Select
									placeholder={intl.formatMessage({ id: "ADD_SELECT" })}
									options={[
										{
											value: 0,
											label: intl.formatMessage({
												id: "ENTRYS_FILTERS_SORT_NEWEST",
											}),
										},
										{
											value: 1,
											label: intl.formatMessage({
												id: "ENTRYS_FILTERS_SORT_OLDEST",
											}),
										},
									]}
									defaultValue={{
										value: 0,
										label: intl.formatMessage({
											id: "ENTRYS_FILTERS_SORT_NEWEST",
										}),
									}}
									onChange={(option) => {
										setFilters({ ...filters, sort: option?.value });
									}}
									// styles={customStyles(error.fields.height.error)}
								/>
							</Paper>
						) : (
							<Paper style={{ height: "50vh", background: "transparent" }}>
								<Skeleton
									variant="rect"
									width="100%"
									height="100%"
									animation="wave"
								/>
							</Paper>
						)}
					</Grid>
				</Hidden>
				<Grid item xs={12} md={10} style={{ overflowX: "hidden" }}>
					<AnimateSharedLayout type="crossfade">
						{!loading && data ? (
							<>
								<List
									selectedId={selectedId}
									setID={setID}
									data={data}
									listType={listType}
								/>
								<AnimatePresence>
									{selectedId && (
										<Item
											id={selectedId}
											key="item"
											setID={setID}
											layout={listType}
										/>
									)}
								</AnimatePresence>
							</>
						) : (
							<ul
								className={classes.cardList}
								style={{ width: "calc(100% + 25px)" }}
							>
								{Array.from(new Array(5)).map((item, index) => (
									<li className={classes.card} key={index}>
										<div
											className={(classes.contentContainer, classes.content)}
											style={{ background: "transparent" }}
										>
											<Skeleton
												variant="rect"
												animation="wave"
												height="100%"
												width="100%"
											></Skeleton>
										</div>
									</li>
								))}
							</ul>
						)}
					</AnimateSharedLayout>
				</Grid>
			</Grid>
		</div>
	);
}

PrivateEntrys.propTypes = {
	setTitle: PropTypes.func.isRequired,
	loadPrivateData: PropTypes.func.isRequired,
	loading: PropTypes.bool.isRequired,
	data: PropTypes.array,
};

const mapStateToProps = (state) => ({
	loading: state.private.loading,
	data: state.private.data,
});

export default connect(mapStateToProps, { setTitle, loadPrivateData })(
	withRouter(PrivateEntrys)
);
