import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css"
import router from "./route.jsx";
import {RouterProvider} from "react-router";
import "./config/i18n.js"

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);
