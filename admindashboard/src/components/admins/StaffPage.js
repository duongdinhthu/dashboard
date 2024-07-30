import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar'; // Đảm bảo đường dẫn đúng đến component Sidebar
import FeedbackListWithReply from './FeedbackListWithReply'; // Import FeedbackListWithReply component
import './StaffPage.css'; // Đảm bảo đường dẫn đúng đến tệp CSS của bạn

const StaffPage = () => {
    const [staff, setStaff] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStaff = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/v1/staffs/list');
                setStaff(response.data);
            } catch (error) {
                console.error('Error fetching staff', error);
            }
        };
        fetchStaff();
    }, []);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSearch = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/v1/staffs/search-new', {
                params: { keyword: searchQuery }
            });
            setStaff(response.data);
        } catch (error) {
            console.error('Error searching staff', error);
        }
    };

    const handleStaffClick = (staffId) => {
        navigate(`/staff/${staffId}`);
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

    return (
        <div className="staff-page">
            <Sidebar
                onInboxClick={handleOpenFeedbackModal}
                handleOpenDoctorsPage={handleOpenDoctorsPage}
                handleOpenPatientsPage={handleOpenPatientsPage}
                handleOpenAppointmentsPage={handleOpenAppointmentsPage}
                handleOpenStaffPage={handleOpenStaffPage}
            />
            <div className="content">
                <div className="header">
                    <h2>Staffs List</h2>
                    <div className="search">
                        <div className="input-container">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={handleSearchChange}
                            />
                            <label>Name or Email</label>
                        </div>
                        <button onClick={handleSearch}>Search</button>
                    </div>
                </div>
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
                        {staff.length > 0 ? (
                            staff.map((staffMember, index) => (
                                <tr key={staffMember.staff_id} onClick={() => handleStaffClick(staffMember.staff_id)}>
                                    <td>{staffMember.staff_id}</td>
                                    <td>{staffMember.staff_name}</td>
                                    <td>{staffMember.staff_email}</td>
                                    <td>{staffMember.staff_phone}</td>
                                    <td>{staffMember.staff_address}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} align="center">No staff found</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
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

export default StaffPage;
