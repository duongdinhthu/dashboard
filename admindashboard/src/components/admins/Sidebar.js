// src/components/admins/Sidebar.js

import React from 'react';
import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { AccountCircle, Group, LocalHospital, Inbox } from '@mui/icons-material';

const Sidebar = ({
                     onInboxClick,
                     handleOpenDoctorsPage,
                     handleOpenPatientsPage,
                     handleOpenAppointmentsPage,
                     handleOpenStaffPage
                 }) => {
    return (
        <List>
            <ListItem button onClick={handleOpenDoctorsPage}>
                <ListItemIcon>
                    <LocalHospital />
                </ListItemIcon>
                <ListItemText primary="Total Doctors" />
            </ListItem>
            <ListItem button onClick={handleOpenPatientsPage}>
                <ListItemIcon>
                    <Group />
                </ListItemIcon>
                <ListItemText primary="Total Patients" />
            </ListItem>
            <ListItem button onClick={handleOpenAppointmentsPage}>
                <ListItemIcon>
                    <AccountCircle />
                </ListItemIcon>
                <ListItemText primary="Total Appointments" />
            </ListItem>
            <ListItem button onClick={handleOpenStaffPage}>
                <ListItemIcon>
                    <Group />
                </ListItemIcon>
                <ListItemText primary="Total Staff" />
            </ListItem>
            <ListItem button onClick={onInboxClick}>
                <ListItemIcon>
                    <Inbox />
                </ListItemIcon>
                <ListItemText primary="Hộp thư đến" />
            </ListItem>
        </List>
    );
};

export default Sidebar;
