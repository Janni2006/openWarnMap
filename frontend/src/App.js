import React, { Component } from "react";

import { Router } from "react-router-dom";
import { createBrowserHistory } from "history";

import { Provider } from "react-redux";
import store from "./store";
import { loadUser } from "./actions/authActions";
import { clientCheck } from "./actions/clientActions";

import { HelmetProvider } from "react-helmet-async";

import { ThemeProvider, StyledEngineProvider, createTheme, adaptV4Theme } from "@mui/material/styles";

import Content from "./components/Content";
import { render } from "react-dom";

const theme = createTheme(adaptV4Theme({
	palette: {
		primary: {
			main: "#3f3f3f",
			contrastText: "#ffffff",
		},
		secondary: {
			main: "#7a7a7a",
		},
	},
}));

class App extends Component {
	componentDidMount() {
		store.dispatch(loadUser());
		setInterval(() => {
			store.dispatch(clientCheck());
		}, 500);
	}

	render() {
		const customHistory = createBrowserHistory();
		return (
            <StyledEngineProvider injectFirst>
                <ThemeProvider theme={theme}>
                    <Provider store={store}>
                        <HelmetProvider>
                            <Router history={customHistory}>
                                <Content />
                            </Router>
                        </HelmetProvider>
                    </Provider>
                </ThemeProvider>
            </StyledEngineProvider>
        );
	}
}

export default App;
