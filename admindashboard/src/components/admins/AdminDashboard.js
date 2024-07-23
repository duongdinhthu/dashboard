import React, { useState, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell, Card, CardContent,
    TableBody,
    Paper,
    Typography,
    Grid,
    Button,
    Box,
    AppBar,
    Toolbar,
    Container,
    CssBaseline,
    Modal,
} from '@mui/material';
import { AccountCircle, Group, LocalHospital } from '@mui/icons-material';
import axios from 'axios';
import AppointmentsChart from "./AppointmentsChart";
import Sidebar from './Sidebar';
import StatisticsCard from './StatisticsCard';
import FeedbackListWithReply from './FeedbackListWithReply';
import { useNavigate } from 'react-router-dom';

const lightTheme = createTheme({
    palette: {
        mode: 'light',
    },
});

const AdminDashboard = () => {
    const [searchResults, setSearchResults] = useState([]);
    const [error, setError] = useState('');
    const [appointments, setAppointments] = useState([]);
    const [todayAppointments, setTodayAppointments] = useState([]);
    const [showTodayAppointments, setShowTodayAppointments] = useState(false);
    const [appointmentsRange, setAppointmentsRange] = useState([]);
    const [feedbacks, setFeedbacks] = useState([]);
    const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
    const [stats, setStats] = useState({
        doctors: 0,
        patients: 0,
        appointments: 0,
        staff: 0,
    });
    const navigate = useNavigate();

    useEffect(() => {
        fetchTodayAppointments();
        fetchAppointmentsRange();
        fetchStats();
        fetchFeedbacks();
    }, []);

    const fetchStats = async () => {
        try {
            const [doctorsRes, patientsRes, appointmentsRes, staffRes] = await Promise.all([
                axios.get('http://localhost:8080/api/v1/doctors/list'),
                axios.get('http://localhost:8080/api/v1/patients/list'),
                axios.get('http://localhost:8080/api/v1/appointments/list'),
                axios.get('http://localhost:8080/api/v1/staffs/list')
            ]);

            console.log('Doctors Data:', doctorsRes.data);
            console.log('Patients Data:', patientsRes.data);
            console.log('Appointments Data:', appointmentsRes.data);
            console.log('Staff Data:', staffRes.data);

            setStats({
                doctors: doctorsRes.data.length,
                patients: patientsRes.data.length,
                appointments: appointmentsRes.data.length,
                staff: staffRes.data.length,
            });
        } catch (error) {
            console.error('Error fetching statistics', error);
        }
    };

    const fetchTodayAppointments = async () => {
        try {
            const today = new Date().toISOString().split('T')[0];
            const params = { appointment_date: today };
            const response = await axios.get('http://localhost:8080/api/v1/appointments/search', { params });
            console.log('Data received from backend:', response.data);
            setTodayAppointments(response.data);
        } catch (error) {
            console.error('Lỗi khi lấy cuộc hẹn hôm nay', error);
            setError('Lỗi khi lấy cuộc hẹn hôm nay');
        }
    };

    const fetchAppointmentsRange = async () => {
        try {
            const today = new Date();
            const tenDaysAgo = new Date();
            tenDaysAgo.setDate(today.getDate() - 10);
            const threeDaysLater = new Date();
            threeDaysLater.setDate(today.getDate() + 3);

            const response = await axios.get('http://localhost:8080/api/v1/appointments/list');
            const allAppointments = response.data;

            const filteredAppointments = allAppointments.filter(appointment => {
                const medicalDay = new Date(appointment.medical_day);
                return medicalDay >= tenDaysAgo && medicalDay <= threeDaysLater;
            });

            console.log('Filtered Data:', filteredAppointments);
            setAppointmentsRange(filteredAppointments);
        } catch (error) {
            console.error('Error fetching appointments range', error);
            setError('Error fetching appointments range');
        }
    };

    const fetchFeedbacks = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/v1/feedbacks/list');
            setFeedbacks(response.data);
        } catch (error) {
            console.error('Error fetching feedbacks', error);
        }
    };

    const handleOpenFeedbackModal = () => {
        setIsFeedbackModalOpen(true);
    };

    const handleCloseFeedbackModal = () => {
        setIsFeedbackModalOpen(false);
    };

    const handleShowTodayAppointments = () => {
        setShowTodayAppointments(!showTodayAppointments);
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

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

    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('role');
        localStorage.removeItem('adminId');
        navigate('/adminlogin');
    };

    const handleOpenDoctorsPage = () => {
        navigate('/doctors');
    };

    const handleOpenPatientsPage = () => {
        navigate('/patients');
    };

    const handleOpenAppointmentsPage = () => {
        navigate('/appointments');
    };

    const handleOpenStaffPage = () => {
        navigate('/staff');
    };

    return (
        <ThemeProvider theme={lightTheme}>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                    <Toolbar>
                        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                            Admin Dashboard
                        </Typography>
                        <Button color="inherit" onClick={handleLogout}>
                            Logout
                        </Button>
                    </Toolbar>
                </AppBar>
                <Sidebar onInboxClick={handleOpenFeedbackModal} />
                <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3, mt: 2 }}>
                    <Toolbar />
                    <Container>
                        {error && <Typography color="error">{error}</Typography>}

                        <Grid container spacing={2} sx={{ mb: 4 }}>
                            <StatisticsCard
                                title="Total Doctors"
                                value={stats.doctors}
                                increase="5% increase in 30 days"
                                icon={<LocalHospital />}
                                onClick={handleOpenDoctorsPage}
                            />
                            <StatisticsCard
                                title="Total Patients"
                                value={stats.patients}
                                increase="10% increase in 30 days"
                                icon={<Group />}
                                onClick={handleOpenPatientsPage}
                            />
                            <StatisticsCard
                                title="Total Appointments"
                                value={stats.appointments}
                                increase="15% increase in 30 days"
                                icon={<AccountCircle />}
                                onClick={handleOpenAppointmentsPage}
                            />
                            <StatisticsCard
                                title="Total Staff"
                                value={stats.staff}
                                increase="8% increase in 30 days"
                                icon={<Group />}
                                onClick={handleOpenStaffPage}
                            />
                        </Grid>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Box sx={{ width: '50%' }}>
                                <Typography variant="h6" gutterBottom>
                                    Appointment Statistics
                                </Typography>
                                <AppointmentsChart appointments={appointmentsRange} />
                            </Box>

                            <Box sx={{ width: '45%' }}>
                                <Typography variant="h6" gutterBottom>
                                    Today's Appointments
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <Button variant="contained" color="primary" onClick={handleShowTodayAppointments} fullWidth>
                                            {showTodayAppointments ? "Hide Today's Appointments" : "Show Today's Appointments"}
                                        </Button>
                                    </Grid>
                                    {showTodayAppointments && (
                                        <Grid item xs={12}>
                                            <TableContainer component={Paper}>
                                                <Table>
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell>Time</TableCell>
                                                            <TableCell>Patient</TableCell>
                                                            <TableCell>Doctor</TableCell>
                                                            <TableCell>Status</TableCell>
                                                            <TableCell>Price</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {todayAppointments.length > 0 ? (
                                                            todayAppointments.map((appointment, index) => (
                                                                <TableRow key={index}>
                                                                    <TableCell>{`${convertSlotToTime(appointment.slot)} - ${formatDate(appointment.medical_day)}`}</TableCell>
                                                                    <TableCell>{appointment.patient[0]?.patient_name || "N/A"}</TableCell>
                                                                    <TableCell>{appointment.doctor[0]?.doctor_name || "N/A"}</TableCell>
                                                                    <TableCell>{appointment.status}</TableCell>
                                                                    <TableCell>{appointment.price}</TableCell>
                                                                </TableRow>
                                                            ))
                                                        ) : (
                                                            <TableRow>
                                                                <TableCell colSpan={5} align="center">No appointments today</TableCell>
                                                            </TableRow>
                                                        )}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        </Grid>
                                    )}
                                </Grid>
                                <Grid container spacing={2} sx={{ mt: 2 }}>
                                    <Grid item xs={12}>
                                        <Card>
                                            <CardContent>
                                                <Typography variant="h6">
                                                    Total Appointments
                                                </Typography>
                                                <Typography variant="h4">
                                                    {appointmentsRange.length}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Card>
                                            <CardContent>
                                                <Typography variant="h6">
                                                    Appointments in Next 3 Days
                                                </Typography>
                                                <Typography variant="h4">
                                                    {appointmentsRange.filter(appointment => {
                                                        const medicalDay = new Date(appointment.medical_day);
                                                        return medicalDay > new Date();
                                                    }).length}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Box>
                    </Container>
                </Box>
                <Modal
                    open={isFeedbackModalOpen}
                    onClose={handleCloseFeedbackModal}
                    aria-labelledby="modal-title"
                    aria-describedby="modal-description"
                    sx={{ overflowY: 'auto' }}
                >
                    <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '80%',
                        maxHeight: '80%',
                        bgcolor: 'background.paper',
                        border: '2px solid #000',
                        boxShadow: 24,
                        p: 4,
                        overflowY: 'auto',
                    }}>
                        <FeedbackListWithReply onClose={handleCloseFeedbackModal} />
                    </Box>
                </Modal>
            </Box>
        </ThemeProvider>
    );
};

export default AdminDashboard;
