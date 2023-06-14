import React from "react";
import ReactDOM from "react-dom/client";
import AppView from "./app/main/infrastructure/view/AppView.tsx";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AppView />
  </React.StrictMode>
);
