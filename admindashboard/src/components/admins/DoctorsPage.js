import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Accordion, AccordionSummary, AccordionDetails, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box, Button, Card, CardContent, Grid } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useNavigate } from 'react-router-dom';

const DoctorsPage = () => {
    const [departments, setDepartments] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDepartmentsAndDoctors = async () => {
            try {
                const [departmentsResponse, doctorsResponse] = await Promise.all([
                    axios.get('http://localhost:8080/api/v1/departments/list'),
                    axios.get('http://localhost:8080/api/v1/doctors/list')
                ]);

                setDepartments(departmentsResponse.data);
                setDoctors(doctorsResponse.data);
            } catch (error) {
                console.error('Error fetching departments and doctors', error);
            }
        };
        fetchDepartmentsAndDoctors();
    }, []);

    const handleBack = () => {
        navigate('/admindashboard');
    };

    const handleDoctorClick = (doctorId) => {
        navigate(`/doctors/${doctorId}`);
    };

    return (
        <Box sx={{ padding: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                <Typography variant="h4" gutterBottom>
                    Departments and Doctors
                </Typography>
                <Button variant="contained" color="primary" onClick={handleBack}>
                    Back to Admin Dashboard
                </Button>
            </Box>
            <Grid container spacing={2}>
                {departments.map(department => (
                    <Grid item xs={12} md={6} lg={4} key={department.department_id}>
                        <Card>
                            <CardContent>
                                <Accordion>
                                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                        <Typography variant="h6">{department.department_name}</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
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
                                                    {doctors
                                                        .filter(doctor => doctor.department_id === department.department_id)
                                                        .map(doctor => (
                                                            <TableRow key={doctor.doctor_id} onClick={() => handleDoctorClick(doctor.doctor_id)} style={{ cursor: 'pointer' }}>
                                                                <TableCell>{doctor.doctor_id}</TableCell>
                                                                <TableCell>{doctor.doctor_name}</TableCell>
                                                                <TableCell>{doctor.doctor_email}</TableCell>
                                                                <TableCell>{doctor.doctor_phone}</TableCell>
                                                                <TableCell>{doctor.doctor_address}</TableCell>
                                                            </TableRow>
                                                        ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </AccordionDetails>
                                </Accordion>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default DoctorsPage;
