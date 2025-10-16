import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { AuthProvider } from "./GlobalContexts/Auth-Context.jsx";
import TokenRefresher from "./GlobalContexts/TokenRefresher.jsx";
import { ThemeProvider } from "@material-tailwind/react";
import { Provider } from "react-redux";
import store from "./reduxToolKit/store/store.jsx";
import "./i8n.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <AuthProvider>
        <ThemeProvider>
          <App />
          <TokenRefresher />
        </ThemeProvider>
      </AuthProvider>
    </Provider>
  </React.StrictMode>
);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then(reg => console.log("Service Worker registered", reg))
      .catch(err => console.log("SW registration failed", err));
  });
}
