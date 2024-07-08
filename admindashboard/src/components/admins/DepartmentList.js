import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Paper } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const DepartmentList = ({ searchResults, handleEditClick, handleDeleteClick }) => {
    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Department Name</TableCell>
                        <TableCell>Location</TableCell>
                        <TableCell>Doctor Count</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {searchResults.map((department) => (
                        <TableRow key={department.department_id}>
                            <TableCell>{department.department_name}</TableCell>
                            <TableCell>{department.location}</TableCell>
                            <TableCell>{department.doctor_count}</TableCell>
                            <TableCell>
                                <IconButton onClick={() => handleEditClick(department)}>
                                    <EditIcon />
                                </IconButton>
                                <IconButton onClick={() => handleDeleteClick(department.department_id)}>
                                    <DeleteIcon />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default DepartmentList;
