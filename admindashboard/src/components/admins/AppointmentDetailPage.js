import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import FeedbackListWithReply from './FeedbackListWithReply';
import './AppointmentDetailPage.css';

const AppointmentDetailPage = () => {
    const { appointmentId } = useParams();
    const [appointment, setAppointment] = useState(null);
    const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAppointmentDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/v1/appointments/${appointmentId}`);
                setAppointment(response.data);
                console.log(response.data);
            } catch (error) {
                console.error('Error fetching appointment details', error);
            }
        };
        fetchAppointmentDetails();
    }, [appointmentId]);

    const handleBack = () => {
        navigate('/appointments');
    };

    const handleOpenFeedbackModal = () => {
        setIsFeedbackModalOpen(true);
    };

    const handleCloseFeedbackModal = () => {
        setIsFeedbackModalOpen(false);
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

    return (
        <div className="appointment-detail-page">
            <Sidebar
                onInboxClick={handleOpenFeedbackModal}
                handleOpenDoctorsPage={() => navigate('/doctors')}
                handleOpenPatientsPage={() => navigate('/patients')}
                handleOpenAppointmentsPage={() => navigate('/appointments')}
                handleOpenStaffPage={() => navigate('/staff')}
            />
            <div className="content">
                <div className="header">
                    <h4>Appointment Details</h4>
                    <button className="back-button" onClick={handleBack}>Back to Appointments Page</button>
                </div>
                {appointment ? (
                    <div className="appointment-info">
                        <h5>Appointment ID: {appointment.appointment_id}</h5>
                        <p>Date: {new Date(appointment.medical_day).toLocaleDateString()}</p>
                        <p>Time: {getTimeFromSlot(appointment.slot)}</p>
                        <p>Status: {appointment.status}</p>
                        <p>Price: {appointment.price}</p>

                        {appointment.doctor && appointment.doctor.length > 0 && (
                            <div className="doctor-info">
                                <h5>Doctor Information</h5>
                                <p>Name: {appointment.doctor[0].doctor_name}</p>
                                <p>Email: {appointment.doctor[0].doctor_email}</p>
                                <p>Phone: {appointment.doctor[0].doctor_phone}</p>
                                <p>Address: {appointment.doctor[0].doctor_address}</p>
                            </div>
                        )}

                        {appointment.patient && appointment.patient.length > 0 && (
                            <div className="patient-info">
                                <h5>Patient Information</h5>
                                <p>Name: {appointment.patient[0].patient_name}</p>
                                <p>Email: {appointment.patient[0].patient_email}</p>
                                <p>Phone: {appointment.patient[0].patient_phone}</p>
                                <p>Address: {appointment.patient[0].patient_address}</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <p>Loading appointment details...</p>
                )}
                {isFeedbackModalOpen && (
                    <div className="feedback-modal">
                        <FeedbackListWithReply onClose={handleCloseFeedbackModal} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default AppointmentDetailPage;
