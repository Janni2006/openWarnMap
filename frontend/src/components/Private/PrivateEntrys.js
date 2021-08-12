import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { setTitle } from "../../actions/generalActions";
import { loadPrivateData } from "../../actions/privateActions";
import { withRouter } from "react-router-dom";

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
							<ToggleButton value="box" style={{ padding: "0 2.5px" }}>
								<ViewComfyIcon />
							</ToggleButton>
							<ToggleButton value="list" style={{ padding: "0 2.5px" }}>
								<ListIcon />
							</ToggleButton>
						</ToggleButtonGroup>
					</div>
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
						) : (
							<div style={{ height: "50vh" }}>
								<Skeleton width="100%" height="100%" />
							</div>
						)}
					</Grid>
				</Hidden>
				<Grid item xs={12} md={10} style={{ overflowX: "hidden" }}>
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
						) : (
							<ul className="card-list" style={{ width: "calc(100% + 25px)" }}>
								{Array.from(new Array(5)).map((item, index) => (
									<li className={`card`}>
										<div className="card-content-container"></div>
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
};

const mapStateToProps = (state) => ({
	loading: state.private.loading,
	data: state.private.data,
});

export default connect(mapStateToProps, { setTitle, loadPrivateData })(
	withRouter(PrivateEntrys)
);
