import {createContext} from "react";

export const AlertContext = createContext({
    alerts: [],
    showAlert: () => {},
    closeAlert: () => {},
    showSuccess: () => {},
    showError: () => {},
    showWarning: () => {},
    showInfo: () => {}
})
