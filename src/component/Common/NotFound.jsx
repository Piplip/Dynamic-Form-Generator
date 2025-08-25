import React from "react";
import { Box, Typography, Button, Stack, Paper } from "@mui/material";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function NotFoundPage() {
    const navigate = useNavigate();
    const { t } = useTranslation();

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
                px: 2
            }}
        >
            <Paper
                elevation={4}
                sx={{
                    borderRadius: 4,
                    p: { xs: 3, sm: 5 },
                    textAlign: "center",
                    width: 500,
                    maxWidth: 600,
                    bgcolor: "white"
                }}
            >
                <Stack spacing={2} alignItems="center">
                    <SentimentDissatisfiedIcon
                        sx={{ fontSize: { xs: 60, sm: 80 }, color: "primary.main" }}
                    />
                    <Typography variant="h3" fontWeight={700} fontSize={{ xs: "2rem", sm: "3rem" }}>
                        {t('notFound.title')}
                    </Typography>
                    <Typography variant="h6" fontWeight={600}>
                        {t('notFound.subtitle')}
                    </Typography>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ maxWidth: 450 }}
                    >
                        {t('notFound.description')}
                    </Typography>
                    <Stack direction={'row'}>
                        <Button
                            variant="contained"
                            sx={{ mt: 2, textTransform: "none", borderRadius: 2, px: 3 }}
                            onClick={() => navigate("/")}
                        >
                            {t('notFound.backHomeButton')}
                        </Button>
                    </Stack>
                </Stack>
            </Paper>
        </Box>
    );
}

export default NotFoundPage;
