import React from "react";
import { Box, Typography, Paper, Stack } from "@mui/material";
import NoCellIcon from '@mui/icons-material/NoCell';
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

function MobileUnsupported() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const { t } = useTranslation();

    if (!isMobile) return null;

    return (
        <Box
            sx={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(245, 247, 250, 0.95)",
                backdropFilter: 'blur(10px)',
                zIndex: 2000,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                px: 2
            }}
        >
            <Paper
                elevation={3}
                sx={{
                    borderRadius: 3,
                    p: 4,
                    textAlign: "center",
                    maxWidth: 480,
                    background: "linear-gradient(135deg, #ffffff 0%, #f4f7fb 100%)"
                }}
            >
                <Stack spacing={2} alignItems="center">
                    <NoCellIcon sx={{ fontSize: 48, color: "primary.main" }} />
                    <Typography variant="h6" fontWeight={700}>
                        {t('mobileUnsupported.title')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {t('mobileUnsupported.description')} <Link to={'/best-practices'}>{t('mobileUnsupported.promptGalleryLink')}</Link>
                        {t('mobileUnsupported.description2')}
                    </Typography>
                </Stack>
            </Paper>
        </Box>
    );
}

export default MobileUnsupported;
