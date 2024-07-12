import React, { useState, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { TextField, MenuItem, IconButton } from '@mui/material';
import axios from 'axios';
import SearchIcon from '@mui/icons-material/Search';

const lightTheme = createTheme({
    palette: {
        mode: 'light',
    },
});

const DoctorDashboard = () => {
    const [doctor, setDoctor] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [medicalRecords, setMedicalRecords] = useState([]);
    const [error, setError] = useState('');
    const [appointmentFields, setAppointmentFields] = useState([]);
    const [medicalRecordFields, setMedicalRecordFields] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('appointments');
    const [searchField, setSearchField] = useState('');
    const [searchValue, setSearchValue] = useState('');

    useEffect(() => {
        const storedDoctorId = localStorage.getItem('doctor_id');
        if (storedDoctorId) {
            axios.get(`http://localhost:8080/api/v1/doctors/${storedDoctorId}`)
                .then(response => {
                    setDoctor(response.data);
                })
                .catch(error => {
                    console.error('Error fetching doctor data', error);
                    setError('Error fetching doctor data');
                });

            axios.get('http://localhost:8080/api/v1/appointments/fields')
                .then(response => {
                    setAppointmentFields(response.data.filter(field => field !== 'doctor_id'));
                })
                .catch(error => {
                    console.error('Error fetching appointment fields', error);
                    setError('Error fetching appointment fields');
                });

            axios.get('http://localhost:8080/api/v1/medicalrecords/fields')
                .then(response => {
                    setMedicalRecordFields(response.data.filter(field => field !== 'doctor_id'));
                })
                .catch(error => {
                    console.error('Error fetching medical record fields', error);
                    setError('Error fetching medical record fields');
                });
        }
    }, []);

    const handleSearch = () => {
        const apiUrl = selectedCategory === 'appointments'
            ? 'http://localhost:8080/api/v1/appointments/search'
            : 'http://localhost:8080/api/v1/medicalrecords/search';

        const params = {
            [searchField]: searchValue,
            doctor_id: doctor.doctor_id
        };

        axios.get(apiUrl, { params })
            .then(response => {
                if (selectedCategory === 'appointments') {
                    setAppointments(response.data);
                } else {
                    setMedicalRecords(response.data);
                }
            })
            .catch(error => {
                console.error(`Error fetching ${selectedCategory}`, error);
                setError(`Error fetching ${selectedCategory}`);
            });
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
        <ThemeProvider theme={lightTheme}>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                    <Toolbar>
                        <Typography variant="h6" noWrap component="div">
                            Doctor Dashboard
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}>
                    <Toolbar />
                    <Container>
                        {error && <Typography color="error">{error}</Typography>}
                        {doctor && (
                            <Box>
                                <Typography variant="h6">Welcome, Dr. {doctor.doctor_name}</Typography>
                                <Typography variant="body1">Department: {doctor.department_id}</Typography>
                                <Typography variant="body1">Description: {doctor.doctor_description}</Typography>
                            </Box>
                        )}
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <TextField
                                select
                                label="Category"
                                value={selectedCategory}
                                onChange={(e) => {
                                    setSelectedCategory(e.target.value);
                                    setSearchField('');
                                    setSearchValue('');
                                }}
                                sx={{ mr: 2 }}
                            >
                                <MenuItem value="appointments">Appointments</MenuItem>
                                <MenuItem value="medicalrecords">Medical Records</MenuItem>
                            </TextField>
                            <TextField
                                select
                                label="Field"
                                value={searchField}
                                onChange={(e) => setSearchField(e.target.value)}
                                sx={{ mr: 2 }}
                                disabled={!selectedCategory}
                            >
                                {(selectedCategory === 'appointments' ? appointmentFields : medicalRecordFields).map((field) => (
                                    <MenuItem key={field} value={field}>
                                        {field}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <TextField
                                label="Value"
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                sx={{ mr: 2 }}
                            />
                            <IconButton onClick={handleSearch} color="primary">
                                <SearchIcon />
                            </IconButton>
                        </Box>
                        <Typography variant="h6" gutterBottom>
                            Appointments
                        </Typography>
                        <List>
                            {appointments.map((appointment, index) => (
                                <ListItem key={index}>
                                    <ListItemText
                                        primary={`Patient: ${appointment.patient?.[0]?.patient_name || 'N/A'}`}
                                        secondary={`Medical Day: ${new Date(appointment.medical_day).toLocaleDateString()} - Time: ${getTimeFromSlot(appointment.slot)}`}
                                    />
                                </ListItem>
                            ))}
                        </List>
                        <Typography variant="h6" gutterBottom>
                            Medical Records
                        </Typography>
                        <List>
                            {medicalRecords.map((record, index) => (
                                <ListItem key={index}>
                                    <ListItemText
                                        primary={`Patient: ${record.patient?.[0]?.patient_name || 'N/A'}`}
                                        secondary={`Symptoms: ${record.symptoms}, Diagnosis: ${record.diagnosis}`}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Container>
                </Box>
            </Box>
        </ThemeProvider>
    );
};

export default DoctorDashboard;
