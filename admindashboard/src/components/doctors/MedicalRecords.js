import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from './Sidebar'; // Import Sidebar
import './MedicalRecords.css';

const MedicalRecords = () => {
    const [medicalRecords, setMedicalRecords] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    const navigate = useNavigate(); // Define navigate

    useEffect(() => {
        const storedDoctorId = localStorage.getItem('doctor_id');
        if (storedDoctorId) {
            axios.get(`http://localhost:8080/api/v1/medicalrecords/doctor/${storedDoctorId}`)
                .then(response => {
                    setMedicalRecords(response.data);
                })
                .catch(error => {
                    console.error('Lỗi khi lấy bệnh án', error);
                });
        }
    }, []);

    const filteredMedicalRecords = medicalRecords.filter(record =>
        record.patients[0]?.patient_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="medical-records">
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
                <h3>Medical Records</h3>
                <ul className="medical-records-list">
                    {filteredMedicalRecords.map((record, index) => (
                        <li key={index}>
                            <p>Medical Record ID: {record.record_id}</p>
                            <div className="medical-record-details">
                                <p><strong>Patient Name:</strong> {record.patients[0]?.patient_name || 'N/A'}</p>
                                <p><strong>Patient Email:</strong> {record.patients[0]?.patient_email || 'N/A'}</p>
                                <p><strong>Symptoms:</strong> {record.symptoms}</p>
                                <p><strong>Diagnosis:</strong> {record.diagnosis}</p>
                                <p><strong>Treatment:</strong> {record.treatment}</p>
                                <p><strong>Urine Tests:</strong> {record.test_urine}</p>
                                <p><strong>Blood Tests:</strong> {record.test_blood}</p>
                                <p><strong>X-Ray:</strong> {record.x_ray}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default MedicalRecords;
