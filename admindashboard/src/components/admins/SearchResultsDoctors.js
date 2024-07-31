import React, {useState} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from "./Sidebar";
import FeedbackListWithReply from "./FeedbackListWithReply";

const SearchResultsDoctors = () => {
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
    const handleDoctorClick = (doctorId) => {
        navigate(`/doctors/${doctorId}`);
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
            <h2>Search Results for Doctors</h2>
            {searchResults.length > 0 ? (
                <ul>
                    {searchResults.map((result) => (
                        <li key={result.doctor_id} onClick={() => handleDoctorClick(result.doctor_id)}>
                            {result.name} - {result.email}
                        </li>
                    ))}
                </ul>
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

export default SearchResultsDoctors;
