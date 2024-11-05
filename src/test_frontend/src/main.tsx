import React from "react";
import ReactDOM from "react-dom/client";
import App from "./pages/home/App";
import "./index.scss";
import { AuthProvider } from "./context/AuthContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
