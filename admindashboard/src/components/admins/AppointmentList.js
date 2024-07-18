import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const AppointmentList = ({ searchResults, handleEditClick, handleDeleteClick }) => {
    const getPatientName = (appointment) => {
        return appointment.patient && appointment.patient.length > 0 ? appointment.patient[0].patient_name : 'N/A';
    };

    const getDoctorName = (appointment) => {
        return appointment.doctor && appointment.doctor.length > 0 ? appointment.doctor[0].doctor_name : 'N/A';
    };

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
                            <TableCell>{getPatientName(appointment)}</TableCell>
                            <TableCell>{getDoctorName(appointment)}</TableCell>
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
