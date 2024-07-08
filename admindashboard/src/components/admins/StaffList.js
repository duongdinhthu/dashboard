import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button } from '@mui/material';

const StaffList = ({ searchResults, handleButtonClick, handleEditClick, handleDeleteClick }) => {
    const columns = [
        { field: 'staff_id', headerName: 'ID', width: 100 },
        { field: 'staff_name', headerName: 'Name', width: 150 },
        { field: 'staff_phone', headerName: 'Phone', width: 150 },
        { field: 'staff_address', headerName: 'Address', width: 200 },
        { field: 'staff_type', headerName: 'Type', width: 150 },
        { field: 'staff_status', headerName: 'Status', width: 150 },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 300,
            renderCell: (params) => (
                <Box>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleButtonClick(params.row.staff_id)}
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
                        onClick={() => handleDeleteClick(params.row.staff_id)}
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
                getRowId={(row) => row.staff_id}
            />
        </div>
    );
};

export default StaffList;
