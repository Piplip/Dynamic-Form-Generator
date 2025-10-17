import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css"
import router from "./route.jsx";
import {RouterProvider} from "react-router";
import "./config/i18n.js"
import { ThemeProvider } from "@mui/material";
import theme from "./theme.ts";

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <RouterProvider router={router}/>
        </ThemeProvider>
    </React.StrictMode>
);
