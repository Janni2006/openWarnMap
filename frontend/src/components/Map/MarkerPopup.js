import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { motion, AnimateSharedLayout } from "framer-motion";

import { closeMarkerPopup } from "../../actions/mapActions";

import {
	VerifiedUser,
	Warning,
	Close,
	ThumbUp,
	ThumbDown,
	ThumbUpOutlined,
	ThumbDownOutlined,
} from "@material-ui/icons";

import { ConvertMillisecondsToString } from "../../helpers/ConvertMillisecondsToString";

import {
	Typography,
	IconButton,
	Button,
	makeStyles,
	withWidth,
	isWidthDown,
} from "@material-ui/core";

import { FormattedMessage } from "react-intl";

function MarkerPopup(props) {
	const [zIndex, setZIndex] = React.useState("auto");
	const [confirmButton, setConfirmButton] = React.useState({
		hover: false,
		selected: false,
	});
	const [changeButton, setChangeButton] = React.useState({
		hover: false,
		selected: false,
	});

	const useStyles = makeStyles((theme) => ({}));

	const classes = useStyles();

	React.useEffect(() => {
		if (props.map && props.content.gps_lat && props.content.gps_long) {
			props.map?.flyTo([props.content.gps_lat, props.content.gps_long]);
		}
		setChangeButton({
			hover: false,
			selected: false,
		});
		setConfirmButton({
			hover: false,
			selected: false,
		});
	}, [props.content.gps_lat, props.content.gps_long]);

	const spring = {
		type: "spring",
		stiffness: 500,
		damping: 60,
	};

	React.useEffect(() => {
		if (props.open == true) {
			setZIndex("auto");
		} else {
			setTimeout(() => {
				setZIndex("-10");
			}, 250);
		}
	}, [props.open]);

	return (
		<>
			<AnimateSharedLayout>
				<div
					style={{
						height: "50vh",
						width: "25%",
						maxWidth: "355px",
						position: "fixed",
						right: "15px",
						top: "79px",
						zIndex: zIndex,
					}}
				>
					{props.open ? (
						<motion.div
							initial={false}
							animate={{ visibility: "visible" }}
							transition={spring}
							layoutId="popup"
							style={{
								height: "calc(100% - 44px)",
								width: "calc(100% - 44px)",
								position: "relative",
								zIndex: 9,
								backgroundColor: "white",
								borderRadius: "5px",
								padding: "22px",
							}}
						>
							<IconButton
								style={{
									position: "absolute",
									right: "0px",
									marginTop: "-22px",
								}}
								onClick={props.closeMarkerPopup}
							>
								<Close />
							</IconButton>
							<h2 style={{ margin: "0px" }}>{props.content.code}</h2>
							<Typography
								style={{
									color: "#D5D5D5",
									marginTop: "0px",
									textAlign: "right",
								}}
							>
								{ConvertMillisecondsToString(
									Date.now() - Date.parse(props.content.created)
								)}
							</Typography>
							{props.content.active ? (
								<div style={{ display: "flex", alignItems: "center" }}>
									<Warning style={{ color: "#CC1B29" }} />
									<Typography
										style={{
											color: "#CC1B29",
											display: "inline-block",
											marginLeft: "5px",
											fontWeight: "bolder",
										}}
									>
										<FormattedMessage id="ACTIVE" />
									</Typography>
									<br />
								</div>
							) : null}
							{props.content.verified ? (
								<div style={{ display: "flex", alignItems: "center" }}>
									<VerifiedUser style={{ color: "#387600" }} />
									<Typography
										style={{
											color: "#387600",
											display: "inline-block",
											marginLeft: "5px",
											fontWeight: "bolder",
										}}
									>
										<FormattedMessage id="VERIFIED" />
									</Typography>
								</div>
							) : null}
							<div>
								<Button
									startIcon={
										confirmButton.hover ? <ThumbUp /> : <ThumbUpOutlined />
									}
									style={{
										border: "2.5px solid green",
										color: confirmButton.hover ? "white" : "green",
										backgroundColor: confirmButton.hover ? "green" : "white",
										height: "41px",
									}}
									disabled={
										changeButton.loading ||
										confirmButton.loading ||
										confirmButton.selected
									}
									onMouseEnter={() => {
										setConfirmButton({ ...confirmButton, hover: true });
									}}
									onMouseLeave={() => {
										setConfirmButton({ ...confirmButton, hover: false });
									}}
									onClick={() => {
										setConfirmButton({ ...confirmButton, selected: true });
									}}
								>
									{isWidthDown("md", props.width)
										? null
										: confirmButton.hover
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
							</div>
						</motion.div>
					) : (
						<motion.div
							animate={false}
							transition={spring}
							layoutId="popup"
							style={{
								height: "calc(100% - 44px)",
								width: "calc(100% - 44px)",
								position: "relative",
								zIndex: 9,
								backgroundColor: "white",
								borderRadius: "5px",
								padding: "22px",
								marginLeft: "150%",
							}}
						>
							<IconButton
								style={{
									position: "absolute",
									right: "0px",
									marginTop: "-22px",
								}}
								onClick={props.closeMarkerPopup}
							>
								<Close />
							</IconButton>
						</motion.div>
					)}
				</div>
			</AnimateSharedLayout>
		</>
	);
}

MarkerPopup.propTypes = {
	closeMarkerPopup: PropTypes.func.isRequired,
	open: PropTypes.bool.isRequired,
	content: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
	open: state.map.markerPopup.open,
	content: state.map.markerPopup.content,
});

export default connect(mapStateToProps, { closeMarkerPopup })(
	withWidth()(MarkerPopup)
);
