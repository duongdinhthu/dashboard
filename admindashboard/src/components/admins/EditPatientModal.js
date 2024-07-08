import React, { useState } from 'react';
import { Box, Button, Modal, TextField, Typography } from '@mui/material';
import axios from 'axios';

const EditPatientModal = ({ patient, onClose, onSave }) => {
    const [editedPatient, setEditedPatient] = useState({ ...patient });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedPatient((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        console.log("Edited Patient Data: ", editedPatient);

        axios.put(`http://localhost:8080/api/v1/patients/update`, editedPatient)
            .then((response) => {
                onSave(editedPatient);
                onClose();
            })
            .catch((error) => {
                console.error('Error updating patient', error);
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
                    Edit Patient
                </Typography>
                <TextField
                    label="ID"
                    name="patient_id"
                    value={editedPatient.patient_id}
                    onChange={handleChange}
                    fullWidth
                    sx={{ mb: 2 }}
                    disabled
                />
                <TextField
                    label="Name"
                    name="patient_name"
                    value={editedPatient.patient_name}
                    onChange={handleChange}
                    fullWidth
                    sx={{ mb: 2 }}
                />
                <TextField
                    label="Email"
                    name="patient_email"
                    value={editedPatient.patient_email}
                    onChange={handleChange}
                    fullWidth
                    sx={{ mb: 2 }}
                />
                <TextField
                    label="Phone"
                    name="patient_phone"
                    value={editedPatient.patient_phone}
                    onChange={handleChange}
                    fullWidth
                    sx={{ mb: 2 }}
                />
                <TextField
                    label="Address"
                    name="patient_address"
                    value={editedPatient.patient_address}
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

export default EditPatientModal;
