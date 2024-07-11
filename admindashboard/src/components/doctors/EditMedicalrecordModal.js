import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';
import axios from 'axios';

const EditMedicalrecordModal = ({ medicalRecord, onClose, onSave }) => {
    const [formData, setFormData] = useState(medicalRecord);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSave = () => {
        axios.put('http://localhost:8080/api/v1/medicalrecords/update', formData)
            .then(response => {
                onSave(formData);
            })
            .catch(error => {
                console.error('Error updating medical record', error);
            });
    };

    return (
        <Modal open onClose={onClose}>
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
                <Typography variant="h6" component="h2">
                    Edit Medical Record
                </Typography>
                <TextField
                    name="symptoms"
                    label="Symptoms"
                    value={formData.symptoms}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    name="diagnosis"
                    label="Diagnosis"
                    value={formData.diagnosis}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    name="treatment"
                    label="Treatment"
                    value={formData.treatment}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    name="prescription"
                    label="Prescription"
                    value={formData.prescription}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    name="follow_up_date"
                    label="Follow Up Date"
                    type="date"
                    value={formData.follow_up_date}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <Button onClick={handleSave} color="primary" variant="contained">
                    Save
                </Button>
            </Box>
        </Modal>
    );
};

export default EditMedicalrecordModal;
