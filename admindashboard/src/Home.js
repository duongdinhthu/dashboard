import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const [userType, setUserType] = useState('');
    const navigate = useNavigate();

    const handleSelection = (e) => {
        setUserType(e.target.value);
    };

    const handleLogin = () => {
        if (!userType) {
            alert('Please select a user type');
            return;
        }
        switch (userType) {
            case 'admin':
                navigate('/adminlogin');
                break;
            case 'doctor':
                navigate('/doctorlogin');
                break;
            case 'staff':
                navigate('/stafflogin');
                break;
            default:
                break;
        }
    };

    return (
        <div>
            <h1>Select User Type</h1>
            <select value={userType} onChange={handleSelection}>
                <option value="">Select...</option>
                <option value="admin">Admin</option>
                <option value="doctor">Doctor</option>
                <option value="staff">Staff</option>
            </select>
            <button onClick={handleLogin}>Login</button>
        </div>
    );
};

export default Home;
