// src/components/staffs/Sidebar.js

import React from 'react';
import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Assignment, Inbox } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
    const navigate = useNavigate();

    const handleOpenPendingAppointments = () => {
        navigate('/staffdashboard?status=Pending');
    };

    const handleOpenConfirmedAppointments = () => {
        navigate('/staffdashboard?status=Confirmed');
    };

    const handleOpenCompletedAppointments = () => {
        navigate('/staffdashboard?status=Completed');
    };

    const handleOpenCancelledAppointments = () => {
        navigate('/staffdashboard?status=Cancelled');
    };

    const handleOpenInbox = () => {
        // Implement inbox functionality
    };

    return (
        <List>
            <ListItem button onClick={handleOpenPendingAppointments}>
                <ListItemIcon>
                    <Assignment />
                </ListItemIcon>
                <ListItemText primary="Pending Appointments" />
            </ListItem>
            <ListItem button onClick={handleOpenConfirmedAppointments}>
                <ListItemIcon>
                    <Assignment />
                </ListItemIcon>
                <ListItemText primary="Confirmed Appointments" />
            </ListItem>
            <ListItem button onClick={handleOpenCompletedAppointments}>
                <ListItemIcon>
                    <Assignment />
                </ListItemIcon>
                <ListItemText primary="Completed Appointments" />
            </ListItem>
            <ListItem button onClick={handleOpenCancelledAppointments}>
                <ListItemIcon>
                    <Assignment />
                </ListItemIcon>
                <ListItemText primary="Cancelled Appointments" />
            </ListItem>
            <ListItem button onClick={handleOpenInbox}>
                <ListItemIcon>
                    <Inbox />
                </ListItemIcon>
                <ListItemText primary="Inbox" />
            </ListItem>
        </List>
    );
};

export default Sidebar;
