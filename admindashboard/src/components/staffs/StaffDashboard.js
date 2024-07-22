import React, { useState, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import { IconButton, Button, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import EditAppointmentModal from "./EditAppointmentModal";
import { useNavigate } from 'react-router-dom';

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

    return (
        <ThemeProvider theme={lightTheme}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <CssBaseline />
                <AppBar position="fixed">
                    <Toolbar>
                        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                            Staff Dashboard
                        </Typography>
                        <Button color="inherit" onClick={handleLogout}>
                            Logout
                        </Button>
                    </Toolbar>
                </AppBar>
                <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3, mt: 8 }}>
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
                        <div>
                            {searchResults.map((appointment) => (
                                <div key={appointment.appointment_id} style={{ border: '1px solid #ccc', padding: '16px', marginBottom: '16px' }}>
                                    <p><strong>Patient Name:</strong> {appointment.patient_name}</p>
                                    <p><strong>Doctor Name:</strong> {appointment.doctor_name}</p>
                                    <p><strong>Appointment Date:</strong> {new Date(appointment.appointment_date).toLocaleString()}</p>
                                    <p><strong>Medical Day:</strong> {new Date(appointment.medical_day).toLocaleDateString()}</p>
                                    <p><strong>Slot:</strong> {appointment.slot}</p>
                                    <p><strong>Status:</strong> {appointment.status}</p>
                                    <p><strong>Payment Name:</strong> {appointment.payment_name}</p>
                                    <p><strong>Price:</strong> {appointment.price}</p>
                                    <p><strong>Staff ID:</strong> {appointment.staff_id || 'N/A'}</p>
                                    {appointment.status === 'Pending' && (
                                        <Button onClick={() => handleUpdateStatus(appointment.appointment_id, 'Confirmed')} variant="contained" color="primary" style={{ marginRight: '8px' }}>
                                            Confirm
                                        </Button>
                                    )}
                                    {appointment.status === 'Confirmed' && (
                                        <>
                                            <Button onClick={() => handleUpdateStatus(appointment.appointment_id, 'Completed')} variant="contained" color="success" style={{ marginRight: '8px' }}>
                                                Complete
                                            </Button>
                                            <Button onClick={() => handleUpdateStatus(appointment.appointment_id, 'Cancelled')} variant="contained" color="secondary" style={{ marginRight: '8px' }}>
                                                Cancel
                                            </Button>
                                        </>
                                    )}
                                    <Button onClick={() => handleEditClick(appointment)} variant="outlined" style={{ marginRight: '8px' }}>
                                        Edit
                                    </Button>
                                </div>
                            ))}
                        </div>
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
