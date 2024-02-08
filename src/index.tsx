import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import { store } from "./state/store";
import { BrowserRouter } from "react-router-dom";
import {
  StyledEngineProvider,
  ThemeProvider,
  createTheme,
} from "@mui/material";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const theme = createTheme({
  components: {
    MuiDivider: {
      styleOverrides: {
        root: {
          backgroundColor: "#99a2a7",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          backgroundColor: "#636363",
          ":hover": { backgroundColor: "#99a2a7" },
          color: "#f5f5f5",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "#121212",
          ":hover": { backgroundColor: "#3a4659" },
        },
      },
    },
  },
});

root.render(
  <React.StrictMode>
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </Provider>
      </ThemeProvider>
    </StyledEngineProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
function createBrowserRouter(arg0: { path: string }[]) {
  throw new Error("Function not implemented.");
}
