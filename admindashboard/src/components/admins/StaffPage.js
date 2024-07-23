import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const StaffPage = () => {
    const [staff, setStaff] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStaff = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/v1/staffs/list');
                setStaff(response.data);
            } catch (error) {
                console.error('Error fetching staff', error);
            }
        };
        fetchStaff();
    }, []);

    const handleBack = () => {
        navigate('/admindashboard');
    };

    return (
        <Box sx={{ padding: 4 }}>
            <Typography variant="h4" gutterBottom>
                Total Staff
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
                        {staff.length > 0 ? (
                            staff.map((staffMember, index) => (
                                <TableRow key={index}>
                                    <TableCell>{staffMember.staff_id}</TableCell>
                                    <TableCell>{staffMember.staff_name}</TableCell>
                                    <TableCell>{staffMember.staff_email}</TableCell>
                                    <TableCell>{staffMember.staff_phone}</TableCell>
                                    <TableCell>{staffMember.staff_address}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} align="center">No staff found</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default StaffPage;
