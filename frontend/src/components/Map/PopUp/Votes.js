import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { closeMarkerPopup } from "../../../actions/mapActions";

import { AnimatePresence, motion, AnimateSharedLayout } from "framer-motion";

import {
	ThumbUp,
	ThumbDown,
	ThumbUpOutlined,
	ThumbDownOutlined,
	Send,
} from "@material-ui/icons";

import {
	Button,
	makeStyles,
	withWidth,
	isWidthDown,
	Typography,
} from "@material-ui/core";

import Select from "react-select";

import { toast } from "react-toastify";

import axios from "axios";

import { FormattedMessage, useIntl } from "react-intl";

function Votes(props) {
	const [confirmButton, setConfirmButton] = React.useState({
		hover: false,
		selected: false,
	});
	const [changeButton, setChangeButton] = React.useState({
		hover: false,
		selected: false,
		appliedChange: null,
	});

	const intl = useIntl();

	React.useEffect(() => {
		if (confirmButton.selected) {
			sendVoting();
		}
	}, [confirmButton.selected]);

	React.useEffect(() => {
		setChangeButton({
			hover: false,
			selected: false,
			appliedChange: null,
		});
		setConfirmButton({
			hover: false,
			selected: false,
		});
	}, [props.content.code]);

	function checkForErrors() {
		var error = false;

		if (changeButton.selected) {
			error = changeButton.appliedChange == null;
		}

		return error;
	}

	function sendVoting() {
		const config = {
			headers: {
				"Content-Type": "application/json",
				"X-CSRFToken": props.csrf_token,
			},
		};
		const body = JSON.stringify({
			entry_id: String(props.content.code),
			confirm: Boolean(confirmButton.selected),
			change: Boolean(changeButton.selected),
			applied_change: Number(changeButton.appliedChange),
		});
		if (!checkForErrors()) {
			axios
				.post("/react/vote/create/", body, config)
				.then((res) => {
					toast.success(
						"Wir danken Ihnen für die Rückmeldung zu diesem Eintrag"
					);
				})
				.catch((err) => {
					if (err.response.status == 409) {
						toast.warn(
							"Sie haben uns zu diesem Eintrag bereits eine Rückmeldung erstattet."
						);
					} else {
						toast.error(
							"Es ist etwas schief gelaufen! Bitte versuchen Sie es später erneut oder wenden sich an unseren Support."
						);
					}
				});
		}
	}

	return (
		<>
			{props.isAuthenticated ? (
				<>
					<AnimateSharedLayout>
						{confirmButton.hover && !changeButton.selected ? (
							<motion.button
								layoutId="confirmButton"
								initial={{ backgroundColor: "white", color: "green" }}
								animate={{ backgroundColor: "green", color: "white" }}
								exit={{ backgroundColor: "white", color: "green" }}
								style={{
									border: "2.5px solid green",
									borderRadius: "5px",
									height: "41px",
								}}
								disabled={changeButton.selected || confirmButton.selected}
								onMouseEnter={() => {
									setConfirmButton({ ...confirmButton, hover: true });
								}}
								onMouseLeave={() => {
									setConfirmButton({ ...confirmButton, hover: false });
								}}
								onClick={() => {
									if (!changeButton.selected) {
										setConfirmButton({ ...confirmButton, selected: true });
									}
								}}
							>
								{isWidthDown("md", props.width) ? null : confirmButton.hover &&
								  !changeButton.selected ? (
									<div style={{ display: "flex", justifyContent: "center" }}>
										<ThumbUp />
										<Typography style={{ marginLeft: "2.5px" }}>
											Bestätigen
										</Typography>
									</div>
								) : null}
							</motion.button>
						) : (
							<motion.button
								layoutId="confirmButton"
								initial={{ backgroundColor: "green", color: "white" }}
								animate={{ backgroundColor: "white", color: "green" }}
								exit={{ backgroundColor: "green", color: "white" }}
								style={{
									border: "2.5px solid green",
									height: "41px",
									borderRadius: "5px",
								}}
								disabled={changeButton.selected || confirmButton.selected}
								onMouseEnter={() => {
									setConfirmButton({ ...confirmButton, hover: true });
								}}
								onMouseLeave={() => {
									setConfirmButton({ ...confirmButton, hover: false });
								}}
								onClick={() => {
									if (!changeButton.selected) {
										setConfirmButton({ ...confirmButton, selected: true });
									}
								}}
							>
								<ThumbUpOutlined />
							</motion.button>
						)}
						{changeButton.hover && !confirmButton.selected ? (
							<motion.button
								layoutId="changeButton"
								initial={{ backgroundColor: "white", color: "red" }}
								animate={{ backgroundColor: "red", color: "white" }}
								exit={{ backgroundColor: "white", color: "red" }}
								style={{
									border: "2.5px solid red",
									borderRadius: "5px",
									height: "41px",
									marginLeft: "5px",
								}}
								disabled={changeButton.selected || confirmButton.selected}
								onMouseEnter={() => {
									setChangeButton({ ...changeButton, hover: true });
								}}
								onMouseLeave={() => {
									setChangeButton({ ...changeButton, hover: false });
								}}
								onClick={() => {
									if (!confirmButton.selected) {
										setChangeButton({ ...changeButton, selected: true });
									}
								}}
							>
								{isWidthDown("md", props.width) ? null : changeButton.hover &&
								  !confirmButton.selected ? (
									<div
										style={{
											display: "flex",
											justifyContent: "center",
										}}
									>
										<ThumbDown />
										<Typography style={{ marginLeft: "2.5px" }}>
											Status ändern
										</Typography>
									</div>
								) : null}
							</motion.button>
						) : (
							<motion.button
								layoutId="changeButton"
								initial={{ backgroundColor: "red", color: "white" }}
								animate={{ backgroundColor: "white", color: "red" }}
								exit={{ backgroundColor: "red", color: "white" }}
								style={{
									border: "2.5px solid red",
									height: "41px",
									borderRadius: "5px",
									marginLeft: "5px",
								}}
								disabled={changeButton.selected || confirmButton.selected}
								onMouseEnter={() => {
									setChangeButton({ ...changeButton, hover: true });
								}}
								onMouseLeave={() => {
									setChangeButton({ ...changeButton, hover: false });
								}}
								onClick={() => {
									if (!confirmButton.selected) {
										setChangeButton({ ...changeButton, selected: true });
									}
								}}
							>
								<ThumbDownOutlined />
							</motion.button>
						)}
					</AnimateSharedLayout>
					<AnimateSharedLayout>
						{changeButton.selected ? (
							<motion.div
								layoutId="changeStatusOptions"
								style={{ width: "100%", marginTop: "15px" }}
							>
								<Select
									placeholder={intl.formatMessage({ id: "ADD_SELECT" })}
									options={[
										{
											value: 0,
											label: intl.formatMessage({
												id: "POPUP_REQUEST_CHANGE_OPTION_IP",
											}),
										},
										{
											value: 1,
											label: intl.formatMessage({
												id: "POPUP_REQUEST_CHANGE_OPTION_NT",
											}),
										},
									]}
									onChange={(option) => {
										setChangeButton({
											...changeButton,
											appliedChange: option?.value,
										});
									}}
								/>
								<div
									style={{
										display: "flex",
										justifyContent: "flex-end",
										width: "100%",
										height: "44px",
										marginTop: "5px",
									}}
								>
									<Button
										variant="contained"
										color="secondary"
										// className={classes.button}
										startIcon={<Send />}
										onClick={sendVoting}
										style={{
											borderRadius: "5px",
											height: "44px",
										}}
									>
										<FormattedMessage id="ADD_SUBMIT" />
									</Button>
								</div>
							</motion.div>
						) : (
							<motion.div
								layoutId="changeStatusOptions"
								style={{ width: "100%", marginTop: "15px" }}
							/>
						)}
					</AnimateSharedLayout>
				</>
			) : null}
		</>
	);
}

Votes.propTypes = {
	closeMarkerPopup: PropTypes.func.isRequired,
	open: PropTypes.bool.isRequired,
	content: PropTypes.object.isRequired,
	isAuthenticated: PropTypes.bool.isRequired,
	csrf_token: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
	open: state.map.markerPopup.open,
	content: state.map.markerPopup.content,
	isAuthenticated: state.auth.isAuthenticated,
	csrf_token: state.security.csrf_token,
});

export default connect(mapStateToProps, { closeMarkerPopup })(
	withWidth()(Votes)
);
