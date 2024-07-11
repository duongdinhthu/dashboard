import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import {Box, Button} from '@mui/material';

const MedicalrecordList = ({ searchResults, handleEditClick, handleDeleteClick }) => {
    const columns = [
        {field: 'record_id', headerName: 'ID', width: 90},
        {field: 'patient_name', headerName: 'Patient Name', width: 150},
        {field: 'doctor_name', headerName: 'Doctor Name', width: 150},
        {field: 'symptoms', headerName: 'Symptoms', width: 150},
        {field: 'diagnosis', headerName: 'Diagnosis', width: 150},
        {field: 'treatment', headerName: 'Treatment', width: 150},
        {field: 'prescription', headerName: 'Prescription', width: 150},
        {field: 'follow_up_date', headerName: 'Follow Up Date', width: 150},
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            renderCell: (params) => (
                <Box>
                    <Button onClick={() => handleEditClick(params.row)}>Edit</Button>
                    <Button onClick={() => handleDeleteClick(params.row.record_id)}>Delete</Button>
                </Box>
            ),
        },
    ];

    const rows = searchResults.map((row) => ({
        ...row,
        id: row.record_id, // Assigning record_id as the unique id for each row
    }));

    return (
        <Box sx={{ height: 400, width: '100%' }}>
            <DataGrid rows={rows} columns={columns} pageSize={5} rowsPerPageOptions={[5]} />
        </Box>
    );
};

export default MedicalrecordList;
