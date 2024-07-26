import React, { useState } from 'react';
import './AppointmentForm.css';

const AppointmentForm = ({ open, onClose, onSave, appointment }) => {
    const [formData, setFormData] = useState({
        doctor_name: appointment?.doctor_name || '',
        patient_name: appointment?.patient_name || '',
        appointment_date: appointment?.appointment_date || '',
        notes: appointment?.notes || '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = () => {
        onSave(formData);
    };

    return (
        <div className={`modal ${open ? 'modal-open' : ''}`} onClick={onClose}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                <h6>{appointment ? 'Edit Appointment' : 'New Appointment'}</h6>
                <input
                    type="text"
                    name="doctor_name"
                    placeholder="Doctor Name"
                    value={formData.doctor_name}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="patient_name"
                    placeholder="Patient Name"
                    value={formData.patient_name}
                    onChange={handleChange}
                    required
                />
                <input
                    type="datetime-local"
                    name="appointment_date"
                    value={formData.appointment_date}
                    onChange={handleChange}
                    required
                />
                <textarea
                    name="notes"
                    placeholder="Notes"
                    value={formData.notes}
                    onChange={handleChange}
                    required
                ></textarea>
                <button onClick={handleSubmit}>Save</button>
            </div>
        </div>
    );
};

export default AppointmentForm;
