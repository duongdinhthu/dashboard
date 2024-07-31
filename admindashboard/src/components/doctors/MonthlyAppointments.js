import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from './Sidebar'; // Import Sidebar
import './MonthlyAppointments.css';

const MonthlyAppointments = () => {
    const [monthAppointments, setMonthAppointments] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    const navigate = useNavigate(); // Define navigate

    useEffect(() => {
        const storedDoctorId = localStorage.getItem('doctor_id');
        if (storedDoctorId) {
            const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
            const lastDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split('T')[0];
            axios.get('http://localhost:8080/api/v1/appointments/search', {
                params: {
                    start_date: firstDayOfMonth,
                    end_date: lastDayOfMonth,
                    doctor_id: storedDoctorId
                }
            })
                .then(response => {
                    setMonthAppointments(response.data);
                })
                .catch(error => {
                    console.error('Lỗi khi lấy lịch khám trong tháng', error);
                });
        }
    }, []);

    const filteredMonthAppointments = monthAppointments.filter(appointment =>
        appointment.patient?.[0]?.patient_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="monthly-appointments">
            <Sidebar
                onShowTodayAppointments={() => navigate('/todayappointments')}
                onShowMonthAppointments={() => navigate('/monthlyappointments')}
                onShowMedicalRecords={() => navigate('/medicalrecords')}
            />
            <div className="content">
                <input
                    type="text"
                    placeholder="Search Patient Name"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-bar"
                />
                <h3>Monthly Appointments Schedule</h3>
                <ul className="appointments-list">
                    {filteredMonthAppointments.map((appointment, index) => (
                        <li key={index}>
                            <p>Patient: {appointment.patient?.[0]?.patient_name || 'N/A'}</p>
                            <p>Date: {new Date(appointment.medical_day).toLocaleDateString()}</p>
                            <p>Time: {appointment.slot}</p>
                            <p>Status: {appointment.status}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default MonthlyAppointments;
