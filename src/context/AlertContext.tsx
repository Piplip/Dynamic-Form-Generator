import {createContext} from "react";

export const AlertContext = createContext({
    alerts: [],
    showAlert: (msg, type, dur) => {},
    closeAlert: (msg, type, dur) => {},
    showSuccess: (msg, type, dur) => {},
    showError: (msg, type, dur) => {},
    showWarning: (msg, type, dur) => {},
    showInfo: (msg, type, dur) => {}
})
