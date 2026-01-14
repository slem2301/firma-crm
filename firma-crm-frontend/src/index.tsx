import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./fonts/index";
import "./index.css";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import ru from "date-fns/locale/ru";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";

registerLocale("ru", ru);

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
);
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);

serviceWorkerRegistration.unregister();
