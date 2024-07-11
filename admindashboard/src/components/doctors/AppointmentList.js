import React from 'react';
import { List, ListItem, ListItemText, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const AppointmentList = ({ appointments, onEdit, onDelete }) => {
    return (
        <List>
            {appointments.map((appointment) => (
                <ListItem key={appointment.id}>
                    <ListItemText
                        primary={`${appointment.doctor_name} with ${appointment.patient_name}`}
                        secondary={`Date: ${appointment.appointment_date}, Notes: ${appointment.notes}`}
                    />
                    <IconButton edge="end" onClick={() => onEdit(appointment)}>
                        <EditIcon />
                    </IconButton>
                    <IconButton edge="end" onClick={() => onDelete(appointment.id)}>
                        <DeleteIcon />
                    </IconButton>
                </ListItem>
            ))}
        </List>
    );
};

export default AppointmentList;
