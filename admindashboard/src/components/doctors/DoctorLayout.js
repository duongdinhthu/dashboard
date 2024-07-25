import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import './DoctorLayout.css';

const DoctorLayout = ({ children, onShowTodayAppointments, onShowMonthAppointments, onShowMedicalRecords }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('role');
        localStorage.removeItem('doctor_id');
        navigate('/doctorlogin');
    };

    return (
        <div className="doctor-layout">
            <header className="app-bar">
                <div className="toolbar">
                    <h1 className="app-bar-title">Doctor Dashboard</h1>
                    <button className="logout-btn" onClick={handleLogout}>Logout</button>
                </div>
            </header>
            <div className="main-content">
                <Sidebar
                    onShowTodayAppointments={onShowTodayAppointments}
                    onShowMonthAppointments={onShowMonthAppointments}
                    onShowMedicalRecords={onShowMedicalRecords}
                />
                <main className="content">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DoctorLayout;
