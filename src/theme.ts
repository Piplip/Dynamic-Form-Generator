import {createTheme} from "@mui/material";

const theme = createTheme({
    components: {
        MuiSelect: {
            styleOverrides: {
                root: {
                    minWidth: 120,
                }
            }
        }
    }
})

export default theme
