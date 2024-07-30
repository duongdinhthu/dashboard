import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar'; // Ensure the path to Sidebar is correct
import FeedbackListWithReply from './FeedbackListWithReply'; // Import FeedbackListWithReply component
import './DoctorsPage.css'; // Ensure the path to the CSS file is correct

const DoctorsPage = () => {
    const [departments, setDepartments] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [expanded, setExpanded] = useState(null);
    const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDepartmentsAndDoctors = async () => {
            try {
                const [departmentsResponse, doctorsResponse] = await Promise.all([
                    axios.get('http://localhost:8080/api/v1/departments/list'),
                    axios.get('http://localhost:8080/api/v1/doctors/list')
                ]);

                setDepartments(departmentsResponse.data);
                setDoctors(doctorsResponse.data);
            } catch (error) {
                console.error('Error fetching departments and doctors', error);
            }
        };
        fetchDepartmentsAndDoctors();
    }, []);

    const handleDoctorClick = (doctorId) => {
        navigate(`/doctors/${doctorId}`);
    };

    const handleOpenFeedbackModal = () => {
        setIsFeedbackModalOpen(true);
    };

    const handleCloseFeedbackModal = () => {
        setIsFeedbackModalOpen(false);
    };

    const handleOpenDoctorsPage = () => {
        navigate('/doctors');
    };

    const handleOpenPatientsPage = () => {
        navigate('/patients');
    };

    const handleOpenAppointmentsPage = () => {
        navigate('/appointments');
    };

    const handleOpenStaffPage = () => {
        navigate('/staff');
    };

    const handleAccordionToggle = (departmentId) => {
        setExpanded(expanded === departmentId ? null : departmentId);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSearch = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/v1/doctors/search-new', {
                params: { keyword: searchQuery }
            });
            setSearchResults(response.data);
            if (response.data.length > 0) {
                handleDoctorClick(response.data[0].doctor_id);
            } else {
                alert('No doctors found');
            }
        } catch (error) {
            console.error('Error searching doctors', error);
        }
    };

    return (
        <div className="doctors-page-container">
            <Sidebar
                onInboxClick={handleOpenFeedbackModal}
                handleOpenDoctorsPage={handleOpenDoctorsPage}
                handleOpenPatientsPage={handleOpenPatientsPage}
                handleOpenAppointmentsPage={handleOpenAppointmentsPage}
                handleOpenStaffPage={handleOpenStaffPage}
                className="sidebar"
            />
            <div className="content-container">
                <div className="header-container">
                    <h2>Departments & Doctors</h2>
                    <div className="search">
                        <input
                            type="text"
                            placeholder="Search Doctor by Name or Email"
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                        <button onClick={handleSearch}>Search</button>
                    </div>
                </div>
                <div className="grid-container">
                    {departments.map(department => (
                        <div className="grid-item" key={department.department_id}>
                            <div className="department-card">
                                <div className="accordion">
                                    <div className="accordion-summary" onClick={() => handleAccordionToggle(department.department_id)}>
                                        <h6>{department.department_name}</h6>
                                        <span><img width="30" height="30" src="https://img.icons8.com/ios/50/004b91/view-file.png" alt="view-file"/></span>
                                    </div>
                                    {expanded === department.department_id && (
                                        <div className="accordion-details-overlay">
                                            <div className="overlay-content">
                                                <button className="close-button" onClick={() => handleAccordionToggle(null)}>X</button>
                                                <div className="table-container">
                                                    <table>
                                                        <thead>
                                                        <tr>
                                                            <th>ID</th>
                                                            <th>Name</th>
                                                            <th>Email</th>
                                                            <th>Phone</th>
                                                            <th>Address</th>
                                                        </tr>
                                                        </thead>
                                                        <tbody>
                                                        {doctors
                                                            .filter(doctor => doctor.department_id === department.department_id)
                                                            .map(doctor => (
                                                                <tr key={doctor.doctor_id} onClick={() => handleDoctorClick(doctor.doctor_id)} className="doctor-row" style={{ cursor: 'pointer' }}>
                                                                    <td>{doctor.doctor_id}</td>
                                                                    <td>{doctor.doctor_name}</td>
                                                                    <td>{doctor.doctor_email}</td>
                                                                    <td>{doctor.doctor_phone}</td>
                                                                    <td>{doctor.doctor_address}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {isFeedbackModalOpen && (
                    <div className="feedback-modal">
                        <FeedbackListWithReply onClose={handleCloseFeedbackModal} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default DoctorsPage;
