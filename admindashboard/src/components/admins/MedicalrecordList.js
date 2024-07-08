import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button } from '@mui/material';

const MedicalrecordList = ({ searchResults, handleEditClick, handleDeleteClick }) => {
    const columns = [
        { field: 'record_id', headerName: 'ID', width: 100 },
        { field: 'patient_name', headerName: 'Patient Name', width: 150 },
        { field: 'doctor_name', headerName: 'Doctor Name', width: 150 },
        { field: 'symptoms', headerName: 'Symptoms', width: 200 },
        { field: 'diagnosis', headerName: 'Diagnosis', width: 200 },
        { field: 'treatment', headerName: 'Treatment', width: 200 },
        { field: 'prescription', headerName: 'Prescription', width: 200 },
        { field: 'follow_up_date', headerName: 'Follow Up Date', width: 150 },
        { field: 'test_urine', headerName: 'Test Urine', width: 150 },
        { field: 'test_blood', headerName: 'Test Blood', width: 150 },
        { field: 'x_ray', headerName: 'X-Ray', width: 150 },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 300,
            renderCell: (params) => (
                <Box>
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
                        onClick={() => handleDeleteClick(params.row.record_id)}
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
                getRowId={(row) => row.record_id}
            />
        </div>
    );
};

export default MedicalrecordList;
