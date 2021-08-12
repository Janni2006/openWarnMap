import { LOCALES } from "../languages";

import { NAVBAR } from "./en-US/navbar";
import { ABOUT } from "./en-US/about";
import { TRANSLATIONS } from "./en-US/translations";
import { HELPERS } from "./en-US/helpers";
import { ADD } from "./en-US/add";
import { ERROR } from "./en-US/error";
import { AUTH } from "./en-US/auth";
import { PROFILE } from "./en-US/profile";
import { FEEDBACK } from "./en-US/feedback";

export default {
	[LOCALES.ENGLISH]: {
		...NAVBAR,
		...ABOUT,
		...TRANSLATIONS,
		...HELPERS,
		...ADD,
		...ERROR,
		...AUTH,
		...PROFILE,
		...FEEDBACK,
	},
};
