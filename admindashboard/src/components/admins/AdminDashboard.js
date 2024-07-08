import React, { useState, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import { IconButton, TextField, MenuItem, Modal, Button, Grid } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import Sidebar from './Sidebar';
import SearchFields from './SearchFields';
import EditPatientModal from './EditPatientModal';
import EditStaffModal from './EditStaffModal';
import EditDoctorModal from './EditDoctorModal';
import EditAppointmentModal from './EditAppointmentModal';
import EditMedicalrecordModal from './EditMedicalrecordModal';
import EditDepartmentModal from './EditDepartmentModal';
import PatientList from './PatientList';
import StaffList from './StaffList';
import DoctorList from './DoctorList';
import AppointmentList from './AppointmentList';
import MedicalrecordList from './MedicalrecordList';
import DepartmentList from './DepartmentList';
import FeedbackListWithReply from './FeedbackListWithReply';
import axios from 'axios';

const lightTheme = createTheme({
    palette: {
        mode: 'light',
    },
});

const categories = ['Patients', 'Staffs', 'Doctors', 'Appointments', 'Departments', 'Medicalrecords'];

const fetchAllFields = async (setFields, setError) => {
    try {
        const requests = categories.map(category =>
            axios.get(`http://localhost:8080/api/v1/fields/${category.toLowerCase()}`)
        );
        const responses = await Promise.all(requests);
        const fieldsData = responses.reduce((acc, response, index) => {
            acc[categories[index]] = response.data;
            return acc;
        }, {});
        setFields(fieldsData);
    } catch (error) {
        console.error('Error fetching fields', error);
        setError('Error fetching fields');
    }
};

const AdminDashboard = () => {
    const [fields, setFields] = useState({});
    const [searchFields, setSearchFields] = useState([{ field: '', value: '' }]);
    const [searchResults, setSearchResults] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [error, setError] = useState('');
    const [appointments, setAppointments] = useState([]);
    const [open, setOpen] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newData, setNewData] = useState({});
    const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false); // state cho modal feedback

    useEffect(() => {
        fetchAllFields(setFields, setError);
    }, []);

    useEffect(() => {
        if (selectedCategory && fields[selectedCategory]) {
            setSearchFields([{ field: fields[selectedCategory][0]?.field || '', value: '' }]);
        }
    }, [selectedCategory, fields]);

    const handleSearch = () => {
        const params = searchFields.reduce((acc, searchField) => {
            acc[searchField.field] = searchField.value;
            return acc;
        }, {});

        axios.get(`http://localhost:8080/api/v1/${selectedCategory.toLowerCase()}/search`, { params })
            .then(response => {
                const flatData = response.data.map(item => {
                    if (selectedCategory === 'Patients') {
                        return {
                            patient_id: item.patient_id,
                            patient_name: item.patient_name,
                            patient_email: item.patient_email,
                            patient_phone: item.patient_phone,
                            patient_address: item.patient_address,
                            appointment_count: item.appointmentsList?.length || 0,
                            medicalrecord_count: item.medicalrecordsList?.length || 0,
                            appointmentsList: item.appointmentsList,
                        };
                    } else if (selectedCategory === 'Staffs') {
                        return {
                            staff_id: item.staff_id,
                            staff_name: item.staff_name,
                            staff_phone: item.staff_phone,
                            staff_address: item.staff_address,
                            staff_type: item.staff_type,
                            staff_status: item.staff_status,
                            appointmentsList: item.appointmentsList,
                        };
                    } else if (selectedCategory === 'Doctors') {
                        return {
                            doctor_id: item.doctor_id,
                            doctor_name: item.doctor_name,
                            doctor_phone: item.doctor_phone,
                            doctor_address: item.doctor_address,
                            doctor_email: item.doctor_email,
                            department_id: item.department_id,
                            appointment_count: item.appointmentsList?.length || 0,
                            medicalrecord_count: item.medicalrecordsList?.length || 0,
                            appointmentsList: item.appointmentsList,
                        };
                    } else if (selectedCategory === 'Appointments') {
                        return {
                            appointment_id: item.appointment_id,
                            patient_name: item.patient?.[0]?.patient_name,
                            doctor_name: item.doctor?.[0]?.doctor_name,
                            appointment_date: item.appointment_date,
                            slot: item.slot,
                            status: item.status,
                            payment_name: item.payment_name,
                            price: item.price,
                        };
                    } else if (selectedCategory === 'Medicalrecords') {
                        return {
                            record_id: item.record_id,
                            patient_name: item.patients?.[0]?.patient_name,
                            doctor_name: item.doctors?.[0]?.doctor_name,
                            symptoms: item.symptoms,
                            diagnosis: item.diagnosis,
                            treatment: item.treatment,
                            prescription: item.prescription,
                            follow_up_date: item.follow_up_date,
                        };
                    } else if (selectedCategory === 'Departments') {
                        return {
                            department_id: item.department_id,
                            department_name: item.department_name,
                            location: item.location,
                            doctor_count: item.doctorsList?.length || 0,
                        };
                    }
                    return item;
                });
                setSearchResults(flatData);
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

    const handleButtonClick = async (itemId) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/v1/${selectedCategory.toLowerCase()}/${itemId}/appointments`);
            setAppointments(response.data);
            setOpen(true);
        } catch (error) {
            console.error('Error fetching appointments', error);
            setError('Error fetching appointments');
        }
    };

    const handleClose = () => {
        setOpen(false);
        setAppointments([]);
    };

    const handleEditClick = (item) => {
        setEditItem(item);
    };

    const handleDeleteClick = (itemId) => {
        const payload = {};
        if (selectedCategory === 'Medicalrecords') {
            payload.record_id = itemId;
        } else {
            payload[`${selectedCategory.toLowerCase().slice(0, -1)}_id`] = itemId;
        }

        axios.delete(`http://localhost:8080/api/v1/${selectedCategory.toLowerCase()}/delete`, { data: payload })
            .then(response => {
                setSearchResults(searchResults.filter(item => item[`${selectedCategory.toLowerCase().slice(0, -1)}_id`] !== itemId));
            })
            .catch(error => {
                console.error('Error deleting item', error);
                setError('Error deleting item');
            });
    };

    const handleEditModalClose = () => {
        setEditItem(null);
    };

    const handleAddModalOpen = () => {
        setIsAddModalOpen(true);
        setNewData({});
    };

    const handleAddModalClose = () => {
        setIsAddModalOpen(false);
    };

    const handleNewDataChange = (key, value) => {
        setNewData(prevData => ({
            ...prevData,
            [key]: value,
        }));
    };

    const handleAddNewData = () => {
        const dataToSend = { ...newData };
        Object.keys(dataToSend).forEach(key => {
            if (key.toLowerCase().includes('id')) {
                delete dataToSend[key];
            }
        });

        axios.post(`http://localhost:8080/api/v1/${selectedCategory.toLowerCase()}/insert`, dataToSend)
            .then(response => {
                window.location.reload();
            })
            .catch(error => {
                console.error('Error adding new data', error);
                setError('Error adding new data');
            });
    };

    const handleSaveEdit = (updatedItem) => {
        setSearchResults((prevResults) =>
            prevResults.map((item) =>
                item[`${selectedCategory.toLowerCase().slice(0, -1)}_id`] === updatedItem[`${selectedCategory.toLowerCase().slice(0, -1)}_id`]
                    ? updatedItem
                    : item
            )
        );
        setEditItem(null);
    };

    const handleInboxClick = () => {
        setSelectedCategory('Feedbacks');
        setIsFeedbackModalOpen(true);
    };


    return (
        <ThemeProvider theme={lightTheme}>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                    <Toolbar>
                        <Typography variant="h6" noWrap component="div">
                            Admin Dashboard
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Sidebar setSelectedCategory={setSelectedCategory} onInboxClick={handleInboxClick} />
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
                        {selectedCategory === 'Patients' && (
                            <PatientList
                                searchResults={searchResults}
                                handleButtonClick={handleButtonClick}
                                handleEditClick={handleEditClick}
                                handleDeleteClick={handleDeleteClick}
                            />
                        )}
                        {selectedCategory === 'Staffs' && (
                            <StaffList
                                searchResults={searchResults}
                                handleButtonClick={handleButtonClick}
                                handleEditClick={handleEditClick}
                                handleDeleteClick={handleDeleteClick}
                            />
                        )}
                        {selectedCategory === 'Doctors' && (
                            <DoctorList
                                searchResults={searchResults}
                                handleButtonClick={handleButtonClick}
                                handleEditClick={handleEditClick}
                                handleDeleteClick={handleDeleteClick}
                            />
                        )}
                        {selectedCategory === 'Appointments' && (
                            <AppointmentList
                                searchResults={searchResults}
                                handleEditClick={handleEditClick}
                                handleDeleteClick={handleDeleteClick}
                            />
                        )}
                        {selectedCategory === 'Medicalrecords' && (
                            <MedicalrecordList
                                searchResults={searchResults}
                                handleEditClick={handleEditClick}
                                handleDeleteClick={handleDeleteClick}
                            />
                        )}
                        {selectedCategory === 'Departments' && (
                            <DepartmentList
                                searchResults={searchResults}
                                handleEditClick={handleEditClick}
                                handleDeleteClick={handleDeleteClick}
                            />
                        )}
                        {selectedCategory === 'Feedbacks' && isFeedbackModalOpen && (
                            <FeedbackListWithReply onClose={() => setIsFeedbackModalOpen(false)} />
                        )}

                    </Container>
                </Box>
                <Modal
                    open={open}
                    onClose={handleClose}
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
                            Appointments
                        </Typography>
                        {appointments.length > 0 ? (
                            <ul>
                                {appointments.map((appointment, index) => (
                                    <li key={index}>
                                        Date: {new Date(appointment.appointment_date).toLocaleDateString()}, Time: {appointment.slot}, Status: {appointment.status}, Doctor: {appointment.doctor[0].doctor_name}, Payment: {appointment.payment_name}, Price: {appointment.price}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <Typography>No appointments available.</Typography>
                        )}
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
                            Add New {selectedCategory.slice(0, -1)}
                        </Typography>
                        <Grid container spacing={2}>
                            {fields[selectedCategory]?.filter(field => !field.field.toLowerCase().includes('id')).map((field) => (
                                <Grid item xs={12} key={field.field}>
                                    <TextField
                                        label={field.field}
                                        value={newData[field.field] || ''}
                                        onChange={(e) => handleNewDataChange(field.field, e.target.value)}
                                        type={field.field.toLowerCase().includes('date') ? 'date' : 'text'}
                                        fullWidth
                                    />
                                </Grid>
                            ))}
                        </Grid>
                        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                            <Button onClick={handleAddModalClose} color="secondary" sx={{ mr: 1 }}>
                                Cancel
                            </Button>
                            <Button onClick={handleAddNewData} color="primary" variant="contained">
                                Add
                            </Button>
                        </Box>
                    </Box>
                </Modal>
                {selectedCategory === 'Patients' && editItem && (
                    <EditPatientModal
                        patient={editItem}
                        onClose={handleEditModalClose}
                        onSave={handleSaveEdit}
                    />
                )}
                {selectedCategory === 'Staffs' && editItem && (
                    <EditStaffModal
                        staff={editItem}
                        onClose={handleEditModalClose}
                        onSave={handleSaveEdit}
                    />
                )}
                {selectedCategory === 'Doctors' && editItem && (
                    <EditDoctorModal
                        doctor={editItem}
                        onClose={handleEditModalClose}
                        onSave={handleSaveEdit}
                    />
                )}
                {selectedCategory === 'Appointments' && editItem && (
                    <EditAppointmentModal
                        appointment={editItem}
                        onClose={handleEditModalClose}
                        onSave={handleSaveEdit}
                    />
                )}
                {selectedCategory === 'Medicalrecords' && editItem && (
                    <EditMedicalrecordModal
                        medicalRecord={editItem}
                        onClose={handleEditModalClose}
                        onSave={handleSaveEdit}
                    />
                )}
                {selectedCategory === 'Departments' && editItem && (
                    <EditDepartmentModal
                        department={editItem}
                        onClose={handleEditModalClose}
                        onSave={handleSaveEdit}
                    />
                )}
            </Box>
        </ThemeProvider>
    );
};

export default AdminDashboard;
