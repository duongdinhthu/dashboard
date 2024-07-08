import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/admins/Login';
import AdminDashboard from './components/admins/AdminDashboard';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/admindashboard" element={<AdminDashboard />} />
                <Route path="/" element={<Login />} />
            </Routes>
        </Router>
    );
};

export default App;
