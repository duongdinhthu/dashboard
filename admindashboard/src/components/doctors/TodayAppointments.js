import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from './Sidebar';
import './TodayAppointments.css';
import $ from 'jquery';

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

    const viewRecordDetails = (record) => {
        navigate('/record-details', { state: { record } });
    };
    const [newAppointment, setNewAppointment] = useState({
        patient_id: '',
        doctor_id: localStorage.getItem('doctor_id'),
        medical_day: '',
        timeSlot: '',
        status: 'Pending',
        patient_email: ''
    });

    const navigate = useNavigate();

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

    const handleOpenTodayAppointments = () => {
        navigate('/todayappointments');
    };

    const handleOpenMonthlyAppointments = () => {
        navigate('/monthlyappointments');
    };

    const handleOpenMedicalRecords = () => {
        navigate('/medicalrecords');
    };

    const [editAppointmentData, setEditAppointmentData] = useState(null);
    const [bookedSlots, setBookedSlots] = useState([]);
    const [availableSlots, setAvailableSlots] = useState([]);
    const timeSlots = [
        {label: '08:00 AM - 09:00 AM', value: 1, start: '08:00', end: '09:00'},
        {label: '09:00 AM - 10:00 AM', value: 2, start: '09:00', end: '10:00'},
        {label: '10:00 AM - 11:00 AM', value: 3, start: '10:00', end: '11:00'},
        {label: '11:00 AM - 12:00 AM', value: 4, start: '11:00', end: '12:00'},
        {label: '01:00 PM - 02:00 PM', value: 5, start: '13:00', end: '14:00'},
        {label: '02:00 PM - 03:00 PM', value: 6, start: '14:00', end: '15:00'},
        {label: '03:00 PM - 04:00 PM', value: 7, start: '15:00', end: '16:00'},
        {label: '04:00 PM - 05:00 PM', value: 8, start: '16:00', end: '17:00'}
    ];

    const formatTimeSlot = (slot) => {
        switch (slot) {
            case 1:
                return '8:00 AM - 9:00 AM';
            case 2:
                return '9:00 AM - 10:00 AM';
            case 3:
                return '10:00 AM - 11:00 AM';
            case 4:
                return '11:00 AM - 12:00 AM';
            case 5:
                return '01:00 PM - 02:00 PM';
            case 6:
                return '02:00 PM - 03:00 PM';
            case 7:
                return '03:00 PM - 04:00 PM';
            case 8:
                return '04:00 PM - 05:00 PM';
            default:
                return 'Slot Time Not Defined';
        }
    };

    const [formData, setFormData] = useState({
        date: '',
        timeSlot: ''
    });

    const handleCancelEditAppointment = () => {
        setFormData({
            date: '',
            timeSlot: ''
        });
        setBookedSlots([]);
        setAvailableSlots([]);
        setEditAppointmentData(null);
    };

    useEffect(() => {
        if (formData.date) {
            axios.get(`http://localhost:8080/api/v1/appointments/${localStorage.getItem('doctor_id')}/slots`)
                .then(response => {
                    setBookedSlots(response.data);
                })
                .catch(error => {
                    console.error('Error fetching booked slots!', error);
                });

            axios.get(`http://localhost:8080/api/v1/appointments/check-locked-slots?doctorId=${localStorage.getItem('doctor_id')}&date=${formData.date}`)
                .then(response => {
                    const lockedSlots = response.data;
                    const available = timeSlots.filter(slot => !lockedSlots.includes(slot.value));
                    setAvailableSlots(available);
                    // Reset formData.timeSlot if it's no longer available
                    if (!available.find(slot => slot.value === formData.timeSlot)) {
                        setFormData({
                            ...formData,
                            timeSlot: ''
                        });
                    }
                })
                .catch(error => {
                    console.error('Error fetching locked slots!', error);
                });
        }
    }, [formData.date]);


    useEffect(() => {
        if (formData.date && bookedSlots.length > 0) {
            const bookedSlotsForDate = bookedSlots.filter(slot => {
                const slotDate = new Date(slot.medical_day).toISOString().split('T')[0];
                return slotDate === formData.date;
            }).map(slot => slot.slot);
            const available = timeSlots.filter(slot => !bookedSlotsForDate.includes(slot.value));
            setAvailableSlots(available);
        } else {
            setAvailableSlots(timeSlots);
        }
    }, [formData.date, bookedSlots]);

    const handleDateChange = (date) => {
        setFormData({
            ...formData,
            date: date,
            timeSlot: ''
        });
    };

    const handleTimeSlotChange = (slot) => {
        // Check and lock the selected slot
        axios.post('http://localhost:8080/api/v1/appointments/lock-slot', {
            doctorId: localStorage.getItem('doctor_id'),
            date: formData.date,
            time: slot
        }).then(response => {
            setFormData({
                ...formData,
                timeSlot: slot
            });

            // Schedule to release lock after 5 minutes if not confirmed
            setTimeout(() => {
                axios.post('http://localhost:8080/api/v1/appointments/unlock-slot', {
                    doctorId: formData.doctor,
                    date: formData.date,
                    time: slot
                }).catch(error => {
                    console.error('Error unlocking slot!', error);
                });
            }, 300000);
        }).catch(error => {
            console.error('Error locking slot!', error);
            $(".time-slots").append('<span class="time-error">This time slot is already taken, please choose another one.</span>');
            setTimeout(function() {
                $(".time-error").remove();
            }, 2000);
        });
    };

    const isTimeSlotPast = (date, startTime) => {
        const appointmentDate = new Date(date);
        const currentDate = new Date();
        const [startHour, startMinute] = startTime.split(':').map(Number);

        appointmentDate.setHours(startHour, startMinute, 0, 0);

        return appointmentDate < currentDate;
    };

    const generateDateButtons = () => {
        const today = new Date();
        const dates = [];
        for (let i = 0; i < 3; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            const dateString = date.toISOString().split('T')[0];
            dates.push({
                label: i === 0 ? `Today (${dateString})` : (i === 1 ? `Tomorrow (${dateString})` : `Day after tomorrow (${dateString})`),
                value: dateString
            });
        }
        return dates;
    };

    const renderDateButtons = () => {
        const dates = generateDateButtons();
        return (
            <div className="date-container">
                <label>Date</label>
                <div className="date-select">
                    <div className="date-buttons">
                        {dates.map(date => (
                            <button
                                key={date.value}
                                className={formData.date === date.value ? 'selected' : ''}
                                onClick={() => handleDateChange(date.value)}
                            >
                                {date.label}
                            </button>
                        ))}
                    </div>
                    <span>OR</span>
                    <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => handleDateChange(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                    />

                </div>
            </div>
        );
    };

    const renderTimeSlots = () => {
        return (
            <div className="time-container">
                <label>Time</label>
                <div className="time-slots">
                    {availableSlots.map(slot => (
                        <button
                            key={slot.value}
                            className={formData.timeSlot === slot.value ? 'selected' : ''}
                            onClick={() => handleTimeSlotChange(slot.value)}
                            disabled={isTimeSlotPast(formData.date, slot.start)} // Disable past slots
                            style={{
                                backgroundColor: isTimeSlotPast(formData.date, slot.start) ? '#d3d3d3' : '',
                                pointerEvents: isTimeSlotPast(formData.date, slot.start) ? 'none' : 'auto'
                            }}
                        >
                            {slot.label}
                        </button>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="today-appointments">
            <Sidebar
                handleOpenTodayAppointments={handleOpenTodayAppointments}
                handleOpenMonthlyAppointments={handleOpenMonthlyAppointments}
                handleOpenMedicalRecords={handleOpenMedicalRecords}
            />
            <div className="content">
                <h3 className="tab-title">Today's Appointments Schedule</h3>
                <ul className="appointments-list">
                    {filteredTodayAppointments.map((appointment, index) => (
                        <li key={index}>
                            <div><p>Patient Name: {appointment.patient?.[0]?.patient_name || 'N/A'}</p>
                                <p>Date: {new Date(appointment.medical_day).toLocaleDateString()}</p>
                                <p>Time: {getTimeSlotLabel(appointment.slot)}</p>
                                <p>Status: {appointment.status}</p></div>
                            {appointment.status !== 'Completed' && (
                                <div>
                                    <select value={newStatus} onChange={handleNewStatusChange}>
                                        <option value="">None</option>
                                        <option value="Cancelled">Cancelled</option>
                                        <option value="Completed">Completed</option>
                                    </select>
                                    <button onClick={() => handleUpdateStatus(appointment.appointment_id)}>Update
                                        Status
                                    </button>
                                    <button onClick={() => handleAddMedicalRecordOpen(appointment)}>Add medical record
                                    </button>
                                    <button
                                        onClick={() => handleShowMedicalRecords(appointment.patient?.[0]?.patient_id)}>Show
                                        medical records
                                    </button>
                                </div>
                            )}
                            {appointment.status === 'Completed' && (
                                <div>
                                    <button onClick={() => handleNewAppointmentOpen(appointment)}>Create new appointment</button>
                                    <button onClick={() => handleAddMedicalRecordOpen(appointment)}>Add medical record</button>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
                {openAddMedicalRecordDialog && (
                    <div className="dialog">
                        <div className="dialog-title">Add Medical Record</div>
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
                            <textarea
                                name="prognosis"
                                placeholder="Prognosis"
                                value={newMedicalRecord.treatment}
                                onChange={handleNewMedicalRecordChange}
                            />
                            <textarea
                                name="notes"
                                placeholder="Notes"
                                value={newMedicalRecord.prescription}
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
                        <div className="dialog-title">Create New Appointment</div>
                        <div className="dialog-content">
                            {renderDateButtons()}
                            {formData.date && renderTimeSlots()}
                        </div>
                        <div className="dialog-actions">
                            <button onClick={handleNewAppointmentClose} className="btn btn-danger">Cancel</button>
                            <button onClick={handleNewAppointmentSubmit} className="btn btn-primary" disabled={!formData.date || !formData.timeSlot}>Create</button>
                        </div>
                    </div>
                )}
                {openMedicalRecordsDialog && (
                    <div className="dialog-records">
                        <div className="dialog-title">Medical Records</div>
                        <div className="dialog-content">
                            <ul className="medical-records-list">
                                {patientMedicalRecords.map((record, index) => (
                                    <li key={index}>
                                        <p>Medical Record ID: {record.record_id}</p>
                                        <div className="medical-record-details">
                                            <p><strong>Symptoms:</strong> {record.symptoms}</p>
                                            <p><strong>Diagnosis:</strong> {record.diagnosis}</p>
                                            <p><strong>Date:</strong> {record.follow_up_date}</p>
                                            <button onClick={() => viewRecordDetails(record)}>View Details</button>
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
