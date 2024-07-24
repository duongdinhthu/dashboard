// src/components/admins/Sidebar.js

import React from 'react';
import './Sidebar.css'; // Import CSS for Sidebar

const Sidebar = ({
                     onInboxClick,
                     handleOpenDoctorsPage,
                     handleOpenPatientsPage,
                     handleOpenAppointmentsPage,
                     handleOpenStaffPage
                 }) => {
    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <h2>Admin Dashboard</h2>
            </div>
            <div className="sidebar-menu">
                <ul>
                    <li onClick={handleOpenDoctorsPage}>
                        <span className="icon">🏥</span>
                        <span className="text">Total Doctors</span>
                    </li>
                    <li onClick={handleOpenPatientsPage}>
                        <span className="icon">👥</span>
                        <span className="text">Total Patients</span>
                    </li>
                    <li onClick={handleOpenAppointmentsPage}>
                        <span className="icon">📅</span>
                        <span className="text">Total Appointments</span>
                    </li>
                    <li onClick={handleOpenStaffPage}>
                        <span className="icon">👥</span>
                        <span className="text">Total Staff</span>
                    </li>
                    <li onClick={onInboxClick}>
                        <span className="icon">📥</span>
                        <span className="text">Hộp thư đến</span>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Sidebar;
