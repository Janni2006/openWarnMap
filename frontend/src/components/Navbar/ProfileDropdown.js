import React, { Component } from "react";
import "rc-dropdown/assets/index.css";
import Dropdown from "rc-dropdown";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import Avatar from "@material-ui/core/Avatar";
import Badge from "@material-ui/core/Badge";
import { withStyles } from "@material-ui/core/styles";
import { FormattedMessage } from "react-intl";

import { List, ListItem, Paper, Divider } from "@material-ui/core";

import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";

const StyledBadge = withStyles((theme) => ({
	badge: {
		right: -10,
		top: 18.5,
		padding: "0",
	},
}))(Badge);

class About extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	overlay = (
		<Paper
			style={{
				padding: "0px 10px",
				marginTop: "15px",
				color: "#cccccc",
				backgroundColor: "#3f3f3f",
			}}
		>
			{this.props.isAuthenticated ? (
				<List>
					<Link
						to={`/user/${this.props.username}`}
						style={{ textDecoration: "none", fontWeight: "bold" }}
					>
						<ListItem
							style={{
								textDecoration: `none`,
								color: `#cccccc`,
								fontSize: "14px",
								fontFamily: "sans-serif",
								justifyContent: "center",
								fontWeight: "normal",
								"&:hover": {
									color: "#cfcfcf",
								},
							}}
						>
							<FormattedMessage id="NAVBAR_SIGNEDIN" />
							<strong style={{ marginLeft: "4px" }}>
								{this.props.username}
							</strong>
						</ListItem>
					</Link>
					<Divider style={{ marginTop: "auto", backgroundColor: "#686868" }} />
					<Link
						to="/profile"
						style={{
							textDecoration: "none",
						}}
					>
						<ListItem
							style={{
								textDecoration: `none`,
								color: `#cccccc`,
								fontSize: "14px",
								fontFamily: "sans-serif",
								justifyContent: "center",
								"&:hover": {
									color: "#cfcfcf",
								},
							}}
						>
							<FormattedMessage id="NAVBAR_PROFILE" />
						</ListItem>
					</Link>
					<Link
						to="/private"
						style={{
							textDecoration: "none",
						}}
					>
						<ListItem
							style={{
								textDecoration: `none`,
								color: `#cccccc`,
								fontSize: "14px",
								fontFamily: "sans-serif",
								justifyContent: "center",
								"&:hover": {
									color: "#cfcfcf",
								},
							}}
						>
							<FormattedMessage id="NAVBAR_PRIVATE_ENTRYS" />
						</ListItem>
					</Link>
					<Divider
						style={{
							marginTop: "auto",
							backgroundColor: "#686868",
						}}
					/>
					<Link
						to="/logout"
						style={{
							textDecoration: "none",
						}}
					>
						<ListItem
							style={{
								textDecoration: `none`,
								color: `#cccccc`,
								fontSize: "14px",
								fontFamily: "sans-serif",
								justifyContent: "center",
								"&:hover": {
									color: "#cfcfcf",
								},
							}}
						>
							<FormattedMessage id="NAVBAR_LOGOUT" />
						</ListItem>
					</Link>
				</List>
			) : (
				<p>Something went wrong at this point</p>
			)}
		</Paper>
	);

	render() {
		return (
			<>
				{this.props.isAuthenticated ? (
					<Dropdown
						trigger={["click"]}
						animation="slide-up"
						overlay={this.overlay}
					>
						<StyledBadge
							badgeContent={<ArrowDropDownIcon />}
							style={{ marginRight: "10px", cursor: "pointer" }}
						>
							<Avatar
								style={{
									width: "27px",
									height: "27px",
									marginTop: "5px",
									backgroundColor: this.props.avatar_color
										? this.props.avatar_color
										: "#bdbdbd",
								}}
							>
								{this.props.username?.charAt(0).toUpperCase()}
							</Avatar>
						</StyledBadge>
					</Dropdown>
				) : null}
			</>
		);
	}
}

About.propTypes = {
	username: PropTypes.string.isRequired,
	isAuthenticated: PropTypes.bool.isRequired,
	avatar_color: PropTypes.string,
};

const mapStateToProps = (state) => ({
	username: state.auth.user.username,
	isAuthenticated: state.auth.isAuthenticated,
	avatar_color: state.auth.user.avatar,
});

export default connect(mapStateToProps)(withRouter(About));
