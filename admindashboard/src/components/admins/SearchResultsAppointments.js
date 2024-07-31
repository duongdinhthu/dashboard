import React, {useState} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from "./Sidebar";
import FeedbackListWithReply from "./FeedbackListWithReply";

const SearchResultsAppointments = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { searchResults } = location.state;
    const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

    const handleOpenFeedbackModal = () => {
        setIsFeedbackModalOpen(true);
    };
    const handleCloseFeedbackModal = () => {
        setIsFeedbackModalOpen(false);
    };
    const handleAppointmentClick = (appointmentId) => {
        navigate(`/appointments/${appointmentId}`);
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const convertSlotToTime = (slot) => {
        const slotMapping = {
            1: '08:00 AM - 09:00 AM',
            2: '09:00 AM - 10:00 AM',
            3: '10:00 AM - 11:00 AM',
            4: '11:00 AM - 12:00 PM',
            5: '01:00 PM - 02:00 PM',
            6: '02:00 PM - 03:00 PM',
            7: '03:00 PM - 04:00 PM',
            8: '04:00 PM - 05:00 PM'
        };
        return slotMapping[slot] || 'N/A';
    };

    return (
        <div className="search-results-page">
            <Sidebar
                onInboxClick={handleOpenFeedbackModal}
                handleOpenDoctorsPage={() => navigate('/doctors')}
                handleOpenPatientsPage={() => navigate('/patients')}
                handleOpenAppointmentsPage={() => navigate('/appointments')}
                handleOpenStaffPage={() => navigate('/staff')}
            />
            <h2>Search Results for Appointments</h2>
            {searchResults.length > 0 ? (
                <table className="results-table">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Status</th>
                        <th>Details</th>
                    </tr>
                    </thead>
                    <tbody>
                    {searchResults.map((result) => (
                        <tr key={result.appointment_id} onClick={() => handleAppointmentClick(result.appointment_id)}>
                            <td>{result.appointment_id}</td>
                            <td>{formatDate(result.medical_day)}</td>
                            <td>{convertSlotToTime(result.slot)}</td>
                            <td>{result.status}</td>
                            <td>View Details</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                <p>No results found.</p>
            )}
            {isFeedbackModalOpen && (
                <div className="feedback-modal">
                    <FeedbackListWithReply onClose={handleCloseFeedbackModal}/>
                </div>
            )}
        </div>
    );
};

export default SearchResultsAppointments;
