import React, {useEffect, useState} from "react";
import {Button, Fade, IconButton, Paper, Stack} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FeedbackIcon from "@mui/icons-material/Feedback";
import {useTranslation} from "react-i18next";
import {Link} from "react-router-dom";

const floatingStyle = {
    position: "fixed",
    bottom: 24,
    right: 24,
    zIndex: 1500,
};

const DISMISS_KEY = "featureRequestDismissed";

function RequestFeature() {
    const { t } = useTranslation();
    const [dismissed, setDismissed] = useState(false);

    // useEffect(() => {
        // const stored = sessionStorage.getItem(DISMISS_KEY);
        // setDismissed(stored === "1");
    // }, []);

    const handleDismiss = () => {
        setDismissed(true);
        // sessionStorage.setItem(DISMISS_KEY, "1");
    };

    if (dismissed) {
        return null;
    }

    return (
        <Fade in>
            <Paper elevation={6} sx={floatingStyle}>
                <Stack direction="row" spacing={1} alignItems="center" p={1.25}>
                    <Link to={'https://docs.google.com/forms/d/e/1FAIpQLSdg5C9xW9H0OCmC5hFPE6e7F8_wsCqTkgAGj1NHBuiogb3JMw/viewform?usp=dialog'} target={'_blank'}>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<FeedbackIcon />}
                            sx={{ borderRadius: 3, textTransform: "none" }}
                        >
                            {t('requestFeature.button')}
                        </Button>
                    </Link>
                    <IconButton
                        size="small"
                        aria-label={t('requestFeature.dismiss')}
                        color="default"
                        onClick={handleDismiss}
                        sx={{ ml: 0.5 }}
                    >
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </Stack>
            </Paper>
        </Fade>
    );
}

export default RequestFeature;
