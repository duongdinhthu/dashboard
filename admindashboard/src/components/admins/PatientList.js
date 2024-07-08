import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button } from '@mui/material';

const PatientList = ({ searchResults = [], handleButtonClick, handleEditClick, handleDeleteClick }) => {
    const columns = [
        { field: 'patient_id', headerName: 'ID', width: 100 },
        { field: 'patient_name', headerName: 'Name', width: 150 },
        { field: 'patient_email', headerName: 'Email', width: 200 },
        { field: 'patient_phone', headerName: 'Phone', width: 150 },
        { field: 'patient_address', headerName: 'Address', width: 200 },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 300,
            renderCell: (params) => (
                <Box>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleButtonClick(params.row.patient_id)}
                    >
                        View Appointments
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleEditClick(params.row)}
                        style={{ marginLeft: 8 }}
                    >
                        Edit
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleDeleteClick(params.row.patient_id)}
                        style={{ marginLeft: 8 }}
                    >
                        Delete
                    </Button>
                </Box>
            ),
        },
    ];

    return (
        <div style={{ height: 400, width: '100%' }}>
            <DataGrid
                rows={searchResults}
                columns={columns}
                pageSize={5}
                getRowId={(row) => row.patient_id}
            />
        </div>
    );
};

export default PatientList;
