import { LOCALES } from "../../languages";

import { NAVBAR } from "./navbar";
import { ABOUT } from "./about";
import { TRANSLATIONS } from "./translations";
import { HELPERS } from "./helpers";
import { ADD } from "./add";
import { ERROR } from "./error";
import { AUTH } from "./auth";
import { PROFILE } from "./profile";
import { FEEDBACK } from "./feedback";
import { FUNCTIONS } from "./functions";
import { ACTIONS } from "./actions";

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
		...FUNCTIONS,
		...ACTIONS,
	},
};
