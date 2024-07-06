import React from 'react';
import { Box, List, ListItem, ListItemText, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

const AppointmentList = ({ searchResults, handleEditClick }) => {
    return (
        <Box>
            <List>
                {searchResults.map((appointment) => (
                    <ListItem key={appointment.appointment_id} sx={{ mb: 1 }}>
                        <ListItemText
                            primary={`Patient: ${appointment.patient_name} - Doctor: ${appointment.doctor_name}`}
                            secondary={`Appointment Date: ${new Date(appointment.appointment_date).toLocaleDateString()} - Medical Day: ${new Date(appointment.medical_day).toLocaleDateString()} - Status: ${appointment.status}`}
                        />
                        <IconButton onClick={() => handleEditClick(appointment)} color="primary">
                            <EditIcon />
                        </IconButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default AppointmentList;
