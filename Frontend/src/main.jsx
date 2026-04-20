
import App from "./app";
import React from "react";
import { Provider } from "react-redux";
import { store } from "./states/store";
import ReactDOM from "react-dom/client";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
);
