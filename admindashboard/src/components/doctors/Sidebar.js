import React from 'react';
import './Sidebar.css';
import DoctorDashboard from "./DoctorDashboard";

const Sidebar = ({ onShowTodayAppointments, onShowMonthAppointments, onShowMedicalRecords }) => {
    return (
        <div className="sidebar-doctor">
            <div className="sidebar-item" onClick={onShowTodayAppointments}>
                <span className="sidebar-icon">📅</span>
                <span className="sidebar-text">Lịch khám hôm nay</span>
            </div>
            <div className="sidebar-item" onClick={onShowMonthAppointments}>
                <span className="sidebar-icon">📅</span>
                <span className="sidebar-text">Lịch khám trong tháng</span>
            </div>
            <div className="sidebar-item" onClick={onShowMedicalRecords}>
                <span className="sidebar-icon">📋</span>
                <span className="sidebar-text">Bệnh án</span>
            </div>
        </div>
    );
};

export default Sidebar;
