import React, { useState } from 'react';
import { Box, Button, Modal, TextField, Typography } from '@mui/material';
import axios from 'axios';

const EditStaffModal = ({ staff, onClose, onSave }) => {
    const [editedStaff, setEditedStaff] = useState({ ...staff });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedStaff((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        const { appointmentsList, ...staffData } = editedStaff;

        axios.put(`http://localhost:8080/api/v1/staffs/update`, staffData)
            .then((response) => {
                onSave(editedStaff);
                onClose();
            })
            .catch((error) => {
                console.error('Error updating staff', error);
            });
    };

    return (
        <Modal
            open={true}
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
                    Edit Staff
                </Typography>
                <TextField
                    label="ID"
                    name="staff_id"
                    value={editedStaff.staff_id}
                    onChange={handleChange}
                    fullWidth
                    sx={{ mb: 2 }}
                    disabled
                />
                <TextField
                    label="Name"
                    name="staff_name"
                    value={editedStaff.staff_name}
                    onChange={handleChange}
                    fullWidth
                    sx={{ mb: 2 }}
                />
                <TextField
                    label="Phone"
                    name="staff_phone"
                    value={editedStaff.staff_phone}
                    onChange={handleChange}
                    fullWidth
                    sx={{ mb: 2 }}
                />
                <TextField
                    label="Address"
                    name="staff_address"
                    value={editedStaff.staff_address}
                    onChange={handleChange}
                    fullWidth
                    sx={{ mb: 2 }}
                />
                <TextField
                    label="Type"
                    name="staff_type"
                    value={editedStaff.staff_type}
                    onChange={handleChange}
                    fullWidth
                    sx={{ mb: 2 }}
                />
                <TextField
                    label="Status"
                    name="staff_status"
                    value={editedStaff.staff_status}
                    onChange={handleChange}
                    fullWidth
                    sx={{ mb: 2 }}
                />
                <Button onClick={handleSave} variant="contained" color="primary">
                    Save
                </Button>
                <Button onClick={onClose} variant="outlined" color="secondary" sx={{ ml: 2 }}>
                    Cancel
                </Button>
            </Box>
        </Modal>
    );
};

export default EditStaffModal;
