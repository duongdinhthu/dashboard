import React, {useState} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import FeedbackListWithReply from "./FeedbackListWithReply";
import Sidebar from "./Sidebar";

const SearchResultsStaff = () => {
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
    const handleStaffClick = (staffId) => {
        navigate(`/staffs/${staffId}`);
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
            <h2>Search Results for Staff</h2>
            {searchResults.length > 0 ? (
                <ul>
                    {searchResults.map((result) => (
                        <li key={result.staff_id} onClick={() => handleStaffClick(result.staff_id)}>
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

export default SearchResultsStaff;
