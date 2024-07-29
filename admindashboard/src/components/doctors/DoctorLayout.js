import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import './DoctorLayout.css';

const DoctorLayout = ({ children, onShowTodayAppointments, onShowMonthAppointments, onShowMedicalRecords }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('role');
        localStorage.removeItem('doctorId');
        navigate('/doctorlogin');
    };

    return (
        <div className="doctor-layout">
            <header className="app-bar-doctor">
                <div className="toolbar-doctor">
                    <h1 className="app-bar-title">Doctor Dashboard</h1>
                    <button onClick={handleLogout} >
                        Logout
                        <img
                            width="20"
                            height="20"
                            src="https://img.icons8.com/ios/50/FFFFFF/exit--v1.png"
                            alt="exit--v1"
                        />
                    </button>
                </div>
            </header>
            <div className="main-content-doctor">
                <Sidebar
                    onShowTodayAppointments={onShowTodayAppointments}
                    onShowMonthAppointments={onShowMonthAppointments}
                    onShowMedicalRecords={onShowMedicalRecords}
                />
                <div className="content-doctor-layout">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default DoctorLayout;
