import { useIntl } from "react-intl";

export const ConvertMillisecondsToString = (milliseconds = 0) => {
	const intl = useIntl();

	const seconds = parseInt(milliseconds / 1000);
	const minutes = parseInt(seconds / 60);
	const hours = parseInt(minutes / 60);
	const days = parseInt(hours / 24);
	const weeks = parseInt(days / 7);
	const months = parseInt(days / 30);
	const years = parseInt(days / 365);

	if (seconds <= 60) {
		return intl.formatMessage({ id: "HELPERS_COVERT_BELOW_MINUTE" });
	}
	if (minutes === 1) {
		return intl.formatMessage({ id: "HELPERS_COVERT_MINUTE" });
	}
	if (hours === 0) {
		return intl.formatMessage(
			{ id: "HELPERS_COVERT_MINUTES" },
			{ minutes: minutes }
		);
	}
	if (hours === 1) {
		return intl.formatMessage({ id: "HELPERS_COVERT_HOUR" });
	}
	if (days === 0) {
		return intl.formatMessage({ id: "HELPERS_COVERT_HOURS" }, { hours: hours });
	}
	if (days === 1) {
		return intl.formatMessage({ id: "HELPERS_COVERT_DAY" });
	}
	if (weeks === 0) {
		return intl.formatMessage({ id: "HELPERS_COVERT_DAYS" }, { days: days });
	}
	if (weeks === 1) {
		return intl.formatMessage({ id: "HELPERS_COVERT_WEEK" });
	}
	if (months === 0) {
		return intl.formatMessage({ id: "HELPERS_COVERT_WEEKS" }, { weeks: weeks });
	}
	if (months === 1) {
		return intl.formatMessage({ id: "HELPERS_COVERT_MONTH" });
	}
	if (years === 0) {
		return intl.formatMessage(
			{ id: "HELPERS_COVERT_MONTHS" },
			{ months: months }
		);
	}
	if (years === 1) {
		return intl.formatMessage({ id: "HELPERS_COVERT_YEAR" });
	}
	if (years > 1) {
		return intl.formatMessage({ id: "HELPERS_COVERT_YEARS" }, { years: years });
	}
	return intl.formatMessage({ id: "HELPERS_CONVERT_ERROR" });
};
