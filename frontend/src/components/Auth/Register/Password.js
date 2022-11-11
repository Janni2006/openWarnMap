import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import InputField from "../../InputField";

import zxcvbn from "zxcvbn";

import { useIntl } from "react-intl";

import StepWrapper from "./StepWrapper";

function Password(props) {
	const [passwordScore, setPasswordScore] = React.useState(0);
	const [input, setInput] = React.useState({ password: "", conf_password: "" });
	const [errors, setErrors] = React.useState({
		password: "",
		conf_password: "",
	});
	const [valid, setValid] = React.useState({
		password: false,
		conf_password: false,
	});
	const intl = useIntl();

	const passwordField = React.useRef(null);

	//TODO: Send the information back to the index file
	const handleNext = () => {
		props.setValues(input.password, input.conf_password);
		props.handleNext();
	};

	//TODO: Send information back to the index file
	const handleBack = () => {
		props.setValues(input.password, input.conf_password);
		props.handleBack();
	};

	React.useEffect(() => {
		if (input.password) {
			if (zxcvbn(input.password).score < 3) {
				setErrors({
					...errors,
					password: intl.formatMessage({ id: "AUTH_PASSWORD_NOT_STRONG" }),
				});
			} else {
				setErrors({
					...errors,
					password: "",
				});
				setValid({ ...valid, password: true });
			}
		} else {
			setValid({ ...valid, password: false });
		}
	}, [input.password]);

	React.useEffect(() => {
		if (input.conf_password != "") {
			if (input.conf_password == input.password) {
				setValid({ ...valid, conf_password: true });
				setErrors({ ...errors, conf_password: false });
			} else {
				setValid({ ...valid, conf_password: false });
				setErrors({ ...errors, conf_password: true });
			}
		} else {
			setValid({ ...valid, conf_password: false });
			setErrors({ ...errors, conf_password: false });
		}
	}, [input.conf_password]);

	React.useEffect(() => {
		if (input.password == "" && input.conf_password == "") {
			setInput(props.input);
		}
	}, [props.input]);

	React.useEffect(() => {
		console.log(valid);
	}, [valid]);

	return (
		<StepWrapper
			handleNext={handleNext}
			handleBack={handleBack}
			disabled={!valid.password || !valid.conf_password}
		>
			<InputField
				type="password"
				name="password"
				error={errors.password}
				input={input.password}
				placeholder={intl.formatMessage({
					id: "AUTH_REGISTER_PASSWORD_PLACEHOLDER",
				})}
				onChange={(e) => {
					setPasswordScore(zxcvbn(e.target.value).score);
					setInput({ ...input, password: e.target.value });
				}}
				underline={{
					color:
						passwordScore == 1
							? "red"
							: passwordScore == 2
							? "orange"
							: passwordScore == 3
							? "yellow"
							: passwordScore == 4
							? "green"
							: "#cccccc",
					width: passwordScore * 25,
				}}
				info={`Strength: ${passwordScore}`}
				reference={passwordField}
				autoComplete="new-password"
			/>
			<InputField
				type="password"
				name="conf-password"
				error={errors.conf_password}
				input={input.conf_password}
				placeholder={intl.formatMessage({
					id: "AUTH_REGISTER_CONFIRM_PASSWORD_PLACEHOLDER",
				})}
				onChange={(e) => {
					setInput({
						...input,
						conf_password: e.target.value,
					});
				}}
				autoComplete="new-password"
			/>
		</StepWrapper>
	);
}

Password.propTypes = {
	progress: PropTypes.bool.isRequired,
	handleNext: PropTypes.func.isRequired,
	handleBack: PropTypes.func.isRequired,
	setValues: PropTypes.func.isRequired,
	addErrorStep: PropTypes.func.isRequired,
	removeErrorStep: PropTypes.func.isRequired,
	isErrorStep: PropTypes.func.isRequired,
	input: PropTypes.shape({
		password: PropTypes.string.isRequired,
		conf_password: PropTypes.string.isRequired,
	}),
};

const mapStateToProps = (state) => ({
	progress: state.auth.progress,
});

export default connect(mapStateToProps)(Password);
