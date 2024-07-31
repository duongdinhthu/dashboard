import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
    const navigate = useNavigate();

    const handleNavigation = (path) => {
        navigate(path);
    };

    return (
        <div className="sidebar-doctor">
            <div className="sidebar-item" onClick={() => handleNavigation('/doctordashboard')}>
                <span className="sidebar-icon">
                    <img width="30" height="30" src="https://img.icons8.com/ios/50/FFFFFF/control-panel--v2.png" alt="control-panel--v2" />
                </span>
                <span className="sidebar-text">Dashboard</span>
            </div>
            <div className="sidebar-item" onClick={() => handleNavigation('/todayappointments')}>
                <span className="sidebar-icon">
                    <img width="30" height="30" src="https://img.icons8.com/ios/50/FFFFFF/today.png" alt="today" />
                </span>
                <span className="sidebar-text">Today's Appointments</span>
            </div>
            <div className="sidebar-item" onClick={() => handleNavigation('/monthlyappointments')}>
                <span className="sidebar-icon">
                    <img width="30" height="30" src="https://img.icons8.com/ios/50/FFFFFF/overtime--v1.png" alt="overtime--v1" />
                </span>
                <span className="sidebar-text">Monthly Appointments</span>
            </div>
            <div className="sidebar-item" onClick={() => handleNavigation('/medicalrecords')}>
                <span className="sidebar-icon">
                    <img width="30" height="30" src="https://img.icons8.com/ios/50/FFFFFF/test-results.png" alt="test-results" />
                </span>
                <span className="sidebar-text">Medical Records</span>
            </div>
        </div>
    );
};

export default Sidebar;
