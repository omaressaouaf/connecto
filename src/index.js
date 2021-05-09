import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "nprogress/nprogress.css";
import "emoji-mart/css/emoji-mart.css";
import App from "./App";
import { Provider } from "react-redux";
import store from "./redux/store";
import { AppThemeProvider } from "./contexts/AppThemeContext";

ReactDOM.render(
  // <React.StrictMode>

  <Provider store={store}>
    <AppThemeProvider>
      <App />
    </AppThemeProvider>
  </Provider>,

  // </React.StrictMode>,
  document.getElementById("root")
);
