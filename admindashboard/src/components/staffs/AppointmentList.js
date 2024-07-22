import React from 'react';
import { Button } from '@mui/material';

const AppointmentList = ({ searchResults, handleEditClick, handleConfirmAppointment }) => {
    return (
        <div>
            {searchResults.map((appointment) => (
                <div key={appointment.appointment_id} style={{ border: '1px solid #ccc', padding: '16px', marginBottom: '16px' }}>
                    <p><strong>Patient Name:</strong> {appointment.patient_name}</p>
                    <p><strong>Doctor Name:</strong> {appointment.doctor_name}</p>
                    <p><strong>Appointment Date:</strong> {new Date(appointment.appointment_date).toLocaleString()}</p>
                    <p><strong>Medical Day:</strong> {new Date(appointment.medical_day).toLocaleDateString()}</p>
                    <p><strong>Slot:</strong> {appointment.slot}</p>
                    <p><strong>Status:</strong> {appointment.status}</p>
                    <p><strong>Payment Name:</strong> {appointment.payment_name}</p>
                    <p><strong>Price:</strong> {appointment.price}</p>
                    <Button onClick={() => handleEditClick(appointment)} variant="outlined" style={{ marginRight: '8px' }}>
                        Edit
                    </Button>
                    {appointment.status !== 'Confirmed' && (
                        <Button onClick={() => handleConfirmAppointment(appointment.appointment_id)} variant="contained" color="primary">
                            Confirm
                        </Button>
                    )}
                </div>
            ))}
        </div>
    );
};

export default AppointmentList;
