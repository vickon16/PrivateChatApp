import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import GeneralContextProvider from "./context/generalContext";
import UserAuthContextProvider from "./context/userAuthContext";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <>
    <React.StrictMode>
      <GeneralContextProvider>
        <UserAuthContextProvider>
          <App />
        </UserAuthContextProvider>
      </GeneralContextProvider>
    </React.StrictMode>
  </>
);
