import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home';
import LoginAdmin from './components/admins/LoginAdmin';
import AdminDashboard from './components/admins/AdminDashboard';
import LoginDoctor from './components/doctors/LoginDoctor';
import DoctorDashboard from './components/doctors/DoctorDashboard';
import LoginStaff from './components/staffs/LoginStaff';
import StaffDashboard from './components/staffs/StaffDashboard';
import PrivateRoute from './PrivateRoute';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/adminlogin" element={<LoginAdmin />} />
                <Route path="/admindashboard" element={<PrivateRoute role="admin"><AdminDashboard /></PrivateRoute>} />
                <Route path="/doctorlogin" element={<LoginDoctor />} />
                <Route path="/doctordashboard" element={<PrivateRoute role="doctor"><DoctorDashboard /></PrivateRoute>} />
                <Route path="/stafflogin" element={<LoginStaff />} />
                <Route path="/staffdashboard" element={<PrivateRoute role="staff"><StaffDashboard /></PrivateRoute>} />
            </Routes>
        </Router>
    );
};

export default App;
