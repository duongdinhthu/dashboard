// src/components/doctors/DoctorLayout.js

import React, { useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Box, AppBar, Toolbar, Typography, Button, CssBaseline } from '@mui/material';
import Sidebar from './Sidebar';
import { useNavigate } from 'react-router-dom';

const lightTheme = createTheme({
    palette: {
        mode: 'light',
    },
});

const DoctorLayout = ({ children, onShowTodayAppointments, onShowMonthAppointments, onShowMedicalRecords }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('role');
        localStorage.removeItem('doctorId');
        navigate('/doctorlogin');
    };

    return (
        <ThemeProvider theme={lightTheme}>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                    <Toolbar>
                        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                            Doctor Dashboard
                        </Typography>
                        <Button color="inherit" onClick={handleLogout}>
                            Logout
                        </Button>
                    </Toolbar>
                </AppBar>
                <Sidebar
                    onShowTodayAppointments={onShowTodayAppointments}
                    onShowMonthAppointments={onShowMonthAppointments}
                    onShowMedicalRecords={onShowMedicalRecords}
                />
                <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3, mt: 2 }}>
                    <Toolbar />
                    {children}
                </Box>
            </Box>
        </ThemeProvider>
    );
};

export default DoctorLayout;
