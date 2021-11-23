import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { setTitle } from "../../actions/generalActions";
import {
	loadPrivateData,
	setPrivateDataFilters,
} from "../../actions/privateActions";

import makeStyles from "@mui/styles/makeStyles";
import withStyles from "@mui/styles/withStyles";

import {
	Paper,
	Grid,
	Checkbox,
	FormGroup,
	FormControlLabel,
	FormControl,
	FormLabel,
	Hidden,
} from "@mui/material";

import { Skeleton } from "@mui/material";

import Select from "react-select";

import { FormattedMessage, useIntl } from "react-intl";

import SubmitButton from "../SubmitButton";

function Filters(props) {
	const [filters, setFilters] = React.useState({
		active: false,
		verified: false,
		height: 0,
		size: 0,
		localization: 0,
		sort: 0,
	});
	const intl = useIntl();

	React.useEffect(() => {
		setFilters(props.filters);
	}, [props.filters]);

	return (
		<Hidden lgDown>
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
							value={[
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
							].find((item) => item.value == filters.size)}
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
							value={[
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
							].find((item) => item.value == filters.height)}
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
							// set value to the value defined in the redux state table
							value={[
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
							].find((item) => item.value == filters.localization)}
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
							value={[
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
							].find((item) => item.value == filters.sort)}
							onChange={(option) => {
								setFilters({ ...filters, sort: option?.value });
							}}
							// styles={customStyles(error.fields.height.error)}
						/>
						<SubmitButton
							title={intl.formatMessage({ id: "FILTER" })}
							onClick={() => {
								props.setPrivateDataFilters(filters);
							}}
						/>
					</Paper>
				) : (
					<Paper style={{ height: "50vh", background: "transparent" }}>
						<Skeleton
							variant="rectangular"
							width="100%"
							height="100%"
							animation="wave"
						/>
					</Paper>
				)}
			</Grid>
		</Hidden>
	);
}

Filters.propTypes = {
	loading: PropTypes.bool.isRequired,
	filters: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
	filters: state.private.filters,
	loading: state.private.loading,
});

export default connect(mapStateToProps, {
	setPrivateDataFilters,
})(Filters);
