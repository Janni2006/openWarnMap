import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { withRouter, useLocation, Link } from "react-router-dom";

import { setTitle } from "../actions/generalActions";

import {
	List,
	Grid,
	ListItem,
	Avatar,
	Typography,
	Hidden,
} from "@mui/material";

import { useIntl } from "react-intl";

import { motion, AnimateSharedLayout } from "framer-motion";

function SiteItem({ isSelected, icon, title, label, username }) {
	return (
		<Link
			to={`/user/${username}?page=${label}`}
			style={{ width: "100%", padding: "0px", textDecoration: "none" }}
		>
			<ListItem
				style={{
					position: "relative",
					padding: "10px",
					height: "44px",
					borderTop: "1px solid #f0f0f0",
				}}
			>
				<Grid
					container
					style={{
						zIndex: 1,
						height: "24px",
					}}
					spacing={1}
				>
					<Hidden lgDown>
						<Grid item xs={3} style={{ color: "#3f3f3f" }}>
							{icon}
						</Grid>
					</Hidden>

					<Hidden smUp>
						<Grid item xs={3} style={{ color: "#3f3f3f" }}>
							{icon}
						</Grid>
					</Hidden>

					<Grid item xs={9}>
						<Typography style={{ color: "#3f3f3f" }}>{title}</Typography>
					</Grid>
				</Grid>
				{isSelected ? (
					<motion.div
						layoutId="selector"
						style={{
							position: "absolute",
							top: "0px",
							left: "0px",
							height: "44px",
							backgroundColor: "#f0f0f0",
							borderRight: "2px solid #3f3f3f",
							width: "calc(100% - 2px)",
							zIndex: 0,
						}}
					/>
				) : null}
			</ListItem>
		</Link>
	);
}

function PublicProfile(props) {
	const [username, setUsername] = React.useState("");
	const [openedSite, setOpenedSite] = React.useState(0);
	const intl = useIntl();

	React.useEffect(() => {
		props.setTitle(`Profile ${username}`);
		return () => {
			props.setTitle();
		};
	}, [username]);

	React.useEffect(() => {
		setUsername(props.match.params.user);
	}, [props.match.params]);

	const pages = [
		{
			label: "account",
			index: 0,
			icon: (
				<>
					<div>Test</div>
				</>
			),
			title: intl.formatMessage({ id: "PROFILE_PAGE_TITLE_ACCOUNT" }),
			content: () => <></>,
		},
		{
			label: "password",
			index: 1,
			icon: (
				<>
					<div>Test</div>
				</>
			),
			title: intl.formatMessage({ id: "PROFILE_PAGE_TITLE_PASSWORD" }),
			content: () => <></>,
		},
		// {
		// 	label: "security",
		// 	index: 2,
		// 	icon: <SecurityRounded />,
		// 	title: intl.formatMessage({ id: "PROFILE_PAGE_TITLE_SECURITY" }),
		// 	content: () => <Security />,
		// },
		{
			label: "notifications",
			index: 2,
			icon: (
				<>
					<div>Test</div>
				</>
			),
			title: intl.formatMessage({ id: "PROFILE_PAGE_TITLE_NOTIFICATIONS" }),
			content: () => <></>,
		},
	];

	const search = useLocation().search;
	const page = new URLSearchParams(search).get("page");

	React.useEffect(() => {
		if (page) {
			var req_page = pages.find((item) => item.label == page);

			setOpenedSite(req_page.index);
		}
	}, [page]);

	return (
		<div
			style={{
				padding: "22px",
				maxWidth: "1200px",
				margin: "auto",
			}}
		>
			<Grid container spacing={4}>
				<Grid item xs={12} sm={4} md={3}>
					<motion.div
						layout
						style={{
							margin: "auto",
							padding: "15px 0px 2px 0px",
							overflow: "hidden",
							minWidth: "80px",
							borderRadius: "5px",
							backgroundColor: "white",
							boxShadow: "5px 5px 30px -20px #3f3f3f",
						}}
					>
						<List style={{ padding: "0px" }}>
							<ListItem>
								<Avatar
									style={{
										border: "solid 2.5px white",
										boxShadow: `0px 0px 16px -10px ${
											props.avatar_color ? props.avatar_color : "#bdbdbd"
										}`,
										height: "75px",
										width: "75px",
										margin: "auto",
										backgroundColor: props.avatar_color
											? props.avatar_color
											: "#bdbdbd",
									}}
								>
									{/* {props.username.charAt(0).toUpperCase()} */}Test
								</Avatar>
							</ListItem>
							<ListItem>
								<Hidden xlDown>
									<Typography style={{ textAlign: "center", width: "100%" }}>
										{props.firstname && props.lastname
											? `${props.firstname} ${props.lastname}`
											: props.email}
									</Typography>
								</Hidden>
								<Hidden xlUp mdDown>
									{props.firstname && props.lastname ? (
										<>
											<Typography
												style={{
													textAlign: "center",
													width: "100%",
													color: "#3f3f3f",
												}}
											>
												{props.firstname}
											</Typography>
										</>
									) : (
										<Typography
											style={{
												textAlign: "center",
												width: "100%",
												color: "#3f3f3f",
											}}
										>
											{props.username}
										</Typography>
									)}
								</Hidden>
								<Hidden smUp>
									<Typography
										style={{
											textAlign: "center",
											width: "100%",
											color: "#3f3f3f",
										}}
									>
										{props.firstname && props.lastname
											? `${props.firstname} ${props.lastname}`
											: props.email}
									</Typography>
								</Hidden>
							</ListItem>

							<AnimateSharedLayout>
								{pages.map((item, index) => (
									<SiteItem
										icon={item.icon}
										title={item.title}
										isSelected={index === openedSite}
										key={index}
										label={item.label}
										username={username}
									/>
								))}
							</AnimateSharedLayout>
						</List>
					</motion.div>
				</Grid>

				<Grid item xs={12} sm={8} md={9}>
					<div
						style={{
							width: "100%",
							minHeight: "100%",
							position: "relative",
						}}
					>
						{pages[openedSite].content()}
					</div>
				</Grid>
			</Grid>
		</div>
	);
}

PublicProfile.propTypes = {
	setTitle: PropTypes.func.isRequired,
};

export default connect(null, { setTitle })(withRouter(PublicProfile));
