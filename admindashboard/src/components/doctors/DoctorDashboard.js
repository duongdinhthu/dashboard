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
import { Button, Select, FormControl, InputLabel, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, TextField } from '@mui/material';
import axios from 'axios';

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
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [newStatus, setNewStatus] = useState('');
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openMedicalRecordsDialog, setOpenMedicalRecordsDialog] = useState(false);
    const [openAddMedicalRecordDialog, setOpenAddMedicalRecordDialog] = useState(false);
    const [patientMedicalRecords, setPatientMedicalRecords] = useState([]);
    const [newMedicalRecord, setNewMedicalRecord] = useState({
        symptoms: '',
        diagnosis: '',
        treatment: '',
        test_urine: '',
        test_blood: '',
        x_ray: ''
    });
    const [editData, setEditData] = useState({
        doctor_email: '',
        doctor_address: '',
        current_password: '',
        new_password: '',
        confirm_new_password: '',
    });

    useEffect(() => {
        const storedDoctorId = localStorage.getItem('doctor_id');
        if (storedDoctorId) {
            axios.get(`http://localhost:8080/api/v1/doctors/${storedDoctorId}`)
                .then(response => {
                    setDoctor(response.data);
                    setEditData({
                        doctor_email: response.data.doctor_email,
                        doctor_address: response.data.doctor_address,
                        current_password: '',
                        new_password: '',
                        confirm_new_password: '',
                    });
                })
                .catch(error => {
                    console.error('Error fetching doctor data', error);
                    setError('Error fetching doctor data');
                });

            // Fetch today's appointments
            const today = new Date().toISOString().split('T')[0];
            axios.get('http://localhost:8080/api/v1/appointments/search', {
                params: {
                    medical_day: today,
                    doctor_id: storedDoctorId
                }
            })
                .then(response => {
                    setAppointments(response.data);
                })
                .catch(error => {
                    console.error('Error fetching today\'s appointments', error);
                    setError('Error fetching today\'s appointments');
                });
        }
    }, []);

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

    const handleUpdateStatus = (appointmentId) => {
        axios.put('http://localhost:8080/api/v1/appointments/updateStatus', {
            appointment_id: appointmentId,
            status: newStatus,
            doctor_id: doctor.doctor_id
        })
            .then(response => {
                console.log('Appointment status updated successfully:', response.data);
                setNewStatus('');
                setSelectedAppointment(null);
                // Reload appointments
                const today = new Date().toISOString().split('T')[0];
                axios.get('http://localhost:8080/api/v1/appointments/search', {
                    params: {
                        medical_day: today,
                        doctor_id: doctor.doctor_id
                    }
                })
                    .then(response => {
                        setAppointments(response.data);
                    })
                    .catch(error => {
                        console.error('Error fetching today\'s appointments', error);
                        setError('Error fetching today\'s appointments');
                    });
            })
            .catch(error => {
                console.error('Error updating appointment status:', error);
                setError('Error updating appointment status');
            });
    };

    const handleEditOpen = () => {
        setOpenEditDialog(true);
    };

    const handleEditClose = () => {
        setOpenEditDialog(false);
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleEditSubmit = () => {
        if (editData.new_password !== editData.confirm_new_password) {
            setError('New passwords do not match');
            return;
        }

        const updateData = {
            doctor_id: doctor.doctor_id,
            doctor_email: editData.doctor_email,
            doctor_address: editData.doctor_address,
        };

        if (editData.new_password) {
            updateData.doctor_password = editData.new_password;
        }

        axios.put('http://localhost:8080/api/v1/doctors/update', updateData)
            .then(response => {
                console.log('Doctor profile updated successfully:', response.data);
                setDoctor((prevDoctor) => ({
                    ...prevDoctor,
                    doctor_email: editData.doctor_email,
                    doctor_address: editData.doctor_address,
                }));
                setOpenEditDialog(false);
            })
            .catch(error => {
                console.error('Error updating doctor profile:', error);
                setError('Error updating doctor profile');
            });
    };

    const handleShowMedicalRecords = (patientId) => {
        axios.get('http://localhost:8080/api/v1/medicalrecords/search', {
            params: {
                patient_id: patientId
            }
        })
            .then(response => {
                setPatientMedicalRecords(response.data);
                setOpenMedicalRecordsDialog(true);
            })
            .catch(error => {
                console.error('Error fetching medical records', error);
                setError('Error fetching medical records');
            });
    };

    const handleAddMedicalRecordOpen = () => {
        setOpenAddMedicalRecordDialog(true);
    };

    const handleAddMedicalRecordClose = () => {
        setOpenAddMedicalRecordDialog(false);
    };

    const handleNewMedicalRecordChange = (e) => {
        const { name, value } = e.target;
        setNewMedicalRecord((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleAddMedicalRecordSubmit = () => {
        const medicalRecordData = {
            ...newMedicalRecord,
            patient_id: selectedAppointment.patient_id,
            doctor_id: doctor.doctor_id,
            follow_up_date: new Date().toISOString().split('T')[0],
        };

        axios.post('http://localhost:8080/api/v1/medicalrecords/insert', medicalRecordData)
            .then(response => {
                console.log('Medical record added successfully:', response.data);
                setNewMedicalRecord({
                    symptoms: '',
                    diagnosis: '',
                    treatment: '',
                    test_urine: '',
                    test_blood: '',
                    x_ray: ''
                });
                setOpenAddMedicalRecordDialog(false);
            })
            .catch(error => {
                console.error('Error adding medical record:', error);
                setError('Error adding medical record');
            });
    };

    const handleCloseMedicalRecordsDialog = () => {
        setOpenMedicalRecordsDialog(false);
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
                        <Button color="inherit" onClick={handleEditOpen}>
                            Edit Profile
                        </Button>
                    </Toolbar>
                </AppBar>
                <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}>
                    <Toolbar />
                    <Container>
                        {error && <Typography color="error">{error}</Typography>}
                        {doctor && (
                            <Box>
                                <Typography variant="h6">Welcome, Dr. {doctor.doctor_name}</Typography>
                                <Typography variant="body1">Email: {doctor.doctor_email}</Typography>
                                <Typography variant="body1">Address: {doctor.doctor_address}</Typography>
                                <Typography variant="body1">Working: {doctor.working_status}</Typography>
                            </Box>
                        )}
                        <Typography variant="h6" gutterBottom>
                            Today's Appointments
                        </Typography>
                        <List>
                            {appointments.map((appointment, index) => (
                                <ListItem key={index} button onClick={() => setSelectedAppointment(appointment)}>
                                    <ListItemText
                                        primary={`Patient: ${appointment.patient?.[0]?.patient_name || 'N/A'}`}
                                        secondary={`Medical Day: ${new Date(appointment.medical_day).toLocaleDateString()} - Time: ${getTimeFromSlot(appointment.slot)} - Status: ${appointment.status}`}
                                    />
                                    <Button onClick={() => handleShowMedicalRecords(appointment.patient?.[0]?.patient_id)}>
                                        Show Medical Records
                                    </Button>
                                    <Button onClick={handleAddMedicalRecordOpen}>
                                        Add Medical Record
                                    </Button>
                                </ListItem>
                            ))}
                        </List>
                        {selectedAppointment && (
                            <Box>
                                <FormControl sx={{ m: 1, minWidth: 120 }}>
                                    <InputLabel>Status</InputLabel>
                                    <Select
                                        value={newStatus}
                                        onChange={(e) => setNewStatus(e.target.value)}
                                    >
                                        <MenuItem value="Completed">Completed</MenuItem>
                                        <MenuItem value="Cancelled">Canceled</MenuItem>
                                    </Select>
                                </FormControl>
                                <Button variant="contained" color="primary" onClick={() => handleUpdateStatus(selectedAppointment.appointment_id)}>
                                    Update Status
                                </Button>
                            </Box>
                        )}
                    </Container>
                    <Dialog open={openEditDialog} onClose={handleEditClose}>
                        <DialogTitle>Edit Profile</DialogTitle>
                        <DialogContent>
                            <TextField
                                margin="dense"
                                name="doctor_email"
                                label="Email"
                                type="email"
                                fullWidth
                                value={editData.doctor_email}
                                onChange={handleEditChange}
                            />
                            <TextField
                                margin="dense"
                                name="doctor_address"
                                label="Address"
                                type="text"
                                fullWidth
                                value={editData.doctor_address}
                                onChange={handleEditChange}
                            />
                            <TextField
                                margin="dense"
                                name="current_password"
                                label="Current Password"
                                type="password"
                                fullWidth
                                value={editData.current_password}
                                onChange={handleEditChange}
                            />
                            <TextField
                                margin="dense"
                                name="new_password"
                                label="New Password"
                                type="password"
                                fullWidth
                                value={editData.new_password}
                                onChange={handleEditChange}
                            />
                            <TextField
                                margin="dense"
                                name="confirm_new_password"
                                label="Confirm New Password"
                                type="password"
                                fullWidth
                                value={editData.confirm_new_password}
                                onChange={handleEditChange}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleEditClose} color="primary">
                                Cancel
                            </Button>
                            <Button onClick={handleEditSubmit} color="primary">
                                Save
                            </Button>
                        </DialogActions>
                    </Dialog>
                    <Dialog open={openMedicalRecordsDialog} onClose={handleCloseMedicalRecordsDialog}>
                        <DialogTitle>Medical Records</DialogTitle>
                        <DialogContent>
                            <List>
                                {patientMedicalRecords.map((record, index) => (
                                    <ListItem key={index}>
                                        <ListItemText
                                            primary={`Record ID: ${record.medicalrecord_id}`}
                                            secondary={`Symptoms: ${record.symptoms}, Diagnosis: ${record.diagnosis}`}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseMedicalRecordsDialog} color="primary">
                                Close
                            </Button>
                        </DialogActions>
                    </Dialog>
                    <Dialog open={openAddMedicalRecordDialog} onClose={handleAddMedicalRecordClose}>
                        <DialogTitle>Add Medical Record</DialogTitle>
                        <DialogContent>
                            <TextField
                                margin="dense"
                                name="symptoms"
                                label="Symptoms"
                                type="text"
                                fullWidth
                                value={newMedicalRecord.symptoms}
                                onChange={handleNewMedicalRecordChange}
                            />
                            <TextField
                                margin="dense"
                                name="diagnosis"
                                label="Diagnosis"
                                type="text"
                                fullWidth
                                value={newMedicalRecord.diagnosis}
                                onChange={handleNewMedicalRecordChange}
                            />
                            <TextField
                                margin="dense"
                                name="treatment"
                                label="Treatment"
                                type="text"
                                fullWidth
                                value={newMedicalRecord.treatment}
                                onChange={handleNewMedicalRecordChange}
                            />
                            <TextField
                                margin="dense"
                                name="test_urine"
                                label="Urine Test"
                                type="text"
                                fullWidth
                                value={newMedicalRecord.test_urine}
                                onChange={handleNewMedicalRecordChange}
                            />
                            <TextField
                                margin="dense"
                                name="test_blood"
                                label="Blood Test"
                                type="text"
                                fullWidth
                                value={newMedicalRecord.test_blood}
                                onChange={handleNewMedicalRecordChange}
                            />
                            <TextField
                                margin="dense"
                                name="x_ray"
                                label="X-Ray"
                                type="text"
                                fullWidth
                                value={newMedicalRecord.x_ray}
                                onChange={handleNewMedicalRecordChange}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleAddMedicalRecordClose} color="primary">
                                Cancel
                            </Button>
                            <Button onClick={handleAddMedicalRecordSubmit} color="primary">
                                Add
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Box>
            </Box>
        </ThemeProvider>
    );
};

export default DoctorDashboard;
