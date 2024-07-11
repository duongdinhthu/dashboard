import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home';
import LoginAdmin from './components/admins/LoginAdmin';
import AdminDashboard from './components/admins/AdminDashboard';
import LoginDoctor from './components/doctors/LoginDoctor'; // Sử dụng LoginDoctor đúng
import DoctorDashboard from './components/doctors/DoctorDashboard';
import LoginStaff from './components/staffs/LoginStaff'; // Sử dụng LoginStaff đúng
import StaffDashboard from './components/staffs/StaffDashboard';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/adminlogin" element={<LoginAdmin />} />
                <Route path="/admindashboard" element={<AdminDashboard />} />
                <Route path="/doctorlogin" element={<LoginDoctor />} />
                <Route path="/doctordashboard" element={<DoctorDashboard />} />
                <Route path="/stafflogin" element={<LoginStaff />} />
                <Route path="/staffdashboard" element={<StaffDashboard />} />
            </Routes>
        </Router>
    );
};

export default App;
