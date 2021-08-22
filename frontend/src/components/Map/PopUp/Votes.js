import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { closeMarkerPopup } from "../../../actions/mapActions";

import {
	ThumbUp,
	ThumbDown,
	ThumbUpOutlined,
	ThumbDownOutlined,
	Send,
} from "@material-ui/icons";

import { Button, makeStyles, withWidth, isWidthDown } from "@material-ui/core";

import Select from "react-select";

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
				.then((res) => console.log(res))
				.catch((err) => console.log(err));
		}
	}

	return (
		<>
			{props.isAuthenticated ? (
				<>
					<Button
						startIcon={
							confirmButton.hover && !changeButton.selected ? (
								<ThumbUp />
							) : (
								<ThumbUpOutlined />
							)
						}
						style={{
							border: "2.5px solid green",
							color: confirmButton.selected
								? "white"
								: confirmButton.hover && !changeButton.selected
								? "white"
								: "green",
							backgroundColor: confirmButton.selected
								? "green"
								: confirmButton.hover && !changeButton.selected
								? "green"
								: "white",
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
						{isWidthDown("md", props.width)
							? null
							: confirmButton.hover && !changeButton.selected
							? "Bestätigen"
							: null}
					</Button>
					<Button
						startIcon={
							changeButton.selected ? (
								<ThumbDown />
							) : changeButton.hover && !confirmButton.selected ? (
								<ThumbDown />
							) : (
								<ThumbDownOutlined />
							)
						}
						style={{
							border: "2.5px solid red",
							color: changeButton.selected
								? "white"
								: changeButton.hover && !confirmButton.selected
								? "white"
								: "red",
							backgroundColor: changeButton.selected
								? "red"
								: changeButton.hover && !confirmButton.selected
								? "red"
								: "white",
							marginLeft: "5px",
							height: "41px",
						}}
						disabled={confirmButton.selected || changeButton.selected}
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
						{isWidthDown("md", props.width)
							? null
							: changeButton.hover && !confirmButton.selected
							? "Status ändern"
							: null}
					</Button>
					{changeButton.selected ?? (
						<div>
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
								}}
							>
								<Button
									variant="contained"
									color="secondary"
									// className={classes.button}
									startIcon={<Send />}
									onClick={sendVoting}
									style={{
										borderRadius: "22px",
										height: "44px",
									}}
								>
									<FormattedMessage id="ADD_SUBMIT" />
								</Button>
							</div>
						</div>
					)}
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
