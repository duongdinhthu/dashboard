import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const PatientsPage = () => {
    const [patients, setPatients] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/v1/patients/list');
                setPatients(response.data);
            } catch (error) {
                console.error('Error fetching patients', error);
            }
        };
        fetchPatients();
    }, []);

    const handleBack = () => {
        navigate('/admindashboard');
    };

    return (
        <Box sx={{ padding: 4 }}>
            <Typography variant="h4" gutterBottom>
                Total Patients
            </Typography>
            <Button variant="contained" color="primary" onClick={handleBack} sx={{ mb: 2 }}>
                Back to Admin Dashboard
            </Button>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Phone</TableCell>
                            <TableCell>Address</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {patients.length > 0 ? (
                            patients.map((patient, index) => (
                                <TableRow key={index}>
                                    <TableCell>{patient.patient_id}</TableCell>
                                    <TableCell>{patient.patient_name}</TableCell>
                                    <TableCell>{patient.patient_email}</TableCell>
                                    <TableCell>{patient.patient_phone}</TableCell>
                                    <TableCell>{patient.patient_address}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} align="center">No patients found</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default PatientsPage;
