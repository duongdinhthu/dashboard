import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EditAppointmentModal from './EditAppointmentModal';
import { useNavigate } from 'react-router-dom';
import './StaffDashboard.css';

const StaffDashboard = () => {
    const [searchResults, setSearchResults] = useState([]);
    const [statusFilter, setStatusFilter] = useState('Pending');
    const [error, setError] = useState('');
    const [editItem, setEditItem] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchAppointments('Pending');
    }, []);

    const fetchAppointments = (status) => {
        axios.get(`http://localhost:8080/api/v1/appointments/search`, {
            params: { status }
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

    const handleStatusChange = (event) => {
        const newStatus = event.target.value;
        setStatusFilter(newStatus);
        fetchAppointments(newStatus);
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

    return (
        <div className="staff-dashboard">
            <div className="filter-section">
                <label>Status:</label>
                <select value={statusFilter} onChange={handleStatusChange}>
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                </select>
                <button onClick={() => fetchAppointments(statusFilter)}><img width="26" height="26"
                                                                             src="https://img.icons8.com/metro/26/004B91/search.png"
                                                                             alt="search"/></button>
            </div>
            <main>

                {error && <p className="error-message">{error}</p>}
                <section className="appointment-list">
                    {searchResults.map((appointment) => (
                        <div className="appointment-card" key={appointment.appointment_id}>
                            <h2>{appointment.patient_name}</h2>
                            <p><strong>Doctor Name:</strong> {appointment.doctor_name}</p>
                            <p><strong>Appointment
                                Date:</strong> {new Date(appointment.appointment_date).toLocaleString()}</p>
                            <p><strong>Medical Day:</strong> {new Date(appointment.medical_day).toLocaleDateString()}
                            </p>
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
                                            className="action-button complete-button">Complete
                                    </button>
                                    <button onClick={() => handleUpdateStatus(appointment.appointment_id, 'Cancelled')}
                                            className="action-button cancel-button">Cancel
                                    </button>
                                </>
                            )}
                            <button onClick={() => handleEditClick(appointment)}
                                    className="action-button edit-button">Edit
                            </button>
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
