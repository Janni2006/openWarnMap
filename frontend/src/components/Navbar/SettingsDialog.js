import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import {
	Typography,
	Dialog,
	DialogTitle,
	DialogActions,
	Grid,
	Switch,
	Tooltip,
} from "@material-ui/core";

import { Language, MapOutlined, InfoOutlined } from "@material-ui/icons";

import { useIntl, FormattedMessage } from "react-intl";

import { setLanguage, toggleClickToAdd } from "../../actions/generalActions";

import SubmitButton from "../SubmitButton";

import Select from "react-select";
import { LOCALES } from "../../i18n/languages";

function SettingsDialog(props) {
	const { onClose, open } = props;

	const intl = useIntl();

	const handleClose = () => {
		onClose();
	};

	return (
		<Dialog open={open} onClose={handleClose} fullWidth={true} maxWidth={"sm"}>
			<DialogTitle>
				<FormattedMessage id="SETTINGS_TITLE" />
			</DialogTitle>
			<div style={{ padding: "0px 24px", overflowX: "visible" }}>
				<Grid container spacing={1}>
					<Grid
						item
						xs={12}
						sm={6}
						style={{
							display: "flex",
							justifyContent: "flex-start",
							flexWrap: "nowrap",
							alignItems: "center",
						}}
					>
						<Language />
						<Typography
							style={{ fontSize: "16px", color: "#3f3f3f", marginLeft: "5px" }}
						>
							<FormattedMessage id="SETTINGS_LANGUAGE" />:
						</Typography>
					</Grid>
					<Grid item xs={12} sm={6}>
						<Select
							options={[
								{ value: LOCALES.ENGLISH, label: "English" },
								{ value: LOCALES.GERMAN, label: "Deutsch" },
							]}
							defaultValue={{
								value: props.language,
								label:
									props.language == LOCALES.ENGLISH ? "English" : "Deutsch",
							}}
							onChange={(value) => {
								props.setLanguage(value.value);
							}}
						/>
					</Grid>
					{props.isAuthenticated ? (
						<>
							<Grid
								item
								xs={12}
								sm={6}
								style={{
									display: "flex",
									justifyContent: "flex-start",
									flexWrap: "nowrap",
									alignItems: "center",
								}}
							>
								<MapOutlined />
								<Typography
									style={{
										fontSize: "16px",
										color: "#3f3f3f",
										marginLeft: "5px",
									}}
								>
									<FormattedMessage id="SETTINGS_CLICK_TO_ADD" />:
								</Typography>
								<Tooltip
									title={intl.formatMessage({
										id: "SETTINGS_CLICK_TO_ADD_DESCRIPTION",
									})}
									placement="right"
									arrow
								>
									<InfoOutlined
										style={{ color: "#2d79df", marginLeft: "5px" }}
									/>
								</Tooltip>
							</Grid>
							<Grid item xs={12} sm={6}>
								<Switch
									onChange={props.toggleClickToAdd}
									checked={props.clickToAdd}
								/>
							</Grid>
						</>
					) : null}
				</Grid>
			</div>

			<DialogActions style={{ padding: "16px 24px" }}>
				<SubmitButton
					title={intl.formatMessage({ id: "SAVE" })}
					onClick={handleClose}
				/>
			</DialogActions>
		</Dialog>
	);
}

SettingsDialog.propTypes = {
	language: PropTypes.string.isRequired,
	setLanguage: PropTypes.func.isRequired,
	clickToAdd: PropTypes.bool.isRequired,
	toggleClickToAdd: PropTypes.func.isRequired,
	isAuthenticated: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
	language: state.general.language,
	clickToAdd: state.general.settings.map.clickToAdd,
	isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { setLanguage, toggleClickToAdd })(
	SettingsDialog
);
