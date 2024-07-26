import React, { useState } from 'react';
import axios from 'axios';
import './EditAppointmentModal.css';

const EditAppointmentModal = ({ appointment, onClose, onSave }) => {
    const [editedAppointment, setEditedAppointment] = useState(appointment);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedAppointment((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSave = () => {
        const staffId = localStorage.getItem('staff_id');
        const dataToSend = {
            ...editedAppointment,
            staff_id: staffId
        };

        axios.put('http://localhost:8080/api/v1/appointments/updateStatus', dataToSend)
            .then(response => {
                onSave(editedAppointment);
                onClose();
            })
            .catch(error => {
                console.error('Error updating appointment status', error);
            });
    };

    return (
        <div className={`modal ${Boolean(appointment) ? 'modal-open' : ''}`} onClick={onClose}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                <h2>Edit Appointment</h2>
                <input
                    type="text"
                    name="status"
                    value={editedAppointment.status}
                    onChange={handleChange}
                    className="text-field"
                />
                <div className="modal-actions">
                    <button className="cancel-button" onClick={onClose}>Cancel</button>
                    <button className="save-button" onClick={handleSave}>Save</button>
                </div>
            </div>
        </div>
    );
};

export default EditAppointmentModal;
