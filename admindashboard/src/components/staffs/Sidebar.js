import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
    const navigate = useNavigate();

    const handleOpenPendingAppointments = () => {
        navigate('/staffdashboard?status=Pending');
    };

    const handleOpenConfirmedAppointments = () => {
        navigate('/staffdashboard?status=Confirmed');
    };

    const handleOpenCompletedAppointments = () => {
        navigate('/staffdashboard?status=Completed');
    };

    const handleOpenCancelledAppointments = () => {
        navigate('/staffdashboard?status=Cancelled');
    };

    const handleOpenInbox = () => {
        // Implement inbox functionality
        navigate('/inbox'); // Assuming there is a route for inbox
    };

    return (
        <div className="sidebar-staff">
            <button onClick={handleOpenPendingAppointments}><img width="30" height="30"
                                                                 src="https://img.icons8.com/ios/50/ffffff/clock--v1.png"
                                                                 alt="clock--v1"/>
                Pending Appointments
            </button>
            <button onClick={handleOpenConfirmedAppointments}><img width="30" height="30" src="https://img.icons8.com/ios/100/ffffff/approval--v1.png" alt="approval--v1"/>Confirmed
                Appointments
            </button>
            <button onClick={handleOpenCompletedAppointments}><img width="30" height="30" src="https://img.icons8.com/ios-glyphs/30/ffffff/task-completed.png" alt="task-completed"/>Completed
                Appointments
            </button>
            <button onClick={handleOpenCancelledAppointments}><img width="30" height="30" src="https://img.icons8.com/material-outlined/24/ffffff/calendar-delete.png" alt="calendar-delete"/>Cancelled
                Appointments
            </button>
            <button onClick={handleOpenInbox}><img width="30" height="30" src="https://img.icons8.com/ios/50/ffffff/inbox.png" alt="inbox"/>Inbox
            </button>
        </div>
    );
};

export default Sidebar;
