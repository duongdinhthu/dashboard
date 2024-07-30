import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import FeedbackListWithReply from './FeedbackListWithReply';
import '../admins/PatientDetailPage.css';

const PatientDetailPage = () => {
    const { patientId } = useParams();
    const [patient, setPatient] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPatientDetails = async () => {
            try {
                const patientResponse = await axios.get(`http://localhost:8080/api/v1/patients/${patientId}`);
                setPatient(patientResponse.data);
                console.log('Patient Data:', patientResponse.data);
                const appointmentsResponse = await axios.get(`http://localhost:8080/api/v1/patients/${patientId}/appointments`);
                setAppointments(appointmentsResponse.data);
                console.log('Appointments Data:', appointmentsResponse.data);
            } catch (error) {
                console.error('Error fetching patient details', error);
            }
        };

        fetchPatientDetails();
    }, [patientId]);

    const handleBack = () => {
        navigate('/patients');
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
        <div className="patient-detail-page">
            <Sidebar
                onInboxClick={handleOpenFeedbackModal}
                handleOpenDoctorsPage={() => navigate('/doctors')}
                handleOpenPatientsPage={() => navigate('/patients')}
                handleOpenAppointmentsPage={() => navigate('/appointments')}
                handleOpenStaffPage={() => navigate('/staff')}
            />
            <div className="patient-content">
                <div className="header">
                    <h4>Patient Details</h4>
                    <button className="back-button" onClick={handleBack}>Back to Patients Page</button>
                </div>
                {patient ? (
                    <div className="patient-info">
                        <p>Name: {patient.patient_name}</p>
                        <p>Email: {patient.patient_email}</p>
                        <p>Phone: {patient.patient_phone}</p>
                        <p>Address: {patient.patient_address}</p>
                    </div>
                ) : (
                    <p>Loading patient details...</p>
                )}
                <div className="appointments-container">
                    <div className="appointments-card">
                        <h6>Appointments</h6>
                        <div className="table-container">
                            <table>
                                <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Time</th>
                                    <th>Doctor</th>
                                    <th>Status</th>
                                </tr>
                                </thead>
                                <tbody>
                                {appointments.length > 0 ? (
                                    appointments.map(appointment => (
                                        <tr key={appointment.appointment_id}>
                                            <td>{new Date(appointment.medical_day).toLocaleDateString()}</td>
                                            <td>{getTimeFromSlot(appointment.slot)}</td>
                                            <td>{appointment.doctor?.[0]?.doctor_name || 'N/A'}</td>
                                            <td>{appointment.status}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4">No appointments found.</td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>
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

export default PatientDetailPage;
