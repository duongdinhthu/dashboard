import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const AppointmentList = ({ searchResults, handleEditClick, handleDeleteClick }) => {
    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Patient Name</TableCell>
                        <TableCell>Doctor Name</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Slot</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Payment</TableCell>
                        <TableCell>Price</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {searchResults.map((appointment) => (
                        <TableRow key={appointment.appointment_id}>
                            <TableCell>{appointment.appointment_id}</TableCell>
                            <TableCell>{appointment.patient_name}</TableCell>
                            <TableCell>{appointment.doctor_name}</TableCell>
                            <TableCell>{appointment.appointment_date}</TableCell>
                            <TableCell>{appointment.slot}</TableCell>
                            <TableCell>{appointment.status}</TableCell>
                            <TableCell>{appointment.payment_name}</TableCell>
                            <TableCell>{appointment.price}</TableCell>
                            <TableCell>
                                <IconButton onClick={() => handleEditClick(appointment)} color="primary">
                                    <EditIcon />
                                </IconButton>
                                <IconButton onClick={() => handleDeleteClick(appointment.appointment_id)} color="secondary">
                                    <DeleteIcon />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default AppointmentList;
