import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AppointmentsChart from "./AppointmentsChart";
import FeedbackListWithReply from './FeedbackListWithReply';
import Sidebar from './Sidebar';
import './AdminDashboard.css'; // Import the CSS file

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        doctors: 0,
        patients: 0,
        appointments: 0,
        staff: 0,
    });
    const [todayAppointments, setTodayAppointments] = useState([]);
    const [appointmentsRange, setAppointmentsRange] = useState([]);
    const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
    const [showTodayAppointments, setShowTodayAppointments] = useState(false);
    const [feedbacks, setFeedbacks] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        const role = localStorage.getItem('role');

        if (!isLoggedIn || role !== 'admin') {
            navigate('/adminlogin');
            return;
        }

        fetchStats();
        fetchTodayAppointments();
        fetchAppointmentsRange();
        fetchFeedbacks();
    }, [navigate]);

    const fetchStats = async () => {
        try {
            const [doctorsRes, patientsRes, appointmentsRes, staffRes] = await Promise.all([
                axios.get('http://localhost:8080/api/v1/doctors/list'),
                axios.get('http://localhost:8080/api/v1/patients/list'),
                axios.get('http://localhost:8080/api/v1/appointments/list'),
                axios.get('http://localhost:8080/api/v1/staffs/list')
            ]);

            setStats({
                doctors: doctorsRes.data.length,
                patients: patientsRes.data.length,
                appointments: appointmentsRes.data.length,
                staff: staffRes.data.length,
            });
        } catch (error) {
            console.error('Error fetching statistics', error);
            setError('Error fetching statistics');
        }
    };

    const fetchTodayAppointments = async () => {
        try {
            const today = new Date().toISOString().split('T')[0];
            const params = { appointment_date: today };
            const response = await axios.get('http://localhost:8080/api/v1/appointments/search', { params });
            setTodayAppointments(response.data);
        } catch (error) {
            console.error('Error fetching today\'s appointments', error);
            setError('Error fetching today\'s appointments');
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
            setError('Error fetching feedbacks');
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
        <div className="admin-dashboard">
            <Sidebar
                onInboxClick={handleOpenFeedbackModal}
                handleOpenDoctorsPage={handleOpenDoctorsPage}
                handleOpenPatientsPage={handleOpenPatientsPage}
                handleOpenAppointmentsPage={handleOpenAppointmentsPage}
                handleOpenStaffPage={handleOpenStaffPage}
            />
            <div className="main-content">
                <div className="topbar">
                    <div className="search">
                        {/*<input type="text" placeholder="Search..." />*/}
                    </div>
                    <div className="profile">
                        {/*<img src="profile.jpg" alt="Profile" />*/}
                        <span>Admin</span>
                        <button onClick={handleLogout}>Logout <img width="20" height="20"
                                                                   src="https://img.icons8.com/ios/50/FFFFFF/exit--v1.png"
                                                                   alt="exit--v1"/></button>
                    </div>
                </div>
                <div className="content">
                <h2>Dashboard</h2>
                    {/*{error && <div className="error">{error}</div>}*/}

                    <div className="stats">
                        <div className="card" onClick={handleOpenDoctorsPage}>
                            <h3>{stats.doctors}</h3>
                            <p>Doctors</p>
                        </div>
                        <div className="card" onClick={handleOpenPatientsPage}>
                            <h3>{stats.patients}</h3>
                            <p>Patients</p>
                        </div>
                        <div className="card" onClick={handleOpenAppointmentsPage}>
                            <h3>{stats.appointments}</h3>
                            <p>Appointments</p>
                        </div>
                        <div className="card" onClick={handleOpenStaffPage}>
                            <h3>{stats.staff}</h3>
                            <p>Staff</p>
                        </div>
                    </div>

                    <div className="charts">
                        <div className="chart">
                            <h2>Appointment Statistics</h2>
                            <AppointmentsChart appointments={appointmentsRange} />
                        </div>
                        <div className="chart">
                            <h2>Today's Appointments</h2>
                            <button onClick={handleShowTodayAppointments}>
                                {showTodayAppointments ? "Hide Today's Appointments" : "Show Today's Appointments"}
                            </button>
                            {showTodayAppointments && (
                                <table className="table">
                                    <thead>
                                    <tr>
                                        <th>Time</th>
                                        <th>Patient</th>
                                        <th>Doctor</th>
                                        <th>Status</th>
                                        <th>Price</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {todayAppointments.length > 0 ? (
                                        todayAppointments.map((appointment, index) => (
                                            <tr key={index}>
                                                <td>{`${convertSlotToTime(appointment.slot)} - ${formatDate(appointment.medical_day)}`}</td>
                                                <td>{appointment.patient[0]?.patient_name || "N/A"}</td>
                                                <td>{appointment.doctor[0]?.doctor_name || "N/A"}</td>
                                                <td>{appointment.status}</td>
                                                <td>{appointment.price}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} align="center">No appointments today</td>
                                        </tr>
                                    )}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
                {isFeedbackModalOpen && (
                    <div className="feedback-modal">
                        <FeedbackListWithReply onClose={handleCloseFeedbackModal} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
