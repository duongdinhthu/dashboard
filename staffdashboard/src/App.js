import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginStaff from './components/LoginStaff';
import StaffDashboard from './components/StaffDashboard';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginStaff />} /> {/* Route mặc định */}
                <Route path="/loginstaff" element={<LoginStaff />} />
                <Route path="/staffdashboard" element={<StaffDashboard />} />
                {/* Thêm các route khác nếu cần */}
            </Routes>
        </Router>
    );
};

export default App;
