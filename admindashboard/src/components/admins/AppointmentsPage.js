import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const AppointmentsPage = () => {
    const [appointments, setAppointments] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/v1/appointments/list');
                const sortedData = response.data.sort((a, b) => new Date(b.medical_day) - new Date(a.medical_day));
                setAppointments(sortedData);
            } catch (error) {
                console.error('Error fetching appointments', error);
            }
        };
        fetchAppointments();
    }, []);

    const convertSlotToTime = (slot) => {
        const slotMapping = {
            1: '08:00 AM - 09:00 AM',
            2: '09:00 AM - 10:00 AM',
            3: '10:00 AM - 11:00 AM',
            4: '11:00 AM - 12:00 PM',
            5: '01:00 PM - 02:00 PM',
            6: '02:00 PM - 03:00 PM',
            7: '03:00 PM - 04:00 PM',
            8: '04:00 PM - 05:00 PM'
        };
        return slotMapping[slot] || 'N/A';
    };

    const handleBack = () => {
        navigate('/admindashboard');
    };

    return (
        <Box sx={{ padding: 4 }}>
            <Typography variant="h4" gutterBottom>
                Total Appointments
            </Typography>
            <Button variant="contained" color="primary" onClick={handleBack} sx={{ mb: 2 }}>
                Back to Admin Dashboard
            </Button>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Patient</TableCell>
                            <TableCell>Doctor</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Time</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Price</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {appointments.length > 0 ? (
                            appointments.map((appointment, index) => (
                                <TableRow key={index}>
                                    <TableCell>{appointment.appointment_id}</TableCell>
                                    <TableCell>{appointment.patient && appointment.patient[0] ? appointment.patient[0].patient_name : 'N/A'}</TableCell>
                                    <TableCell>{appointment.doctor && appointment.doctor[0] ? appointment.doctor[0].doctor_name : 'N/A'}</TableCell>
                                    <TableCell>{new Date(appointment.medical_day).toLocaleDateString()}</TableCell>
                                    <TableCell>{convertSlotToTime(appointment.slot)}</TableCell>
                                    <TableCell>{appointment.status}</TableCell>
                                    <TableCell>{appointment.price}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} align="center">No appointments found</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default AppointmentsPage;
