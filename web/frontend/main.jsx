import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

/**
 * React Application Entry Point
 *
 * Renders the App component into the #app div.
 * The App component handles all provider wrapping (AppBridge, Polaris).
 */
const root = ReactDOM.createRoot(document.getElementById("app"));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
