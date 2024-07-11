import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';
import axios from 'axios';

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
        const staffId = localStorage.getItem('staff_id'); // Lấy staff_id từ localStorage
        const dataToSend = {
            ...editedAppointment,
            staff_id: staffId // Thêm staff_id vào dữ liệu gửi
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
        <Modal open={Boolean(appointment)} onClose={onClose}>
            <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', p: 4, boxShadow: 24 }}>
                <Typography variant="h6" gutterBottom>
                    Edit Appointment
                </Typography>
                <TextField
                    label="Status"
                    name="status"
                    value={editedAppointment.status}
                    onChange={handleChange}
                    fullWidth
                    sx={{ mb: 2 }}
                />
                {/* Add more fields as necessary */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button onClick={onClose} sx={{ mr: 2 }}>Cancel</Button>
                    <Button onClick={handleSave} variant="contained" color="primary">Save</Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default EditAppointmentModal;
