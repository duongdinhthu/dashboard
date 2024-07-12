import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginDoctor = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/api/v1/doctors/login', { username, password });
            console.log('Response from server:', response.data); // Log response from server
            if (response.status === 200 && response.data.doctor_id) {
                localStorage.setItem('doctor_id', response.data.doctor_id); // Lưu doctor_id vào localStorage
                navigate('/doctordashboard'); // Chuyển hướng đến doctor dashboard sau khi đăng nhập thành công
            } else {
                setError('Bạn không có quyền truy cập.');
            }
        } catch (error) {
            console.log('Error response:', error); // Log error response
            if (error.response && error.response.status === 401) {
                setError('Tên đăng nhập hoặc mật khẩu không đúng.');
            } else {
                setError('Đã xảy ra lỗi, vui lòng thử lại sau.');
            }
        }
    };

    return (
        <div>
            <h2>Đăng nhập Bác sĩ</h2>
            <form onSubmit={handleLogin}>
                <div>
                    <label>Tên đăng nhập:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Mật khẩu:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit">Đăng nhập</button>
            </form>
        </div>
    );
};

export default LoginDoctor;
