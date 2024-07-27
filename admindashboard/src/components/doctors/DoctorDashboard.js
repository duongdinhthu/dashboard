import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DoctorDashboard.css';
import Sidebar from './Sidebar';

const DoctorDashboard = () => {
    const [doctor, setDoctor] = useState(null);
    const [todayAppointments, setTodayAppointments] = useState([]);
    const [monthAppointments, setMonthAppointments] = useState([]);
    const [medicalRecords, setMedicalRecords] = useState([]);
    const [error, setError] = useState('');
    const [showTodayAppointments, setShowTodayAppointments] = useState(false);
    const [showMonthAppointments, setShowMonthAppointments] = useState(false);
    const [showMedicalRecords, setShowMedicalRecords] = useState(false);

    useEffect(() => {
        const storedDoctorId = localStorage.getItem('doctor_id');
        if (storedDoctorId) {
            axios.get(`http://localhost:8080/api/v1/doctors/${storedDoctorId}`)
                .then(response => {
                    setDoctor(response.data);
                })
                .catch(error => {
                    console.error('Lỗi khi lấy thông tin bác sĩ', error);
                    setError('Lỗi khi lấy thông tin bác sĩ');
                });

            // Lấy lịch khám hôm nay
            const today = new Date().toISOString().split('T')[0];
            axios.get('http://localhost:8080/api/v1/appointments/search', {
                params: {
                    medical_day: today,
                    doctor_id: storedDoctorId
                }
            })
                .then(response => {
                    setTodayAppointments(response.data);
                })
                .catch(error => {
                    console.error('Lỗi khi lấy lịch khám hôm nay', error);
                    setError('Lỗi khi lấy lịch khám hôm nay');
                });

            // Lấy lịch khám trong tháng
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
                    setError('Lỗi khi lấy lịch khám trong tháng');
                });

            // Lấy thông tin bệnh án của bác sĩ
            axios.get(`http://localhost:8080/api/v1/medicalrecords/doctor/${storedDoctorId}`)
                .then(response => {
                    setMedicalRecords(response.data);
                })
                .catch(error => {
                    console.error('Lỗi khi lấy bệnh án', error);
                    setError('Lỗi khi lấy bệnh án');
                });
        }
    }, []);

    const handleToggleTodayAppointments = () => {
        setShowTodayAppointments(!showTodayAppointments);
    };

    const handleToggleMonthAppointments = () => {
        setShowMonthAppointments(!showMonthAppointments);
    };

    const handleToggleMedicalRecords = () => {
        setShowMedicalRecords(!showMedicalRecords);
    };

    return (
        <div className="doctor-dashboard">
            <Sidebar
                onShowTodayAppointments={handleToggleTodayAppointments}
                onShowMonthAppointments={handleToggleMonthAppointments}
                onShowMedicalRecords={handleToggleMedicalRecords}
            />
            <div className="content-doctor">
                {error && <p className="error">{error}</p>}
                {doctor && (
                    <div className="doctor-info">
                        <h2>Chào mừng, Dr. {doctor.doctor_name}</h2>
                        <p>Email: {doctor.doctor_email}</p>
                        <p>Địa chỉ: {doctor.doctor_address}</p>
                        <p>Tình trạng làm việc: {doctor.working_status}</p>
                    </div>
                )}
                <div className="statistics">
                    <div className="stat-card">
                        <h3>Lịch khám hôm nay</h3>
                        <p>{todayAppointments.length}</p>
                        <button onClick={handleToggleTodayAppointments}>
                            {showTodayAppointments ? "Ẩn lịch khám hôm nay" : "Hiện lịch khám hôm nay"}
                        </button>
                    </div>
                    <div className="stat-card">
                        <h3>Lịch khám trong tháng</h3>
                        <p>{monthAppointments.length}</p>
                        <button onClick={handleToggleMonthAppointments}>
                            {showMonthAppointments ? "Ẩn lịch khám trong tháng" : "Hiện lịch khám trong tháng"}
                        </button>
                    </div>
                    <div className="stat-card">
                        <h3>Bệnh án</h3>
                        <p>{medicalRecords.length}</p>
                        <button onClick={handleToggleMedicalRecords}>
                            {showMedicalRecords ? "Ẩn bệnh án" : "Hiện bệnh án"}
                        </button>
                    </div>
                </div>
                {showTodayAppointments && (
                    <div className="stat-card-apponin">
                        <h3>Lịch khám hôm nay</h3>
                        <ul>
                            {todayAppointments.map((appointment, index) => (
                                <li key={index}>
                                    <p>Bệnh nhân: {appointment.patient?.[0]?.patient_name || 'N/A'}</p>
                                    <p>Ngày khám: {new Date(appointment.medical_day).toLocaleDateString()}</p>
                                    <p>Thời gian: {getTimeFromSlot(appointment.slot)}</p>
                                    <p>Trạng thái: {appointment.status}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                {showMonthAppointments && (
                    <div className="stat-card-apponin">
                        <h3>Lịch khám trong tháng</h3>
                        <ul>
                            {monthAppointments.map((appointment, index) => (
                                <li key={index}>
                                    <p>Bệnh nhân: {appointment.patient?.[0]?.patient_name || 'N/A'}</p>
                                    <p>Ngày khám: {new Date(appointment.medical_day).toLocaleDateString()}</p>
                                    <p>Thời gian: {getTimeFromSlot(appointment.slot)}</p>
                                    <p>Trạng thái: {appointment.status}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                {showMedicalRecords && (
                    <div className="stat-card-apponin">
                        <h3>Bệnh án</h3>
                        <ul>
                            {medicalRecords.map((record, index) => (
                                <li key={index}>
                                    <p>ID bệnh án: {record.medicalrecord_id}</p>
                                    <p>Triệu chứng: {record.symptoms}</p>
                                    <p>Chẩn đoán: {record.diagnosis}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('role');
    localStorage.removeItem('doctorId');
    window.location.href = '/doctorlogin';
};

const getTimeFromSlot = (slot) => {
    const slotToTime = {
        1: "08:00 - 09:00",
        2: "09:00 - 10:00",
        3: "10:00 - 11:00",
        4: "11:00 - 12:00",
        5: "13:00 - 14:00",
        6: "14:00 - 15:00",
        7: "15:00 - 16:00",
        8: "16:00 - 17:00"
    };
    return slotToTime[slot] || "Unknown Time";
};

export default DoctorDashboard;
