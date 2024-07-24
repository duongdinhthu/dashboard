// src/components/doctors/Sidebar.js

import React from 'react';
import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { CalendarToday, CalendarMonth, MedicalServices } from '@mui/icons-material';

const Sidebar = ({ onShowTodayAppointments, onShowMonthAppointments, onShowMedicalRecords }) => {
    return (
        <List>
            <ListItem button onClick={onShowTodayAppointments}>
                <ListItemIcon>
                    <CalendarToday />
                </ListItemIcon>
                <ListItemText primary="Lịch khám hôm nay" />
            </ListItem>
            <ListItem button onClick={onShowMonthAppointments}>
                <ListItemIcon>
                    <CalendarMonth />
                </ListItemIcon>
                <ListItemText primary="Lịch khám trong tháng" />
            </ListItem>
            <ListItem button onClick={onShowMedicalRecords}>
                <ListItemIcon>
                    <MedicalServices />
                </ListItemIcon>
                <ListItemText primary="Bệnh án" />
            </ListItem>
        </List>
    );
};

export default Sidebar;
