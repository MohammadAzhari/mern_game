import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import Err from "./context/Err";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Err>
      <App />
    </Err>
  </React.StrictMode>
);
