import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './LoginStaff.css'; // Import file CSS

const LoginStaff = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/api/v1/staffs/loginStaff', { username, password });
            if (response.status === 200 && response.data.staff_type === 'staff') {
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('role', 'staff');
                localStorage.setItem('staffId', response.data.staff_id); // Lưu staff_id vào localStorage
                navigate('/staffdashboard'); // Chuyển hướng đến staff dashboard sau khi đăng nhập thành công
            } else {
                setError('Bạn không có quyền truy cập.');
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setError('Tên đăng nhập hoặc mật khẩu không đúng.');
            } else if (error.response && error.response.status === 403) {
                setError('Bạn không có quyền truy cập.');
            } else {
                setError('Đã xảy ra lỗi, vui lòng thử lại sau.');
            }
        }
    };

    return (
        <div className="login-container">
            <div className="login-form">
                <h2>Đăng nhập Nhân viên</h2>
                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label>Tên đăng nhập:</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Mật khẩu:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    <button type="submit" className="login-button">Đăng nhập</button>
                </form>
            </div>
        </div>
    );
};

export default LoginStaff;
