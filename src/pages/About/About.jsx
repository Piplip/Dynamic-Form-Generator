import React, {useEffect, useRef, useState} from "react";
import "./About.css";
import {Box, Button, Dialog, Stack, Typography} from "@mui/material";
import {Link} from "react-router-dom";
import ReplyIcon from '@mui/icons-material/Reply';
import MobileUnsupported from "../../component/Common/MobileUnsupported.jsx";
import {Trans, useTranslation} from "react-i18next";

function About() {
    const leftEyeRef = useRef(null);
    const rightEyeRef = useRef(null);
    const leftPupilRef = useRef(null);
    const rightPupilRef = useRef(null);

    const { t } = useTranslation();
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const handleMouseMove = (e) => {
            const movePupil = (eyeRef, pupilRef) => {
                const eye = eyeRef.current;
                const pupil = pupilRef.current;
                if (!eye || !pupil) return;

                const rect = eye.getBoundingClientRect();
                const eyeCenterX = rect.left + rect.width / 2;
                const eyeCenterY = rect.top + rect.height / 2;

                const dx = e.clientX - eyeCenterX;
                const dy = e.clientY - eyeCenterY;

                const angle = Math.atan2(dy, dx);
                const maxMove = (rect.width / 2) - (pupil.offsetWidth / 2);
                const distance = Math.min(maxMove, Math.hypot(dx, dy));

                const pupilX = Math.cos(angle) * distance;
                const pupilY = Math.sin(angle) * distance;

                pupil.style.transform = `translate(${pupilX}px, ${pupilY}px)`;
            };

            movePupil(leftEyeRef, leftPupilRef);
            movePupil(rightEyeRef, rightPupilRef);
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    return (
        <Box id="about-container">
            <MobileUnsupported />
            <Link to={'/'}>
                <Button className={'back-button'} startIcon={<ReplyIcon/>}>
                    {t("about.backButton")}
                </Button>
            </Link>
            <div className="emoji-container">
                <div className="face">
                    <div className="eye left" ref={leftEyeRef}>
                        <div className="pupil" ref={leftPupilRef}></div>
                    </div>
                    <div className="eye right" ref={rightEyeRef}>
                        <div className="pupil" ref={rightPupilRef}></div>
                    </div>
                    <div className="mouth"></div>
                </div>
            </div>
            <Stack className={'about-content top'}>
                <Typography variant="h6" className="title">
                    {t("about.contactTitle")}
                </Typography>
                <Typography variant="body2" className="about-text">
                    <Trans i18nKey="about.contactText"
                           components={{ email: <a href="mailto:yuanisha@gmail.com" className="email-link" /> }}
                    />
                </Typography>
            </Stack>
            <Stack className={'about-content bottom'}>
                <Typography variant={'h6'} className="title">
                    {t("about.madeBy")}
                </Typography>
                <img src={'https://flagcdn.com/256x192/vn.webp'} alt={'flag'} width={'64px'} />
            </Stack>
            <Stack className={'about-content right'}>
                <Typography variant={'h6'} className="title">
                    {t("about.myProjectsTitle")}
                </Typography>
                <Typography variant={'body2'}>
                    {t("about.myProjectsDescription")}
                </Typography>
            </Stack>
            <Stack className={'about-content left'}>
                <Typography variant={'h6'} className="title">
                    {t("about.donationTitle")}
                </Typography>
                <Typography variant={'body2'}>
                    {t("about.donationDescription")}
                </Typography>
                <Stack direction={'row'} spacing={1} sx={{mt: 1}}>
                    <Link to={'https://paypal.me/yuanisha'} target="_blank" style={{ textDecoration: 'none' }}>
                        <div className={'donation-button paypal'}>
                            PayPal
                        </div>
                    </Link>
                    <div className={'donation-button momo'} onClick={() => setOpen(true)}>
                        MOMO
                    </div>
                </Stack>
            </Stack>
            <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth={'xs'}>
                <Box sx={{boxShadow: 24, p: 4, textAlign: 'center'}}>
                    <img alt={'momo'} width={300}
                         src={'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/QR_code_for_mobile_English_Wikipedia.svg/800px-QR_code_for_mobile_English_Wikipedia.svg.png'}/>
                </Box>
            </Dialog>
        </Box>
    );
}

export default About;
