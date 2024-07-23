import React from 'react';
import { List, ListItem, ListItemIcon, ListItemText, Box } from '@mui/material';
import InboxIcon from '@mui/icons-material/Inbox';
import PeopleIcon from '@mui/icons-material/People';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import GroupIcon from '@mui/icons-material/Group';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';

const Sidebar = ({ onInboxClick, handleOpenDoctorsPage, handleOpenPatientsPage, handleOpenAppointmentsPage, handleOpenStaffPage }) => {
    return (
        <Box sx={{ height: '100vh', overflowY: 'auto', marginTop: '100px' }}>
            <List>
                <ListItem button onClick={handleOpenDoctorsPage}>
                    <ListItemIcon>
                        <LocalHospitalIcon />
                    </ListItemIcon>
                    <ListItemText primary="Total Doctors" />
                </ListItem>
                <ListItem button onClick={handleOpenPatientsPage}>
                    <ListItemIcon>
                        <PeopleIcon />
                    </ListItemIcon>
                    <ListItemText primary="Total Patients" />
                </ListItem>
                <ListItem button onClick={handleOpenAppointmentsPage}>
                    <ListItemIcon>
                        <CalendarTodayIcon />
                    </ListItemIcon>
                    <ListItemText primary="Total Appointments" />
                </ListItem>
                <ListItem button onClick={handleOpenStaffPage}>
                    <ListItemIcon>
                        <GroupIcon />
                    </ListItemIcon>
                    <ListItemText primary="Total Staff" />
                </ListItem>
                <ListItem button onClick={onInboxClick}>
                    <ListItemIcon>
                        <InboxIcon />
                    </ListItemIcon>
                    <ListItemText primary="Hộp thư đến" />
                </ListItem>
            </List>
        </Box>
    );
};

export default Sidebar;
