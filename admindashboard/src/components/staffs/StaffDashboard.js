import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EditAppointmentModal from './EditAppointmentModal';
import { useNavigate, useLocation } from 'react-router-dom';
import './StaffDashboard.css';

const StaffDashboard = () => {
    const [searchResults, setSearchResults] = useState([]);
    const [upcomingAppointments, setUpcomingAppointments] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [error, setError] = useState('');
    const [editItem, setEditItem] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const status = params.get('status') || 'Pending';
        setStatusFilter(status);
        fetchAppointments();
    }, [location.search]);
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

    const fetchAppointments = () => {
        axios.get(`http://localhost:8080/api/v1/appointments/search-new`, {
            params: { start_date: startDate, end_date: endDate, status: statusFilter }
        })
            .then(response => {
                const flatData = response.data.map(item => ({
                    appointment_id: item.appointment_id,
                    patient_name: item.patient?.[0]?.patient_name,
                    doctor_name: item.doctor?.[0]?.doctor_name,
                    appointment_date: item.appointment_date,
                    medical_day: item.medical_day,
                    slot: item.slot,
                    status: item.status,
                    payment_name: item.payment_name,
                    price: item.price,
                    staff_id: item.staff_id,
                }));
                setSearchResults(flatData);
            })
            .catch(error => {
                console.error('Error fetching appointments', error);
                setError('Error fetching appointments');
            });
    };

    const fetchUpcomingAppointments = () => {
        const today = new Date();
        const endDay = new Date(today);
        endDay.setDate(today.getDate() + 3);

        const start_date = today.toISOString().split('T')[0];
        const end_date = endDay.toISOString().split('T')[0];

        axios.get(`http://localhost:8080/api/v1/appointments/search-new`, {
            params: { start_date, end_date }
        })
            .then(response => {
                const flatData = response.data.map(item => ({
                    appointment_id: item.appointment_id,
                    patient_name: item.patient?.[0]?.patient_name,
                    doctor_name: item.doctor?.[0]?.doctor_name,
                    appointment_date: item.appointment_date,
                    medical_day: item.medical_day,
                    slot: item.slot,
                    status: item.status,
                    payment_name: item.payment_name,
                    price: item.price,
                    staff_id: item.staff_id,
                }));
                setUpcomingAppointments(flatData);
            })
            .catch(error => {
                console.error('Error fetching upcoming appointments', error);
                setError('Error fetching upcoming appointments');
            });
    };

    const handleStatusChange = (event) => {
        setStatusFilter(event.target.value);
    };

    const handleEditClick = (item) => {
        setEditItem(item);
    };

    const handleEditModalClose = () => {
        setEditItem(null);
    };

    const handleSaveEdit = (updatedItem) => {
        setSearchResults((prevResults) =>
            prevResults.map((item) =>
                item.appointment_id === updatedItem.appointment_id
                    ? updatedItem
                    : item
            )
        );
        setEditItem(null);
    };

    const handleUpdateStatus = async (appointmentId, newStatus) => {
        try {
            const staffId = localStorage.getItem('staffId');
            if (!staffId) {
                alert('Staff ID is missing. Please log in again.');
                return;
            }
            await axios.put(`http://localhost:8080/api/v1/appointments/updateStatus`, {
                appointment_id: appointmentId,
                status: newStatus,
                staff_id: staffId
            });
            setSearchResults((prevResults) =>
                prevResults.map((item) =>
                    item.appointment_id === appointmentId
                        ? { ...item, status: newStatus, staff_id: staffId }
                        : item
                )
            );
            alert(`Appointment ${newStatus.toLowerCase()} successfully.`);
        } catch (error) {
            console.error(`There was an error updating the appointment to ${newStatus.toLowerCase()}!`, error);
            alert(`Failed to update the appointment to ${newStatus.toLowerCase()}.`);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('role');
        localStorage.removeItem('staffId');
        navigate('/stafflogin');
    };

    const handleTodayStats = () => {
        navigate('/stafftodayappointments');
    };

    const handleUpcomingAppointments = () => {
        fetchUpcomingAppointments();
    };

    return (
        <div className="staff-dashboard">
            <div className="search">
                <div className="input-container">
                    <label>Start Date</label>
                    <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}/>
                </div>
                <div className="input-container">
                    <label>End Date</label>
                    <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}/>
                </div>
                <div className="input-container">
                    <label>Status</label>
                    <select value={statusFilter} onChange={handleStatusChange}>
                        <option value="">All</option>
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                </div>
                <a onClick={fetchAppointments}>
                    <img width="26" height="26" src="https://img.icons8.com/metro/26/004B91/search.png" alt="search"/>
                </a>
                <button onClick={handleTodayStats} className="today-stats-button">Today's schedule</button>
                <button onClick={handleUpcomingAppointments} className="upcoming-appointments-button">
                Schedule for the next 3 days
                </button>
            </div>
            <main>
                {error && <p className="error-message">{error}</p>}
                <section className="appointment-list">
                    {searchResults.map((appointment) => (
                        <div className="appointment-card" key={appointment.appointment_id}>
                            <h2>{appointment.patient_name}</h2>
                            <p><strong>Doctor Name:</strong> {appointment.doctor_name}</p>
                            <p><strong>Appointment Date:</strong> {new Date(appointment.appointment_date).toLocaleString()}</p>
                            <p><strong>Medical Day:</strong> {new Date(appointment.medical_day).toLocaleDateString()}</p>
                            <p><strong>Slot:</strong> {appointment.slot}</p>
                            <p><strong>Status:</strong> {appointment.status}</p>
                            <p><strong>Payment Name:</strong> {appointment.payment_name}</p>
                            <p><strong>Price:</strong> {appointment.price}</p>
                            <p><strong>Staff ID:</strong> {appointment.staff_id || 'N/A'}</p>
                            {appointment.status === 'Pending' && (
                                <button onClick={() => handleUpdateStatus(appointment.appointment_id, 'Confirmed')}
                                        className="action-button confirm-button">Confirm</button>
                            )}
                            {appointment.status === 'Confirmed' && (
                                <>
                                    <button onClick={() => handleUpdateStatus(appointment.appointment_id, 'Completed')}
                                            className="action-button complete-button">Complete</button>
                                    <button onClick={() => handleUpdateStatus(appointment.appointment_id, 'Cancelled')}
                                            className="action-button cancel-button">Cancel</button>
                                </>
                            )}
                            {appointment.status !== 'Completed' && (
                                <button onClick={() => handleEditClick(appointment)}
                                        className="action-button edit-button">Edit</button>
                            )}
                        </div>
                    ))}
                </section>
                <section className="upcoming-appointment-list">
                    <h3>Schedule for the next 3 days</h3>
                    {upcomingAppointments.map((appointment) => (
                        <div className="appointment-card" key={appointment.appointment_id}>
                            <h2>{appointment.patient_name}</h2>
                            <p><strong>Doctor Name:</strong> {appointment.doctor_name}</p>
                            <p><strong>Appointment Date:</strong> {appointment.appointment_date}</p>
                            <p><strong>Appointment Time:</strong> {formatTimeSlot(appointment.slot)}</p>
                            <p><strong>Status:</strong> {appointment.status}</p>
                            <p><strong>Price:</strong> {appointment.price}</p>
                            <p><strong>Staff ID:</strong> {appointment.staff_id || 'N/A'}</p>
                            {appointment.status === 'Pending' && (
                                <button onClick={() => handleUpdateStatus(appointment.appointment_id, 'Confirmed')}
                                        className="action-button confirm-button">Confirm</button>
                            )}
                            {appointment.status === 'Confirmed' && (
                                <>
                                    <button onClick={() => handleUpdateStatus(appointment.appointment_id, 'Completed')}
                                            className="action-button complete-button">Complete
                                    </button>
                                    <button onClick={() => handleUpdateStatus(appointment.appointment_id, 'Cancelled')}
                                            className="action-button cancel-button">Cancel
                                    </button>
                                </>
                            )}
                            {appointment.status !== 'Completed' && (
                                <button onClick={() => handleEditClick(appointment)}
                                        className="action-button edit-button">Edit</button>
                            )}
                        </div>
                    ))}
                </section>
            </main>
            {editItem && (
                <EditAppointmentModal
                    appointment={editItem}
                    onClose={handleEditModalClose}
                    onSave={handleSaveEdit}
                />
            )}
        </div>
    );
};

export default StaffDashboard;
