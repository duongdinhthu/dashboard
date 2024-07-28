import React, { useState, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AppBar, Toolbar, Typography, Container, Box, List, ListItem, ListItemText, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Card, CardContent, Grid, Select, MenuItem } from '@mui/material';
import axios from 'axios';
import Sidebar from './Sidebar';

const lightTheme = createTheme({
    palette: {
        mode: 'light',
    },
});

const DoctorDashboard = () => {
    const [doctor, setDoctor] = useState(null);
    const [todayAppointments, setTodayAppointments] = useState([]);
    const [monthAppointments, setMonthAppointments] = useState([]);
    const [medicalRecords, setMedicalRecords] = useState([]);
    const [error, setError] = useState('');
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [newStatus, setNewStatus] = useState('');
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openMedicalRecordsDialog, setOpenMedicalRecordsDialog] = useState(false);
    const [openAddMedicalRecordDialog, setOpenAddMedicalRecordDialog] = useState(false);
    const [patientMedicalRecords, setPatientMedicalRecords] = useState([]);
    const [showTodayAppointments, setShowTodayAppointments] = useState(false);
    const [showMonthAppointments, setShowMonthAppointments] = useState(false);
    const [showMedicalRecords, setShowMedicalRecords] = useState(false);
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
                    console.error('Lỗi khi lấy thông tin bác sĩ', error);
                    setError('Lỗi khi lấy thông tin bác sĩ');
                });

            const today = new Date().toISOString().split('T')[0];
            axios.get('http://localhost:8080/api/v1/appointments/search', {
                params: {
                    medical_day: today,
                    doctor_id: storedDoctorId
                }
            })
                .then(response => {
                    setTodayAppointments(response.data);
                })
                .catch(error => {
                    console.error('Lỗi khi lấy lịch khám hôm nay', error);
                    setError('Lỗi khi lấy lịch khám hôm nay');
                });

            const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
            const lastDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split('T')[0];
            axios.get('http://localhost:8080/api/v1/appointments/search', {
                params: {
                    start_date: firstDayOfMonth,
                    end_date: lastDayOfMonth,
                    doctor_id: storedDoctorId
                }
            })
                .then(response => {
                    setMonthAppointments(response.data);
                })
                .catch(error => {
                    console.error('Lỗi khi lấy lịch khám trong tháng', error);
                    setError('Lỗi khi lấy lịch khám trong tháng');
                });

            axios.get(`http://localhost:8080/api/v1/medicalrecords/doctor/${storedDoctorId}`)
                .then(response => {
                    setMedicalRecords(response.data);
                })
                .catch(error => {
                    console.error('Lỗi khi lấy bệnh án', error);
                    setError('Lỗi khi lấy bệnh án');
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
                console.log('Cập nhật trạng thái thành công:', response.data);
                setNewStatus('');
                setSelectedAppointment(null);
                const today = new Date().toISOString().split('T')[0];
                axios.get('http://localhost:8080/api/v1/appointments/search', {
                    params: {
                        medical_day: today,
                        doctor_id: doctor.doctor_id
                    }
                })
                    .then(response => {
                        setTodayAppointments(response.data);
                    })
                    .catch(error => {
                        console.error('Lỗi khi lấy lịch khám hôm nay', error);
                        setError('Lỗi khi lấy lịch khám hôm nay');
                    });
            })
            .catch(error => {
                console.error('Lỗi khi cập nhật trạng thái', error);
                setError('Lỗi khi cập nhật trạng thái');
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
            setError('Mật khẩu mới không khớp');
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
                console.log('Cập nhật thông tin bác sĩ thành công:', response.data);
                setDoctor((prevDoctor) => ({
                    ...prevDoctor,
                    doctor_email: editData.doctor_email,
                    doctor_address: editData.doctor_address,
                }));
                setOpenEditDialog(false);
            })
            .catch(error => {
                console.error('Lỗi khi cập nhật thông tin bác sĩ', error);
                setError('Lỗi khi cập nhật thông tin bác sĩ');
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
                console.error('Lỗi khi lấy bệnh án', error);
                setError('Lỗi khi lấy bệnh án');
            });
    };

    const handleAddMedicalRecordOpen = (appointment) => {
        setSelectedAppointment(appointment);
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
        if (!selectedAppointment) {
            setError('No appointment selected');
            return;
        }

        const medicalRecordData = {
            ...newMedicalRecord,
            patient_id: selectedAppointment.patient_id,
            doctor_id: doctor.doctor_id,
            follow_up_date: new Date().toISOString().split('T')[0],
        };

        axios.post('http://localhost:8080/api/v1/medicalrecords/insert', medicalRecordData)
            .then(response => {
                console.log('Thêm bệnh án thành công:', response.data);
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
                console.error('Lỗi khi thêm bệnh án', error);
                setError('Lỗi khi thêm bệnh án');
            });
    };

    const handleCloseMedicalRecordsDialog = () => {
        setOpenMedicalRecordsDialog(false);
    };

    const handleToggleTodayAppointments = () => {
        setShowTodayAppointments(!showTodayAppointments);
    };

    const handleToggleMonthAppointments = () => {
        setShowMonthAppointments(!showMonthAppointments);
    };

    const handleToggleMedicalRecords = () => {
        setShowMedicalRecords(!showMedicalRecords);
    };

    return (
        <ThemeProvider theme={lightTheme}>
            <Box sx={{ display: 'flex' }}>
                <Sidebar
                    onShowTodayAppointments={handleToggleTodayAppointments}
                    onShowMonthAppointments={handleToggleMonthAppointments}
                    onShowMedicalRecords={handleToggleMedicalRecords}
                />
                <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}>
                    <Container sx={{height:'100vh'}}>
                        {error && <Typography color="error">{error}</Typography>}
                        {doctor && (
                            <Box>
                                <Typography variant="h6" sx={{color:' #004B91'}}>Welcome, Dr. {doctor.doctor_name}</Typography>
                                <Typography variant="body1">Email: {doctor.doctor_email}</Typography>
                                    <Typography variant="body1">Address: {doctor.doctor_address}</Typography>
                                <Typography variant="body1">Working status: {doctor.working_status}</Typography>
                                <Button color="inherit" onClick={handleEditOpen} sx={{marginBottom:'20px', bgcolor:' #1976d2', color:'#fff',  '&:hover':{
                                    color:'#000'
                                    },}}>
                                    Edit Profile
                                </Button>
                            </Box>
                        )}
                        <Grid container spacing={2} sx={{ mb: 4 }}>
                            <Grid item xs={12} md={4}>
                                <Card >
                                    <CardContent sx={{textAlign:'center'}}>
                                        <Typography variant="h6">
                                            Today's appointment schedule
                                        </Typography>
                                        <Typography variant="h4">
                                            {todayAppointments.length}
                                        </Typography>
                                        <Button variant="contained" color="primary" onClick={handleToggleTodayAppointments} fullWidth>
                                            {showTodayAppointments ? "Hide today's appointment" : "View today's appointments"}
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Card>
                                    <CardContent  sx={{textAlign:'center'}}>
                                        <Typography variant="h6">
                                            Monthly appointments
                                        </Typography>
                                        <Typography variant="h4">
                                            {monthAppointments.length}
                                        </Typography>
                                        <Button variant="contained" color="primary" onClick={handleToggleMonthAppointments} fullWidth>
                                            {showMonthAppointments ? "Hide monthly appointment" : "View monthly appointments"}
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Card>
                                    <CardContent  sx={{textAlign:'center'}}>
                                        <Typography variant="h6">
                                            Patient
                                        </Typography>
                                        <Typography variant="h4">
                                            {medicalRecords.length}
                                        </Typography>
                                        <Button variant="contained" color="primary" onClick={handleToggleMedicalRecords} fullWidth>
                                            {showMedicalRecords ? "Hide medical record" : "View medical record"}
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                        {showTodayAppointments && (
                            <>
                                <Typography variant="h6" gutterBottom sx={{color:'#1565c0'}}>
                                    Today's appointment schedule
                                </Typography>
                                <List>
                                    {todayAppointments.map((appointment, index) => (
                                        <ListItem key={index}>
                                            <ListItemText
                                                primary={`Patient: ${appointment.patient?.[0]?.patient_name || 'N/A'}`}
                                                secondary={`Day of the examination: ${new Date(appointment.medical_day).toLocaleDateString()} - Thời gian: ${getTimeFromSlot(appointment.slot)} - Trạng thái: ${appointment.status}`}
                                            />
                                            <Select
                                                value={newStatus}
                                                onChange={(e) => setNewStatus(e.target.value)}
                                                displayEmpty
                                                inputProps={{ 'aria-label': 'Without label' }}
                                            >
                                                <MenuItem value="">
                                                    <em>None</em>
                                                </MenuItem>
                                                <MenuItem value="Cancelled">Cancelled</MenuItem>
                                                <MenuItem value="Completed">Completed</MenuItem>
                                            </Select>
                                            <Button onClick={() => handleUpdateStatus(appointment.appointment_id)}>
                                                Update Status
                                            </Button>
                                            <Button onClick={() => handleShowMedicalRecords(appointment.patient?.[0]?.patient_id)}>
                                                Show medical records
                                            </Button>
                                            <Button onClick={() => handleAddMedicalRecordOpen(appointment)}>
                                                Add medical record
                                            </Button>
                                        </ListItem>
                                    ))}
                                </List>
                            </>
                        )}
                        {showMonthAppointments && (
                            <>
                                <Typography variant="h6" gutterBottom sx={{color:'#1565c0'}}>
                                    Monthly medical examination schedule
                                </Typography>
                                <List>
                                    {monthAppointments.map((appointment, index) => (
                                        <ListItem key={index}>
                                            <ListItemText
                                                primary={`Bệnh nhân: ${appointment.patient?.[0]?.patient_name || 'N/A'}`}
                                                secondary={`Ngày khám: ${new Date(appointment.medical_day).toLocaleDateString()} - Thời gian: ${getTimeFromSlot(appointment.slot)} - Trạng thái: ${appointment.status}`}
                                            />
                                            <Button onClick={() => handleShowMedicalRecords(appointment.patient?.[0]?.patient_id)}>
                                                Show medical records
                                            </Button>
                                            <Button onClick={() => handleAddMedicalRecordOpen(appointment)}>
                                                Add medical record
                                            </Button>
                                        </ListItem>
                                    ))}
                                </List>
                            </>
                        )}
                        {showMedicalRecords && (
                            <>
                                <Typography variant="h6" gutterBottom sx={{color:'#1565c0'}}>
                                    Patient
                                </Typography>
                                <List>
                                    {medicalRecords.map((record, index) => (
                                        <ListItem key={index}>
                                            <ListItemText
                                                primary={`Medical record ID: ${record.medicalrecord_id}`}
                                                secondary={`Symptom: ${record.symptoms}, Diagnose: ${record.diagnosis}`}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </>
                        )}
                    </Container>
                    <Dialog open={openEditDialog} onClose={handleEditClose}>
                        <DialogTitle>Edit personal information</DialogTitle>
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
                                label="current password"
                                type="password"
                                fullWidth
                                value={editData.current_password}
                                onChange={handleEditChange}
                            />
                            <TextField
                                margin="dense"
                                name="new_password"
                                label="new password"
                                type="password"
                                fullWidth
                                value={editData.new_password}
                                onChange={handleEditChange}
                            />
                            <TextField
                                margin="dense"
                                name="confirm_new_password"
                                label="Confirm new password"
                                type="password"
                                fullWidth
                                value={editData.confirm_new_password}
                                onChange={handleEditChange}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleEditClose} color="primary">
                                Hủy bỏ
                            </Button>
                            <Button onClick={handleEditSubmit} color="primary">
                                Lưu
                            </Button>
                        </DialogActions>
                    </Dialog>
                    <Dialog open={openMedicalRecordsDialog} onClose={handleCloseMedicalRecordsDialog}>
                        <DialogTitle>Patient</DialogTitle>
                        <DialogContent>
                            <List>
                                {patientMedicalRecords.map((record, index) => (
                                    <ListItem key={index}>
                                        <ListItemText
                                            primary={`Medical record ID: ${record.medicalrecord_id}`}
                                            secondary={`Symptom: ${record.symptoms}, Diagnose: ${record.diagnosis}`}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseMedicalRecordsDialog} color="primary">
                                Đóng
                            </Button>
                        </DialogActions>
                    </Dialog>
                    <Dialog open={openAddMedicalRecordDialog} onClose={handleAddMedicalRecordClose}>
                        <DialogTitle>Add medical record</DialogTitle>
                        <DialogContent>
                            <TextField
                                margin="dense"
                                name="symptoms"
                                label=" Diagnose"
                                type="text"
                                fullWidth
                                value={newMedicalRecord.symptoms}
                                onChange={handleNewMedicalRecordChange}
                            />
                            <TextField
                                margin="dense"
                                name="diagnosis"
                                label=" Diagnose"
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
                                label="Urine test"
                                type="text"
                                fullWidth
                                value={newMedicalRecord.test_urine}
                                onChange={handleNewMedicalRecordChange}
                            />
                            <TextField
                                margin="dense"
                                name="test_blood"
                                label="Blood tests"
                                type="text"
                                fullWidth
                                value={newMedicalRecord.test_blood}
                                onChange={handleNewMedicalRecordChange}
                            />
                            <TextField
                                margin="dense"
                                name="x_ray"
                                label="X-ray"
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
                                More
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Box>
            </Box>
        </ThemeProvider>
    );
};

export default DoctorDashboard;
