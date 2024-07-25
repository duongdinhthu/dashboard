import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DoctorDashboard.css';
import { useNavigate } from 'react-router-dom';

const DoctorDashboard = () => {
    const [doctor, setDoctor] = useState(null);
    const [todayAppointments, setTodayAppointments] = useState([]);
    const [monthAppointments, setMonthAppointments] = useState([]);
    const [medicalRecords, setMedicalRecords] = useState([]);
    const [error, setError] = useState('');
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [newStatus, setNewStatus] = useState('');
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openMedicalRecordsDialog, setOpenMedicalRecordsDialog] = useState(false);
    const [openAddMedicalRecordDialog, setOpenAddMedicalRecordDialog] = useState(false);
    const [patientMedicalRecords, setPatientMedicalRecords] = useState([]);
    const [showTodayAppointments, setShowTodayAppointments] = useState(false);
    const [showMonthAppointments, setShowMonthAppointments] = useState(false);
    const [showMedicalRecords, setShowMedicalRecords] = useState(false);
    const [newMedicalRecord, setNewMedicalRecord] = useState({
        symptoms: '',
        diagnosis: '',
        treatment: '',
        test_urine: '',
        test_blood: '',
        x_ray: ''
    });
    const [editData, setEditData] = useState({
        doctor_email: '',
        doctor_address: '',
        current_password: '',
        new_password: '',
        confirm_new_password: '',
    });

    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('role');
        localStorage.removeItem('doctor_id');
        navigate('/doctorlogin');
    };

    useEffect(() => {
        const storedDoctorId = localStorage.getItem('doctor_id');
        if (storedDoctorId) {
            axios.get(`http://localhost:8080/api/v1/doctors/${storedDoctorId}`)
                .then(response => {
                    setDoctor(response.data);
                    setEditData({
                        doctor_email: response.data.doctor_email,
                        doctor_address: response.data.doctor_address,
                        current_password: '',
                        new_password: '',
                        confirm_new_password: '',
                    });
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

    const handleUpdateStatus = (appointmentId) => {
        axios.put('http://localhost:8080/api/v1/appointments/updateStatus', {
            appointment_id: appointmentId,
            status: newStatus,
            doctor_id: doctor.doctor_id
        })
            .then(response => {
                console.log('Cập nhật trạng thái thành công:', response.data);
                setNewStatus('');
                setSelectedAppointment(null);
                // Tải lại lịch khám hôm nay
                const today = new Date().toISOString().split('T')[0];
                axios.get('http://localhost:8080/api/v1/appointments/search', {
                    params: {
                        medical_day: today,
                        doctor_id: doctor.doctor_id
                    }
                })
                    .then(response => {
                        setTodayAppointments(response.data);
                    })
                    .catch(error => {
                        console.error('Lỗi khi lấy lịch khám hôm nay', error);
                        setError('Lỗi khi lấy lịch khám hôm nay');
                    });
            })
            .catch(error => {
                console.error('Lỗi khi cập nhật trạng thái', error);
                setError('Lỗi khi cập nhật trạng thái');
            });
    };

    const handleEditOpen = () => {
        setOpenEditDialog(true);
    };

    const handleEditClose = () => {
        setOpenEditDialog(false);
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleEditSubmit = () => {
        if (editData.new_password !== editData.confirm_new_password) {
            setError('Mật khẩu mới không khớp');
            return;
        }

        const updateData = {
            doctor_id: doctor.doctor_id,
            doctor_email: editData.doctor_email,
            doctor_address: editData.doctor_address,
        };

        if (editData.new_password) {
            updateData.doctor_password = editData.new_password;
        }

        axios.put('http://localhost:8080/api/v1/doctors/update', updateData)
            .then(response => {
                console.log('Cập nhật thông tin bác sĩ thành công:', response.data);
                setDoctor((prevDoctor) => ({
                    ...prevDoctor,
                    doctor_email: editData.doctor_email,
                    doctor_address: editData.doctor_address,
                }));
                setOpenEditDialog(false);
            })
            .catch(error => {
                console.error('Lỗi khi cập nhật thông tin bác sĩ', error);
                setError('Lỗi khi cập nhật thông tin bác sĩ');
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
                setOpenMedicalRecordsDialog(true);
            })
            .catch(error => {
                console.error('Lỗi khi lấy bệnh án', error);
                setError('Lỗi khi lấy bệnh án');
            });
    };

    const handleAddMedicalRecordOpen = () => {
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
        const medicalRecordData = {
            ...newMedicalRecord,
            patient_id: selectedAppointment.patient_id,
            doctor_id: doctor.doctor_id,
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
                setError('Lỗi khi thêm bệnh án');
            });
    };

    const handleCloseMedicalRecordsDialog = () => {
        setOpenMedicalRecordsDialog(false);
    };

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

            <div className="main-content">

                <div className="content">
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
                        <div className="appointments-list">
                            <h3>Lịch khám hôm nay</h3>
                            <ul>
                                {todayAppointments.map((appointment, index) => (
                                    <li key={index}>
                                        <p>Bệnh nhân: {appointment.patient?.[0]?.patient_name || 'N/A'}</p>
                                        <p>Ngày khám: {new Date(appointment.medical_day).toLocaleDateString()} - Thời gian: {getTimeFromSlot(appointment.slot)} - Trạng thái: {appointment.status}</p>
                                        <button onClick={() => handleShowMedicalRecords(appointment.patient?.[0]?.patient_id)}>Hiển thị bệnh án</button>
                                        <button onClick={handleAddMedicalRecordOpen}>Thêm bệnh án</button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {showMonthAppointments && (
                        <div className="appointments-list">
                            <h3>Lịch khám trong tháng</h3>
                            <ul>
                                {monthAppointments.map((appointment, index) => (
                                    <li key={index}>
                                        <p>Bệnh nhân: {appointment.patient?.[0]?.patient_name || 'N/A'}</p>
                                        <p>Ngày khám: {new Date(appointment.medical_day).toLocaleDateString()} - Thời gian: {getTimeFromSlot(appointment.slot)} - Trạng thái: {appointment.status}</p>
                                        <button onClick={() => handleShowMedicalRecords(appointment.patient?.[0]?.patient_id)}>Hiển thị bệnh án</button>
                                        <button onClick={handleAddMedicalRecordOpen}>Thêm bệnh án</button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {showMedicalRecords && (
                        <div className="medical-records-list">
                            <h3>Bệnh án</h3>
                            <ul>
                                {medicalRecords.map((record, index) => (
                                    <li key={index}>
                                        <p>ID bệnh án: {record.medicalrecord_id}</p>
                                        <p>Triệu chứng: {record.symptoms}, Chẩn đoán: {record.diagnosis}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
            {openEditDialog && (
                <div className="dialog">
                    <div className="dialog-content">
                        <h2>Chỉnh sửa thông tin cá nhân</h2>
                        <input
                            type="email"
                            name="doctor_email"
                            value={editData.doctor_email}
                            onChange={handleEditChange}
                            placeholder="Email"
                        />
                        <input
                            type="text"
                            name="doctor_address"
                            value={editData.doctor_address}
                            onChange={handleEditChange}
                            placeholder="Địa chỉ"
                        />
                        <input
                            type="password"
                            name="current_password"
                            value={editData.current_password}
                            onChange={handleEditChange}
                            placeholder="Mật khẩu hiện tại"
                        />
                        <input
                            type="password"
                            name="new_password"
                            value={editData.new_password}
                            onChange={handleEditChange}
                            placeholder="Mật khẩu mới"
                        />
                        <input
                            type="password"
                            name="confirm_new_password"
                            value={editData.confirm_new_password}
                            onChange={handleEditChange}
                            placeholder="Xác nhận mật khẩu mới"
                        />
                        <div className="dialog-actions">
                            <button onClick={handleEditClose}>Hủy bỏ</button>
                            <button onClick={handleEditSubmit}>Lưu</button>
                        </div>
                    </div>
                </div>
            )}
            {openMedicalRecordsDialog && (
                <div className="dialog">
                    <div className="dialog-content">
                        <h2>Bệnh án</h2>
                        <ul>
                            {patientMedicalRecords.map((record, index) => (
                                <li key={index}>
                                    <p>ID bệnh án: {record.medicalrecord_id}</p>
                                    <p>Triệu chứng: {record.symptoms}, Chẩn đoán: {record.diagnosis}</p>
                                </li>
                            ))}
                        </ul>
                        <div className="dialog-actions">
                            <button onClick={handleCloseMedicalRecordsDialog}>Đóng</button>
                        </div>
                    </div>
                </div>
            )}
            {openAddMedicalRecordDialog && (
                <div className="dialog">
                    <div className="dialog-content">
                        <h2>Thêm bệnh án</h2>
                        <input
                            type="text"
                            name="symptoms"
                            value={newMedicalRecord.symptoms}
                            onChange={handleNewMedicalRecordChange}
                            placeholder="Triệu chứng"
                        />
                        <input
                            type="text"
                            name="diagnosis"
                            value={newMedicalRecord.diagnosis}
                            onChange={handleNewMedicalRecordChange}
                            placeholder="Chẩn đoán"
                        />
                        <input
                            type="text"
                            name="treatment"
                            value={newMedicalRecord.treatment}
                            onChange={handleNewMedicalRecordChange}
                            placeholder="Điều trị"
                        />
                        <input
                            type="text"
                            name="test_urine"
                            value={newMedicalRecord.test_urine}
                            onChange={handleNewMedicalRecordChange}
                            placeholder="Xét nghiệm nước tiểu"
                        />
                        <input
                            type="text"
                            name="test_blood"
                            value={newMedicalRecord.test_blood}
                            onChange={handleNewMedicalRecordChange}
                            placeholder="Xét nghiệm máu"
                        />
                        <input
                            type="text"
                            name="x_ray"
                            value={newMedicalRecord.x_ray}
                            onChange={handleNewMedicalRecordChange}
                            placeholder="X-Quang"
                        />
                        <div className="dialog-actions">
                            <button onClick={handleAddMedicalRecordClose}>Hủy bỏ</button>
                            <button onClick={handleAddMedicalRecordSubmit}>Thêm</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DoctorDashboard;
