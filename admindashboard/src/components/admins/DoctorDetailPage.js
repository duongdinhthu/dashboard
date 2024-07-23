import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Typography, Box, Card, CardContent, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

const DoctorDetailPage = () => {
    const { doctorId } = useParams();
    const [doctor, setDoctor] = useState(null);
    const [todayAppointments, setTodayAppointments] = useState([]);
    const [monthlyAppointments, setMonthlyAppointments] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDoctorDetails = async () => {
            try {
                const doctorResponse = await axios.get(`http://localhost:8080/api/v1/doctors/${doctorId}`);
                setDoctor(doctorResponse.data);
            } catch (error) {
                console.error('Error fetching doctor details', error);
            }
        };

        const fetchTodayAppointments = async () => {
            try {
                const today = new Date().toISOString().split('T')[0];
                const response = await axios.get(`http://localhost:8080/api/v1/appointments/search`, {
                    params: {
                        doctor_id: doctorId,
                        medical_day: today,
                    }
                });
                setTodayAppointments(response.data);
            } catch (error) {
                console.error('Error fetching today\'s appointments', error);
            }
        };

        const fetchMonthlyAppointments = async () => {
            try {
                const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
                const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split('T')[0];
                const response = await axios.get(`http://localhost:8080/api/v1/appointments/search`, {
                    params: {
                        doctor_id: doctorId,
                        start_date: startOfMonth,
                        end_date: endOfMonth,
                    }
                });
                setMonthlyAppointments(response.data);
            } catch (error) {
                console.error('Error fetching monthly appointments', error);
            }
        };

        fetchDoctorDetails();
        fetchTodayAppointments();
        fetchMonthlyAppointments();
    }, [doctorId]);

    const handleBack = () => {
        navigate('/doctors');
    };

    const getTimeFromSlot = (slot) => {
        const slotToTime = {
            1: "08:00 - 09:00",
            2: "09:00 - 10:00",
            3: "10:00 - 11:00",
            4: "11:00 - 12:00",
            5: "13:00 - 14:00",
            6: "14:00 - 15:00",
            7: "15:00 - 16:00",
            8: "16:00 - 17:00"
        };
        return slotToTime[slot] || "Unknown Time";
    };

    return (
        <Box sx={{ padding: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                <Typography variant="h4" gutterBottom>
                    Doctor Details
                </Typography>
                <Button variant="contained" color="primary" onClick={handleBack}>
                    Back to Doctors Page
                </Button>
            </Box>
            {doctor && (
                <Box sx={{ marginBottom: 4 }}>
                    <Typography variant="h5">{doctor.doctor_name}</Typography>
                    <Typography variant="body1">Email: {doctor.doctor_email}</Typography>
                    <Typography variant="body1">Phone: {doctor.doctor_phone}</Typography>
                    <Typography variant="body1">Address: {doctor.doctor_address}</Typography>
                    <Typography variant="body1">Working Status: {doctor.working_status}</Typography>
                </Box>
            )}
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Today's Appointments
                            </Typography>
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Time</TableCell>
                                            <TableCell>Patient</TableCell>
                                            <TableCell>Status</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {todayAppointments.map(appointment => (
                                            <TableRow key={appointment.appointment_id}>
                                                <TableCell>{getTimeFromSlot(appointment.slot)}</TableCell>
                                                <TableCell>{appointment.patient?.[0]?.patient_name || 'N/A'}</TableCell>
                                                <TableCell>{appointment.status}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Monthly Appointments
                            </Typography>
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Date</TableCell>
                                            <TableCell>Time</TableCell>
                                            <TableCell>Patient</TableCell>
                                            <TableCell>Status</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {monthlyAppointments.map(appointment => (
                                            <TableRow key={appointment.appointment_id}>
                                                <TableCell>{new Date(appointment.medical_day).toLocaleDateString()}</TableCell>
                                                <TableCell>{getTimeFromSlot(appointment.slot)}</TableCell>
                                                <TableCell>{appointment.patient?.[0]?.patient_name || 'N/A'}</TableCell>
                                                <TableCell>{appointment.status}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default DoctorDetailPage;
