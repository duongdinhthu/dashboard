// src/components/staffs/StaffLayout.js

import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Box, AppBar, Toolbar, Typography, Button, CssBaseline } from '@mui/material';
import Sidebar from './Sidebar';
import { useNavigate } from 'react-router-dom';

const lightTheme = createTheme({
    palette: {
        mode: 'light',
    },
});

const StaffLayout = ({ children }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('role');
        localStorage.removeItem('staffId');
        navigate('/stafflogin');
    };

    return (
        <ThemeProvider theme={lightTheme}>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                    <Toolbar>
                        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                            Staff Dashboard
                        </Typography>
                        <Button color="inherit" onClick={handleLogout}>
                            Logout
                        </Button>
                    </Toolbar>
                </AppBar>
                <Sidebar />
                <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3, mt: 8 }}>
                    <Toolbar />
                    {children}
                </Box>
            </Box>
        </ThemeProvider>
    );
};

export default StaffLayout;
