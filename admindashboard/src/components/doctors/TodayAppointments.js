import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from './Sidebar';
import './TodayAppointments.css';

const TodayAppointments = () => {
    const [todayAppointments, setTodayAppointments] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [newStatus, setNewStatus] = useState('');
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [openAddMedicalRecordDialog, setOpenAddMedicalRecordDialog] = useState(false);
    const [openMedicalRecordsDialog, setOpenMedicalRecordsDialog] = useState(false);
    const [openNewAppointmentDialog, setOpenNewAppointmentDialog] = useState(false);
    const [patientMedicalRecords, setPatientMedicalRecords] = useState([]);
    const [patientName, setPatientName] = useState('');
    const [patientEmail, setPatientEmail] = useState('');
    const [newMedicalRecord, setNewMedicalRecord] = useState({
        symptoms: '',
        diagnosis: '',
        treatment: '',
        test_urine: '',
        test_blood: '',
        x_ray: ''
    });
    const [newAppointment, setNewAppointment] = useState({
        patient_id: '',
        doctor_id: localStorage.getItem('doctor_id'),
        medical_day: '',
        timeSlot: '',
        status: 'Pending',
        patient_email: ''
    });

    const navigate = useNavigate();

    const timeSlots = [
        { label: '08:00 AM - 09:00 AM', value: 1, start: '08:00', end: '09:00' },
        { label: '09:00 AM - 10:00 AM', value: 2, start: '09:00', end: '10:00' },
        { label: '10:00 AM - 11:00 AM', value: 3, start: '10:00', end: '11:00' },
        { label: '11:00 AM - 12:00 PM', value: 4, start: '11:00', end: '12:00' },
        { label: '01:00 PM - 02:00 PM', value: 5, start: '13:00', end: '14:00' },
        { label: '02:00 PM - 03:00 PM', value: 6, start: '14:00', end: '15:00' },
        { label: '03:00 PM - 04:00 PM', value: 7, start: '15:00', end: '16:00' },
        { label: '04:00 PM - 05:00 PM', value: 8, start: '16:00', end: '17:00' }
    ];

    useEffect(() => {
        const storedDoctorId = localStorage.getItem('doctor_id');
        if (storedDoctorId) {
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
                });
        }
    }, []);

    const handleNewStatusChange = (e) => {
        setNewStatus(e.target.value);
    };

    const handleUpdateStatus = (appointmentId) => {
        axios.put('http://localhost:8080/api/v1/appointments/updateStatus', {
            appointment_id: appointmentId,
            status: newStatus,
            doctor_id: localStorage.getItem('doctor_id')
        })
            .then(response => {
                console.log('Cập nhật trạng thái thành công:', response.data);
                setNewStatus('');
                setSelectedAppointment(null);
                const today = new Date().toISOString().split('T')[0];
                axios.get('http://localhost:8080/api/v1/appointments/search', {
                    params: {
                        medical_day: today,
                        doctor_id: localStorage.getItem('doctor_id')
                    }
                })
                    .then(response => {
                        setTodayAppointments(response.data);
                    })
                    .catch(error => {
                        console.error('Lỗi khi lấy lịch khám hôm nay', error);
                    });
            })
            .catch(error => {
                console.error('Lỗi khi cập nhật trạng thái', error);
            });
    };

    const handleShowMedicalRecords = (patientId) => {
        axios.get('http://localhost:8080/api/v1/medicalrecords/search', {
            params: {
                patient_id: patientId
            }
        })
            .then(response => {
                setPatientMedicalRecords(response.data);
                axios.get(`http://localhost:8080/api/v1/patients/${patientId}`)
                    .then(res => {
                        setPatientName(res.data.patient_name);
                        setPatientEmail(res.data.patient_email);
                    })
                    .catch(err => {
                        console.error('Lỗi khi lấy thông tin bệnh nhân', err);
                    });
                setOpenMedicalRecordsDialog(true);
            })
            .catch(error => {
                console.error('Lỗi khi lấy bệnh án', error);
            });
    };

    const handleAddMedicalRecordOpen = (appointment) => {
        setSelectedAppointment(appointment);
        setOpenAddMedicalRecordDialog(true);
    };

    const handleAddMedicalRecordClose = () => {
        setOpenAddMedicalRecordDialog(false);
    };

    const handleNewMedicalRecordChange = (e) => {
        const { name, value } = e.target;
        setNewMedicalRecord((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleAddMedicalRecordSubmit = () => {
        if (!selectedAppointment) {
            console.error('No appointment selected');
            return;
        }

        const medicalRecordData = {
            ...newMedicalRecord,
            patient_id: selectedAppointment.patient_id,
            doctor_id: localStorage.getItem('doctor_id'),
            follow_up_date: new Date().toISOString().split('T')[0],
        };

        axios.post('http://localhost:8080/api/v1/medicalrecords/insert', medicalRecordData)
            .then(response => {
                console.log('Thêm bệnh án thành công:', response.data);
                setNewMedicalRecord({
                    symptoms: '',
                    diagnosis: '',
                    treatment: '',
                    test_urine: '',
                    test_blood: '',
                    x_ray: ''
                });
                setOpenAddMedicalRecordDialog(false);
            })
            .catch(error => {
                console.error('Lỗi khi thêm bệnh án', error);
            });
    };

    const handleCloseMedicalRecordsDialog = () => {
        setOpenMedicalRecordsDialog(false);
    };

    const handleNewAppointmentOpen = (appointment) => {
        setSelectedAppointment(appointment);
        setNewAppointment((prevData) => ({
            ...prevData,
            patient_id: appointment.patient_id,
            patient_email: appointment.patient?.[0]?.patient_email || ''
        }));
        setOpenNewAppointmentDialog(true);
    };

    const handleNewAppointmentClose = () => {
        setOpenNewAppointmentDialog(false);
    };

    const handleNewAppointmentChange = (e) => {
        const { name, value } = e.target;
        setNewAppointment((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleNewAppointmentSubmit = () => {
        const appointmentData = {
            ...newAppointment,
            price: 19.99,
            appointment_date: new Date().toISOString()
        };

        axios.post('http://localhost:8080/api/v1/appointments/insert', appointmentData)
            .then(response => {
                console.log('Thêm lịch khám thành công:', response.data);
                setNewAppointment({
                    patient_id: '',
                    doctor_id: localStorage.getItem('doctor_id'),
                    medical_day: '',
                    timeSlot: '',
                    status: 'Pending',
                    patient_email: ''
                });
                setOpenNewAppointmentDialog(false);
            })
            .catch(error => {
                console.error('Lỗi khi thêm lịch khám', error);
            });
    };

    const filteredTodayAppointments = todayAppointments.filter(appointment =>
        appointment.patient?.[0]?.patient_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getTimeSlotLabel = (slotValue) => {
        const slot = timeSlots.find(s => s.value === slotValue);
        return slot ? slot.label : '';
    };

    return (
        <div className="today-appointments">
            <Sidebar
                onShowTodayAppointments={() => navigate('/todayappointments')}
                onShowMonthAppointments={() => navigate('/monthlyappointments')}
                onShowMedicalRecords={() => navigate('/medicalrecords')}
            />
            <div className="content">
                <h3>Today's Appointments Schedule</h3>
                <ul className="appointments-list">
                    {filteredTodayAppointments.map((appointment, index) => (
                        <li key={index}>
                            <p>Patient: {appointment.patient?.[0]?.patient_name || 'N/A'}</p>
                            <p>Date: {new Date(appointment.medical_day).toLocaleDateString()}</p>
                            <p>Time: {getTimeSlotLabel(appointment.slot)}</p>
                            <p>Status: {appointment.status}</p>
                            {appointment.status !== 'Completed' && (
                                <div>
                                    <select value={newStatus} onChange={handleNewStatusChange}>
                                        <option value="">None</option>
                                        <option value="Cancelled">Cancelled</option>
                                        <option value="Completed">Completed</option>
                                    </select>
                                    <button onClick={() => handleUpdateStatus(appointment.appointment_id)}>Update Status</button>
                                    <button onClick={() => handleAddMedicalRecordOpen(appointment)}>Add medical record</button>
                                </div>
                            )}
                            {appointment.status === 'Completed' && (
                                <div>
                                    <button onClick={() => handleNewAppointmentOpen(appointment)}>Create new appointment</button>
                                    <button onClick={() => handleAddMedicalRecordOpen(appointment)}>Add medical record</button>
                                </div>
                            )}
                            <button onClick={() => handleShowMedicalRecords(appointment.patient?.[0]?.patient_id)}>Show medical records</button>
                        </li>
                    ))}
                </ul>
                {openAddMedicalRecordDialog && (
                    <div className="dialog">
                        <div className="dialog-title">Add medical record</div>
                        <div className="dialog-content">
                            <input
                                type="text"
                                name="symptoms"
                                placeholder="Symptoms"
                                value={newMedicalRecord.symptoms}
                                onChange={handleNewMedicalRecordChange}
                            />
                            <input
                                type="text"
                                name="diagnosis"
                                placeholder="Diagnosis"
                                value={newMedicalRecord.diagnosis}
                                onChange={handleNewMedicalRecordChange}
                            />
                            <input
                                type="text"
                                name="treatment"
                                placeholder="Treatment"
                                value={newMedicalRecord.treatment}
                                onChange={handleNewMedicalRecordChange}
                            />
                            <input
                                type="text"
                                name="test_urine"
                                placeholder="Urine test"
                                value={newMedicalRecord.test_urine}
                                onChange={handleNewMedicalRecordChange}
                            />
                            <input
                                type="text"
                                name="test_blood"
                                placeholder="Blood tests"
                                value={newMedicalRecord.test_blood}
                                onChange={handleNewMedicalRecordChange}
                            />
                            <input
                                type="text"
                                name="x_ray"
                                placeholder="X-ray"
                                value={newMedicalRecord.x_ray}
                                onChange={handleNewMedicalRecordChange}
                            />
                        </div>
                        <div className="dialog-actions">
                            <button onClick={handleAddMedicalRecordClose} className="btn btn-danger">Cancel</button>
                            <button onClick={handleAddMedicalRecordSubmit} className="btn btn-primary">Add</button>
                        </div>
                    </div>
                )}
                {openNewAppointmentDialog && (
                    <div className="dialog">
                        <div className="dialog-title">Create new appointment</div>
                        <div className="dialog-content">
                            <input
                                type="date"
                                name="medical_day"
                                placeholder="Medical Day"
                                value={newAppointment.medical_day}
                                onChange={handleNewAppointmentChange}
                            />
                            <select
                                name="timeSlot"
                                value={newAppointment.timeSlot}
                                onChange={handleNewAppointmentChange}
                            >
                                <option value="">Select Time Slot</option>
                                {timeSlots.map(slot => (
                                    <option key={slot.value} value={slot.value}>
                                        {slot.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="dialog-actions">
                            <button onClick={handleNewAppointmentClose} className="btn btn-danger">Cancel</button>
                            <button onClick={handleNewAppointmentSubmit} className="btn btn-primary">Create</button>
                        </div>
                    </div>
                )}
                {openMedicalRecordsDialog && (
                    <div className="dialog">
                        <div className="dialog-title">Medical Records</div>
                        <div className="dialog-content">
                            <ul className="medical-records-list">
                                {patientMedicalRecords.map((record, index) => (
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
                        <div className="dialog-actions">
                            <button onClick={handleCloseMedicalRecordsDialog} className="btn btn-danger">Close</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TodayAppointments;
