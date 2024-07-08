import React, { useState, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import { IconButton, TextField, MenuItem, Button, List, ListItem, ListItemText, Modal, Grid } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import Login from './Login';
import SearchFields from "./SearchFields";
import MedicalrecordList from "./MedicalrecordList";
import EditMedicalrecordModal from './EditMedicalrecordModal';

const lightTheme = createTheme({
    palette: {
        mode: 'light',
    },
});

const categories = ['Medicalrecords'];

const DoctorDashboard = () => {
    const [fields, setFields] = useState({});
    const [searchFields, setSearchFields] = useState([{ field: '', value: '' }]);
    const [searchResults, setSearchResults] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('Medicalrecords');
    const [error, setError] = useState('');
    const [editItem, setEditItem] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [doctor, setDoctor] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchDate, setSearchDate] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newRecord, setNewRecord] = useState({
        patient_id: '',
        doctor_id: '',
        symptoms: '',
        diagnosis: '',
        treatment: '',
        prescription: '',
        follow_up_date: ''
    });

    useEffect(() => {
        if (selectedCategory) {
            axios.get(`http://localhost:8080/api/v1/fields/${selectedCategory.toLowerCase()}`)
                .then(response => {
                    const fieldsData = response.data;
                    setFields(prevFields => ({
                        ...prevFields,
                        [selectedCategory]: fieldsData
                    }));
                    setSearchFields([{ field: fieldsData[0]?.field || '', value: '' }]);
                })
                .catch(error => {
                    console.error('Error fetching fields', error);
                    setError('Error fetching fields');
                });
        }
    }, [selectedCategory]);

    useEffect(() => {
        if (isLoggedIn && doctor) {
            fetchAppointments(doctor.doctor_id);
        }
    }, [isLoggedIn, doctor]);

    const fetchAppointments = (doctorId) => {
        axios.get(`http://localhost:8080/api/v1/doctors/${doctorId}/appointments`)
            .then(response => {
                setAppointments(response.data);
            })
            .catch(error => {
                console.error('Error fetching appointments', error);
                setError('Error fetching appointments');
            });
    };

    const handleSearch = () => {
        const params = {
            medical_day: searchDate,
            doctor_id: doctor.doctor_id
        };

        axios.get(`http://localhost:8080/api/v1/appointments/search`, { params })
            .then(response => {
                setAppointments(response.data);
            })
            .catch(error => {
                console.error('Error fetching search results', error);
                setError('Error fetching search results');
            });
    };

    const handleAddSearchField = () => {
        setSearchFields([...searchFields, { field: fields[selectedCategory][0]?.field || '', value: '' }]);
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

    const handleDeleteClick = (itemId) => {
        const payload = {
            record_id: itemId
        };

        axios.delete(`http://localhost:8080/api/v1/${selectedCategory.toLowerCase()}/delete`, { data: payload })
            .then(response => {
                setSearchResults(searchResults.filter(item => item.record_id !== itemId));
            })
            .catch(error => {
                console.error('Error deleting item', error);
                setError('Error deleting item');
            });
    };

    const handleEditModalClose = () => {
        setEditItem(null);
    };

    const handleSave = (updatedItem) => {
        const payload = {
            record_id: updatedItem.record_id,
            symptoms: updatedItem.symptoms,
            diagnosis: updatedItem.diagnosis,
            treatment: updatedItem.treatment,
            prescription: updatedItem.prescription,
        };

        axios.put(`http://localhost:8080/api/v1/medicalrecords/update`, payload)
            .then(response => {
                setSearchResults((prevResults) =>
                    prevResults.map((item) =>
                        item.record_id === updatedItem.record_id ? updatedItem : item
                    )
                );
                setEditItem(null);
            })
            .catch(error => {
                console.error('Error updating item', error);
                setError('Error updating item');
            });
    };

    const handleLogin = (doctor) => {
        setIsLoggedIn(true);
        setDoctor(doctor);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    const handleAddModalOpen = () => {
        setIsAddModalOpen(true);
        setNewRecord({
            patient_id: '',
            doctor_id: doctor.doctor_id,
            symptoms: '',
            diagnosis: '',
            treatment: '',
            prescription: '',
            follow_up_date: ''
        });
    };

    const handleAddModalClose = () => {
        setIsAddModalOpen(false);
    };

    const handleNewRecordChange = (key, value) => {
        setNewRecord(prevRecord => ({
            ...prevRecord,
            [key]: value,
        }));
    };

    const handleAddNewRecord = () => {
        axios.post(`http://localhost:8080/api/v1/medicalrecords/insert`, newRecord)
            .then(response => {
                // Thay vì reload lại trang, chỉ cần cập nhật state
                setAppointments([...appointments, response.data]);
                setIsAddModalOpen(false); // Đóng modal
                setNewRecord({
                    patient_id: '',
                    doctor_id: doctor.doctor_id,
                    symptoms: '',
                    diagnosis: '',
                    treatment: '',
                    prescription: '',
                    follow_up_date: ''
                });
            })
            .catch(error => {
                console.error('Error adding new medical record', error);
                setError('Error adding new medical record');
            });
    };


    const getTimeFromSlot = (slot) => {
        const slotToTime = {
            1: "08:00 - 09:00",
            2: "09:00 - 10:00",
            3: "10:00 - 11:00",
            4: "11:00 - 12:00",
            5: "13:00 - 14:00",
            6: "14:00 - 15:00",
            7: "15:00 - 16:00",
            8: "16:00 - 17:00"
        };
        return slotToTime[slot] || "Unknown Time";
    };

    if (!isLoggedIn) {
        return <Login onLogin={handleLogin} />;
    }

    return (
        <ThemeProvider theme={lightTheme}>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                    <Toolbar>
                        <Typography variant="h6" noWrap component="div">
                            Doctor Dashboard
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}>
                    <Toolbar />
                    <Container>
                        {error && <Typography color="error">{error}</Typography>}
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <TextField
                                select
                                label="Category"
                                value={selectedCategory}
                                onChange={(e) => {
                                    setSelectedCategory(e.target.value);
                                    setSearchFields([{ field: '', value: '' }]);
                                    setSearchResults([]);
                                    setError('');
                                }}
                                sx={{ mr: 2 }}
                            >
                                {categories.map((category) => (
                                    <MenuItem key={category} value={category}>
                                        {category}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <IconButton onClick={handleAddModalOpen} color="primary" sx={{ ml: 2 }}>
                                <AddIcon />
                            </IconButton>
                        </Box>
                        <SearchFields
                            searchFields={searchFields}
                            fields={fields}
                            selectedCategory={selectedCategory}
                            onFieldChange={handleSearchFieldChange}
                            onAddField={handleAddSearchField}
                            onRemoveField={handleRemoveSearchField}
                        />
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <IconButton onClick={handleSearch} color="primary" disabled={searchFields.some(field => !field.field || !field.value)}>
                                <SearchIcon />
                            </IconButton>
                        </Box>
                        <Typography variant="h6" gutterBottom>
                            {selectedCategory} Data
                        </Typography>
                        {selectedCategory === 'Medicalrecords' && (
                            <MedicalrecordList
                                searchResults={searchResults}
                                handleEditClick={handleEditClick}
                                handleDeleteClick={handleDeleteClick}
                            />
                        )}
                        <Typography variant="h6" gutterBottom>
                            Appointments
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <TextField
                                label="Search Date"
                                type="date"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                value={searchDate}
                                onChange={(e) => setSearchDate(e.target.value)}
                                sx={{ mr: 2 }}
                            />
                            <IconButton onClick={handleSearch} color="primary" disabled={!searchDate}>
                                <SearchIcon />
                            </IconButton>
                        </Box>
                        <List>
                            {appointments.map((appointment, index) => (
                                <ListItem key={index} button onClick={() => setIsModalOpen(true)}>
                                    <ListItemText
                                        primary={`Patient: ${appointment.patient?.[0]?.patient_name || 'N/A'}`}
                                        secondary={`Medical Day: ${new Date(appointment.medical_day).toLocaleDateString()} - Time: ${getTimeFromSlot(appointment.slot)}`}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Container>
                </Box>
                <Modal
                    open={isModalOpen}
                    onClose={handleModalClose}
                    aria-labelledby="modal-title"
                    aria-describedby="modal-description"
                >
                    <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        border: '2px solid #000',
                        boxShadow: 24,
                        p: 4
                    }}>
                        <Typography id="modal-title" variant="h6" component="h2">
                            Appointment Details
                        </Typography>
                        <Typography id="modal-description" sx={{ mt: 2 }}>
                            {/* Hiển thị thông tin chi tiết của cuộc hẹn */}
                        </Typography>
                        <Button onClick={handleModalClose} color="primary">
                            Close
                        </Button>
                    </Box>
                </Modal>
                <Modal
                    open={isAddModalOpen}
                    onClose={handleAddModalClose}
                    aria-labelledby="add-modal-title"
                    aria-describedby="add-modal-description"
                >
                    <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        border: '2px solid #000',
                        boxShadow: 24,
                        p: 4
                    }}>
                        <Typography id="add-modal-title" variant="h6" component="h2">
                            Add New Medical Record
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    label="Patient ID"
                                    value={newRecord.patient_id}
                                    onChange={(e) => handleNewRecordChange('patient_id', e.target.value)}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Symptoms"
                                    value={newRecord.symptoms}
                                    onChange={(e) => handleNewRecordChange('symptoms', e.target.value)}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Diagnosis"
                                    value={newRecord.diagnosis}
                                    onChange={(e) => handleNewRecordChange('diagnosis', e.target.value)}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Treatment"
                                    value={newRecord.treatment}
                                    onChange={(e) => handleNewRecordChange('treatment', e.target.value)}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Prescription"
                                    value={newRecord.prescription}
                                    onChange={(e) => handleNewRecordChange('prescription', e.target.value)}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Follow-up Date"
                                    type="date"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    value={newRecord.follow_up_date}
                                    onChange={(e) => handleNewRecordChange('follow_up_date', e.target.value)}
                                    fullWidth
                                />
                            </Grid>
                        </Grid>
                        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                            <Button onClick={handleAddModalClose} color="secondary" sx={{ mr: 1 }}>
                                Cancel
                            </Button>
                            <Button onClick={handleAddNewRecord} color="primary" variant="contained">
                                Add
                            </Button>
                        </Box>
                    </Box>
                </Modal>
                {selectedCategory === 'Medicalrecords' && editItem && (
                    <EditMedicalrecordModal
                        medicalRecord={editItem}
                        onClose={handleEditModalClose}
                        onSave={handleSave}
                    />
                )}
            </Box>
        </ThemeProvider>
    );
};

export default DoctorDashboard;
