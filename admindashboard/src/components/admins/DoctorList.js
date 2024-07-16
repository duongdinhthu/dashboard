import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button } from '@mui/material';

const DoctorList = ({ searchResults, handleButtonClick, handleEditClick, handleDeleteClick }) => {
    const columns = [
        { field: 'doctor_id', headerName: 'ID', width: 100 },
        { field: 'doctor_name', headerName: 'Name', width: 150 },
        { field: 'doctor_phone', headerName: 'Phone', width: 150 },
        { field: 'doctor_address', headerName: 'Address', width: 200 },
        { field: 'doctor_email', headerName: 'Email', width: 200 },
        { field: 'working_status', headerName: 'Working Status', width: 150 },  // New column for working status
        {
            field: 'actions',
            headerName: 'Actions',
            width: 300,
            renderCell: (params) => (
                <Box>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleButtonClick(params.row.doctor_id)}
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
                        onClick={() => handleDeleteClick(params.row.doctor_id)}
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
                rows={searchResults.map(item => ({
                    ...item,
                    appointmentsList: item.appointmentsList || []
                }))}
                columns={columns}
                pageSize={5}
                getRowId={(row) => row.doctor_id}
            />
        </div>
    );
};

export default DoctorList;
