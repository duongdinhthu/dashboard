// src/components/staffs/StaffDashboard.js

import React, { useState, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline, AppBar, Toolbar, Typography, Container, Box, Button, IconButton, MenuItem, Select, FormControl, InputLabel, Card, CardContent, Grid } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import EditAppointmentModal from "./EditAppointmentModal";
import { useNavigate } from 'react-router-dom';
import './StaffDashboard.css'; // Import file CSS

const lightTheme = createTheme({
    palette: {
        mode: 'light',
    },
});

const StaffDashboard = () => {
    const [searchResults, setSearchResults] = useState([]);
    const [statusFilter, setStatusFilter] = useState('Pending');
    const [error, setError] = useState('');
    const [editItem, setEditItem] = useState(null);
    const [showPendingAppointments, setShowPendingAppointments] = useState(true);
    const [showConfirmedAppointments, setShowConfirmedAppointments] = useState(false);
    const [showCompletedAppointments, setShowCompletedAppointments] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchAppointments('Pending');
    }, []);

    const fetchAppointments = (status) => {
        axios.get(`http://localhost:8080/api/v1/appointments/search`, {
            params: { status }
        })
            .then(response => {
                const flatData = response.data.map(item => ({
                    appointment_id: item.appointment_id,
                    patient_name: item.patient?.[0]?.patient_name,
                    doctor_name: item.doctor?.[0]?.doctor_name,
                    appointment_date: item.appointment_date,
                    medical_day: item.medical_day,
                    slot: item.slot,
                    status: item.status,
                    payment_name: item.payment_name,
                    price: item.price,
                    staff_id: item.staff_id,
                }));
                setSearchResults(flatData);
            })
            .catch(error => {
                console.error('Error fetching appointments', error);
                setError('Error fetching appointments');
            });
    };

    const handleStatusChange = (event) => {
        const newStatus = event.target.value;
        setStatusFilter(newStatus);
        fetchAppointments(newStatus);
    };

    const handleEditClick = (item) => {
        setEditItem(item);
    };

    const handleEditModalClose = () => {
        setEditItem(null);
    };

    const handleSaveEdit = (updatedItem) => {
        setSearchResults((prevResults) =>
            prevResults.map((item) =>
                item.appointment_id === updatedItem.appointment_id
                    ? updatedItem
                    : item
            )
        );
        setEditItem(null);
    };

    const handleUpdateStatus = async (appointmentId, newStatus) => {
        try {
            const staffId = localStorage.getItem('staffId');
            await axios.put(`http://localhost:8080/api/v1/appointments/updateStatus`, {
                appointment_id: appointmentId,
                status: newStatus,
                staff_id: staffId // Thêm ID của nhân viên
            });
            setSearchResults((prevResults) =>
                prevResults.map((item) =>
                    item.appointment_id === appointmentId
                        ? { ...item, status: newStatus, staff_id: staffId }
                        : item
                )
            );
            alert(`Appointment ${newStatus.toLowerCase()} successfully.`);
        } catch (error) {
            console.error(`There was an error updating the appointment to ${newStatus.toLowerCase()}!`, error);
            alert(`Failed to update the appointment to ${newStatus.toLowerCase()}.`);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('role');
        localStorage.removeItem('staffId');
        navigate('/stafflogin');
    };

    const handleShowPendingAppointments = () => {
        setShowPendingAppointments(true);
        setShowConfirmedAppointments(false);
        setShowCompletedAppointments(false);
        fetchAppointments('Pending');
    };

    const handleShowConfirmedAppointments = () => {
        setShowPendingAppointments(false);
        setShowConfirmedAppointments(true);
        setShowCompletedAppointments(false);
        fetchAppointments('Confirmed');
    };

    const handleShowCompletedAppointments = () => {
        setShowPendingAppointments(false);
        setShowConfirmedAppointments(false);
        setShowCompletedAppointments(true);
        fetchAppointments('Completed');
    };

    return (
        <ThemeProvider theme={lightTheme}>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                    <Toolbar>
                        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                            Staff Dashboard
                        </Typography>
                        <Button color="inherit" onClick={handleLogout}>
                            Logout
                        </Button>
                    </Toolbar>
                </AppBar>
                <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3, mt: 2 }}>
                    <Toolbar />
                    <Container>
                        {error && <Typography color="error">{error}</Typography>}
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <FormControl sx={{ minWidth: 120, mr: 2 }}>
                                <InputLabel>Status</InputLabel>
                                <Select
                                    value={statusFilter}
                                    onChange={handleStatusChange}
                                    label="Status"
                                >
                                    <MenuItem value="Pending">Pending</MenuItem>
                                    <MenuItem value="Confirmed">Confirmed</MenuItem>
                                    <MenuItem value="Completed">Completed</MenuItem>
                                    <MenuItem value="Cancelled">Cancelled</MenuItem>
                                </Select>
                            </FormControl>
                            <IconButton onClick={() => fetchAppointments(statusFilter)} color="primary">
                                <SearchIcon />
                            </IconButton>
                        </Box>
                        <Typography variant="h6" gutterBottom>
                            Appointment Data
                        </Typography>
                        <Grid container spacing={2}>
                            {searchResults.map((appointment) => (
                                <Grid item xs={12} md={6} lg={4} key={appointment.appointment_id}>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h6" gutterBottom>
                                                {appointment.patient_name}
                                            </Typography>
                                            <Typography variant="body1">
                                                <strong>Doctor Name:</strong> {appointment.doctor_name}
                                            </Typography>
                                            <Typography variant="body1">
                                                <strong>Appointment Date:</strong> {new Date(appointment.appointment_date).toLocaleString()}
                                            </Typography>
                                            <Typography variant="body1">
                                                <strong>Medical Day:</strong> {new Date(appointment.medical_day).toLocaleDateString()}
                                            </Typography>
                                            <Typography variant="body1">
                                                <strong>Slot:</strong> {appointment.slot}
                                            </Typography>
                                            <Typography variant="body1">
                                                <strong>Status:</strong> {appointment.status}
                                            </Typography>
                                            <Typography variant="body1">
                                                <strong>Payment Name:</strong> {appointment.payment_name}
                                            </Typography>
                                            <Typography variant="body1">
                                                <strong>Price:</strong> {appointment.price}
                                            </Typography>
                                            <Typography variant="body1">
                                                <strong>Staff ID:</strong> {appointment.staff_id || 'N/A'}
                                            </Typography>
                                            {appointment.status === 'Pending' && (
                                                <Button onClick={() => handleUpdateStatus(appointment.appointment_id, 'Confirmed')} variant="contained" color="primary" style={{ marginTop: '8px', marginRight: '8px' }}>
                                                    Confirm
                                                </Button>
                                            )}
                                            {appointment.status === 'Confirmed' && (
                                                <>
                                                    <Button onClick={() => handleUpdateStatus(appointment.appointment_id, 'Completed')} variant="contained" color="success" style={{ marginTop: '8px', marginRight: '8px' }}>
                                                        Complete
                                                    </Button>
                                                    <Button onClick={() => handleUpdateStatus(appointment.appointment_id, 'Cancelled')} variant="contained" color="secondary" style={{ marginTop: '8px', marginRight: '8px' }}>
                                                        Cancel
                                                    </Button>
                                                </>
                                            )}
                                            <Button onClick={() => handleEditClick(appointment)} variant="outlined" style={{ marginTop: '8px', marginRight: '8px' }}>
                                                Edit
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Container>
                </Box>
                {editItem && (
                    <EditAppointmentModal
                        appointment={editItem}
                        onClose={handleEditModalClose}
                        onSave={handleSaveEdit}
                    />
                )}
            </Box>
        </ThemeProvider>
    );
};

export default StaffDashboard;
