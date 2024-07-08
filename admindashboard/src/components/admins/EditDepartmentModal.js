import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';

const EditDepartmentModal = ({ department, onClose, onSave }) => {
    const [departmentData, setDepartmentData] = useState(department);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDepartmentData({
            ...departmentData,
            [name]: value,
        });
    };

    const handleSave = () => {
        onSave(departmentData);
    };

    return (
        <Modal
            open={!!department}
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
                    Edit Department
                </Typography>
                <TextField
                    margin="normal"
                    fullWidth
                    label="Department Name"
                    name="department_name"
                    value={departmentData.department_name || ''}
                    onChange={handleChange}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    label="Location"
                    name="location"
                    value={departmentData.location || ''}
                    onChange={handleChange}
                />
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                    <Button variant="contained" color="primary" onClick={handleSave}>
                        Save
                    </Button>
                    <Button variant="contained" color="secondary" onClick={onClose}>
                        Cancel
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default EditDepartmentModal;
