import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
    const navigate = useNavigate();

    const handleNavigation = (status) => {
        navigate(`/staffdashboard?status=${status}`);
    };

    return (
        <div className="sidebar-staff">
            <button onClick={() => handleNavigation('Pending')}>
                <img width="30" height="30" src="https://img.icons8.com/ios/50/ffffff/clock--v1.png" alt="clock--v1"/>
                Pending Appointments
            </button>
            <button onClick={() => handleNavigation('Confirmed')}>
                <img width="30" height="30" src="https://img.icons8.com/ios/100/ffffff/approval--v1.png" alt="approval--v1"/>
                Confirmed Appointments
            </button>
            <button onClick={() => handleNavigation('Completed')}>
                <img width="30" height="30" src="https://img.icons8.com/ios-glyphs/30/ffffff/task-completed.png" alt="task-completed"/>
                Completed Appointments
            </button>
            <button onClick={() => handleNavigation('Cancelled')}>
                <img width="30" height="30" src="https://img.icons8.com/material-outlined/24/ffffff/calendar-delete.png" alt="calendar-delete"/>
                Cancelled Appointments
            </button>

        </div>
    );
};

export default Sidebar;
