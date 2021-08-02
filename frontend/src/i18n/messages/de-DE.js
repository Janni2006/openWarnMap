import { LOCALES } from "../languages";

import { NAVBAR } from "./de-De/navbar";
import { ABOUT } from "./de-De/about";
import { TRANSLATIONS } from "./de-De/translations";
import { HELPERS } from "./de-De/helpers";
import { ADD } from "./de-De/add";
import { ERROR } from "./de-De/error";
import { AUTH } from "./de-De/auth";
import { PROFILE } from "./de-De/profile";

export default {
	[LOCALES.GERMAN]: {
		...NAVBAR,
		...ABOUT,
		...TRANSLATIONS,
		...HELPERS,
		...ADD,
		...ERROR,
		...AUTH,
		...PROFILE,
	},
};
