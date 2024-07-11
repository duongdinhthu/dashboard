import React, { useState, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import { IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SearchFields from './SearchFields';
import EditAppointmentModal from './EditAppointmentModal';
import AppointmentList from './AppointmentList';
import axios from 'axios';

const lightTheme = createTheme({
    palette: {
        mode: 'light',
    },
});

const StaffDashboard = ({ staffId }) => {
    const [fields, setFields] = useState({});
    const [searchFields, setSearchFields] = useState([{ field: '', value: '' }]);
    const [searchResults, setSearchResults] = useState([]);
    const [error, setError] = useState('');
    const [editItem, setEditItem] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:8080/api/v1/fields/appointments')
            .then(response => {
                const fieldsData = response.data;
                if (Array.isArray(fieldsData)) {
                    setFields({ Appointments: fieldsData });
                    setSearchFields([{ field: fieldsData[0]?.field || '', value: '' }]);
                } else {
                    setError('Error: Data is not an array.');
                }
            })
            .catch(error => {
                console.error('Error fetching fields', error);
                setError('Error fetching fields');
            });

        // Fetch appointments immediately
        axios.get('http://localhost:8080/api/v1/appointments/list')
            .then(response => {
                const flatData = response.data.map(item => ({
                    appointment_id: item.appointment_id,
                    patient_name: item.patient?.[0]?.patient_name,
                    doctor_name: item.doctor?.[0]?.doctor_name,
                    appointment_date: item.appointment_date,
                    medical_day: item.medical_day,
                    slot: item.slot,
                    status: item.status,
                    payment_name: item.payment_name,
                    price: item.price,
                }));
                setSearchResults(flatData);
            })
            .catch(error => {
                console.error('Error fetching appointments', error);
                setError('Error fetching appointments');
            });
    }, []);

    const handleSearch = () => {
        const params = searchFields.reduce((acc, searchField) => {
            acc[searchField.field] = searchField.value;
            return acc;
        }, {});

        axios.get('http://localhost:8080/api/v1/appointments/search', { params })
            .then(response => {
                const flatData = response.data.map(item => ({
                    appointment_id: item.appointment_id,
                    patient_name: item.patient?.[0]?.patient_name,
                    doctor_name: item.doctor?.[0]?.doctor_name,
                    appointment_date: item.appointment_date,
                    medical_day: item.medical_day,
                    slot: item.slot,
                    status: item.status,
                    payment_name: item.payment_name,
                    price: item.price,
                }));
                setSearchResults(flatData);
            })
            .catch(error => {
                console.error('Error fetching search results', error);
                setError('Error fetching search results');
            });
    };

    const handleAddSearchField = () => {
        setSearchFields([...searchFields, { field: fields.Appointments[0]?.field || '', value: '' }]);
    };

    const handleRemoveSearchField = (index) => {
        const newSearchFields = [...searchFields];
        newSearchFields.splice(index, 1);
        setSearchFields(newSearchFields);
    };

    const handleSearchFieldChange = (index, key, value) => {
        const newSearchFields = [...searchFields];
        newSearchFields[index][key] = value;
        setSearchFields(newSearchFields);
    };

    const handleEditClick = (item) => {
        setEditItem(item);
    };

    const handleEditModalClose = () => {
        setEditItem(null);
    };

    const handleSaveEdit = (updatedItem) => {
        setSearchResults((prevResults) =>
            prevResults.map((item) =>
                item.appointment_id === updatedItem.appointment_id
                    ? updatedItem
                    : item
            )
        );
        setEditItem(null);
    };

    return (
        <ThemeProvider theme={lightTheme}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <CssBaseline />
                <AppBar position="fixed">
                    <Toolbar>
                        <Typography variant="h6" noWrap component="div">
                            Staff Dashboard
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3, mt: 8 }}>
                    <Container>
                        {error && <Typography color="error">{error}</Typography>}
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <IconButton onClick={handleSearch} color="primary" disabled={searchFields.some(field => !field.field || !field.value)}>
                                <SearchIcon />
                            </IconButton>
                        </Box>
                        <SearchFields
                            searchFields={searchFields}
                            fields={{ Appointments: fields.Appointments || [] }}
                            selectedCategory="Appointments"
                            onFieldChange={handleSearchFieldChange}
                            onAddField={handleAddSearchField}
                            onRemoveField={handleRemoveSearchField}
                        />
                        <Typography variant="h6" gutterBottom>
                            Appointment Data
                        </Typography>
                        <AppointmentList
                            searchResults={searchResults}
                            handleEditClick={handleEditClick}
                        />
                    </Container>
                </Box>
                {editItem && (
                    <EditAppointmentModal
                        appointment={editItem}
                        onClose={handleEditModalClose}
                        onSave={handleSaveEdit}
                        staffId={staffId} // Truyền staffId vào EditAppointmentModal
                    />
                )}
            </Box>
        </ThemeProvider>
    );
};

export default StaffDashboard;
