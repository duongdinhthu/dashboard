import React, { useState } from 'react';
import { Box, TextField, Button, Modal, Typography } from '@mui/material';

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
        <Modal open={open} onClose={onClose}>
            <Box sx={{ ...modalStyle }}>
                <Typography variant="h6" gutterBottom>
                    {appointment ? 'Edit Appointment' : 'New Appointment'}
                </Typography>
                <TextField
                    label="Doctor Name"
                    name="doctor_name"
                    value={formData.doctor_name}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Patient Name"
                    name="patient_name"
                    value={formData.patient_name}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Appointment Date"
                    name="appointment_date"
                    type="datetime-local"
                    value={formData.appointment_date}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
                <Button onClick={handleSubmit} variant="contained" color="primary">
                    Save
                </Button>
            </Box>
        </Modal>
    );
};

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default AppointmentForm;
