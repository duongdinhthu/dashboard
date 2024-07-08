import React, { useState, useEffect } from 'react';
import { Modal, Box, TextField, Button, Typography } from '@mui/material';
import axios from 'axios';

const EditAppointmentModal = ({ appointment, onClose, onSave }) => {
    const [formValues, setFormValues] = useState({
        appointment_id: '',
        patient_name: '',
        doctor_name: '',
        appointment_date: '',
        slot: '',
        status: '',
        payment_name: '',
        price: '',
    });

    useEffect(() => {
        if (appointment) {
            setFormValues({
                appointment_id: appointment.appointment_id || '',
                patient_name: appointment.patient_name || '',
                doctor_name: appointment.doctor_name || '',
                appointment_date: appointment.appointment_date || '',
                slot: appointment.slot || '',
                status: appointment.status || '',
                payment_name: appointment.payment_name || '',
                price: appointment.price || '',
            });
        }
    }, [appointment]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({
            ...formValues,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put('http://localhost:8080/api/v1/appointments/update', formValues);
            onSave(response.data); // Cập nhật danh sách cuộc hẹn sau khi sửa đổi thành công
            onClose(); // Đóng Modal sau khi sửa đổi thành công
        } catch (error) {
            console.error('Error updating appointment', error);
        }
    };

    return (
        <Modal
            open={!!appointment}
            onClose={onClose}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
        >
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 400,
                bgcolor: 'background.paper',
                border: '2px solid #000',
                boxShadow: 24,
                p: 4
            }}>
                <Typography id="modal-title" variant="h6" component="h2">
                    Edit Appointment
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Patient Name"
                        name="patient_name"
                        value={formValues.patient_name}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Doctor Name"
                        name="doctor_name"
                        value={formValues.doctor_name}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Appointment Date"
                        name="appointment_date"
                        value={formValues.appointment_date}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Slot"
                        name="slot"
                        value={formValues.slot}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Status"
                        name="status"
                        value={formValues.status}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Payment Name"
                        name="payment_name"
                        value={formValues.payment_name}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Price"
                        name="price"
                        value={formValues.price}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                        <Button type="submit" variant="contained" color="primary">
                            Save
                        </Button>
                        <Button onClick={onClose} variant="contained" color="secondary">
                            Cancel
                        </Button>
                    </Box>
                </form>
            </Box>
        </Modal>
    );
};

export default EditAppointmentModal;
