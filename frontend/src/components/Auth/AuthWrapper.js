import React from "react";
import PropTypes from "prop-types";

import {
	Grid,
	Card,
	Hidden,
	Typography,
	useMediaQuery,
	useTheme,
} from "@mui/material";

import { FormattedMessage } from "react-intl";

function AuthWrapper(props) {
	const theme = useTheme();
	const [cardHeight, setCardHeight] = React.useState(0);
	const cardRef = React.useRef(null);

	React.useEffect(() => {
		if (cardRef && cardRef.current.offsetHeight !== cardHeight) {
			setCardHeight(cardRef.current.offsetHeight);
		}
	}, [cardRef]);

	return (
		<div
			style={{
				width: "100%",
				minHeight: "calc(100vh - 90px)",
				height: "100%",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			<Card
				style={{
					borderRadius: "15px",
					height: "100%",
					maxWidth: "1200px",
					width: "calc(100% - 14%)",
					margin: "50px 0px",
				}}
			>
				<Grid container>
					<Hidden lgDown>
						<Grid
							item
							lg={5}
							xs={12}
							style={{
								background: "linear-gradient(90deg, #378d40, #008259)",
								padding: "100px 50px",
								height: `${cardHeight + 64}px`,
								marginBottom: "-64px",
								position: "relative",
							}}
						>
							<div
								style={{
									position: "absolute",
									transform: "translate(0%, -50%)",
									top: "50%",
									width: "calc(100% - 100px)",
									marginTop: "-64px",
								}}
							>
								<Typography
									style={{
										width: "100%",
										textAlign: "center",
										fontFamily: "sans-serif",
										color: "white",
										fontWeight: "300",
										fontSize: useMediaQuery(theme.breakpoints.up("lg"))
											? "25px"
											: "20px",
									}}
								>
									<FormattedMessage id="AUTH_TITLE" />
								</Typography>
								<Typography
									style={{
										width: "100%",
										textAlign: "center",
										fontFamily: "sans-serif",
										color: "white",
										fontWeight: "300",
										fontSize: useMediaQuery(theme.breakpoints.up("lg"))
											? "50px"
											: "40px",
										margin: "0px",
									}}
								>
									OpenWarnMap
								</Typography>
								<Typography
									style={{
										width: "100%",
										textAlign: "center",
										fontFamily: "sans-serif",
										color: "white",
										fontWeight: "300",
										fontSize: useMediaQuery(theme.breakpoints.up("lg"))
											? "16.5px"
											: "14px",
										marginTop: "50px",
									}}
								>
									<FormattedMessage id="AUTH_DESCRIPTION" />
								</Typography>
							</div>
						</Grid>
					</Hidden>

					<Grid
						item
						lg={7}
						xs={12}
						ref={cardRef}
						style={{ padding: "50px 10%", height: "100%" }}
					>
						{props.children}
					</Grid>
				</Grid>
			</Card>
		</div>
	);
}

AuthWrapper.propTypes = {
	children: PropTypes.any.isRequired,
};

export default AuthWrapper;
