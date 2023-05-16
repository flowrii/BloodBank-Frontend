import React, { useState, useEffect } from 'react';
import api from './api';
import AppointmentForm from './AppointmentForm';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {Button} from "@mui/material";
import autoTable from "jspdf-autotable";

function Appointments() {
    const [appointments, setAppointments] = useState([]);
    const [donationCenters, setDonationCenters] = useState([]);
    const [editingAppointment, setEditingAppointment] = useState(null);
    const [creatingAppointment, setCreatingAppointment] = useState(null);
    const [userType, setUserType] = useState(localStorage.getItem('userType') || '');
    const [userID, setUserID] = useState(localStorage.getItem('userID') || '');
    const [username, setUsername] = useState(localStorage.getItem('username') || '');
    const [donorNames, setDonorNames] = useState({});

    useEffect(() => {
        const fetchDonorNames = async () => {
            const donorIDs = appointments.map((appointment) => appointment.donorID);
            const names = await Promise.all(donorIDs.map((id) => getName(id)));
            const donorNamesMap = donorIDs.reduce((namesMap, id, index) => {
                namesMap[id] = names[index];
                return namesMap;
            }, {});
            setDonorNames(donorNamesMap);
        };

        if(userType === 'Donor'){
            getAppointmentsForDonor();
        }
        else if(userType==='Doctor'){
            getDocAppointmets();
        }
        else {
            getAppointments();
        }
        getDonationCenters();
        fetchDonorNames();
    }, []);

    async function getAppointments() {
        const response = await api.get('/api/Appointments');
        console.log(response.data.$values);
        setAppointments(response.data.$values);
    }

    async function getDonationCenters() {
        const response = await api.get('/api/DonationCenters');
        console.log(response.data.$values);
        setDonationCenters(response.data.$values);
    }

    async function getAppointmentsForDonor() {
        console.log(userID)
        const response = await api.get(`/api/Appointments/userid/${userID}`);
        console.log(response.data.$values);
        setAppointments(response.data.$values);
    }

    async function printDocument() {
        const input = document.getElementById('pdfdiv');
        // Create a new jsPDF instance
        const pdf = new jsPDF('p', 'mm', 'a4');
        // Generate the table using autoTable plugin
        autoTable(pdf, { html: input });
        // Save the PDF
        pdf.save('appointments.pdf');
    }

    async function getDocAppointmets() {
        console.log(userID)
        const response = await api.get(`/api/Doctors/${userID}`);
        console.log(response.data);
        const response2 = await api.get(`/api/Appointments/donationCenter/${response.data.donationCenterID}`);
        console.log(response2.data.$values);
        setAppointments(response2.data.$values);
    }

    async function getName(id) {
        if (donorNames[id]) {
            return donorNames[id];
        } else {
            const response = await api.get(`/api/Donors/name/${id}`);
            const name = response.data;
            setDonorNames((prevDonorNames) => ({
                ...prevDonorNames,
                [id]: name,
            }));
            return name;
        }
    }

    async function handleDelete(id) {
        const confirmed = window.confirm("Are you sure you want to delete this appointment?");
        if (!confirmed) {
            return;
        }

        try {
            await api.delete(`/api/Appointments/${id}`);
            setAppointments(appointments.filter((appointment) => appointment.id !== id));
        } catch (err) {
            console.error(err);
        }
    }

    async function handleEdit(appointment) {
        try {
            console.log(appointment);
            if(appointment.statusA==='1') {
                appointment.statusA = 1;
            } else {
                appointment.statusA = 0;
            }
            await api.put(`/api/Appointments/${appointment.id}`, appointment);
            const updatedAppointments = appointments.map((a) => (a.id === appointment.id ? appointment : a));
            setAppointments(updatedAppointments);
            setEditingAppointment(null);
        } catch (err) {
            console.error(err);
        }
    }

    async function handleCreate(appointment, notificationType) {
        try {
            if(appointment.statusA==='1') {
                appointment.statusA = 1;
            } else {
                appointment.statusA = 0;
            }
            if(notificationType==='0') {
                notificationType = "Email";
            } else {
                notificationType = "SMS";
            }
            const response = await api.post('/api/Appointments', appointment);
            const userResponse = await api.get(`api/Donors/${userID}` )
            const notificationResponse = await api.post(`/api/Notifications/${notificationType}`, {
                to: notificationType==="Email"?userResponse.data.email:"+40735539291",
                fromSubject: notificationType==="Email"?"Your Appointment with us":"+13203027670",
                body: `Dear ${username},\n\nThank you for making an appointment with us. Your appointment has been scheduled for ${appointment.date}.\n\nBest regards,\nThe BloodApp Team`,
                appointmentId: appointment.id,
                date: appointment.date
            });
            setAppointments([...appointments, response.data]);
            setCreatingAppointment(null);
        } catch (err) {
            console.error(err);
        }
    }

    function handleCancel() {
        setEditingAppointment(null);
        setCreatingAppointment(null);
    }

    return (
        <div>
            <h1>Appointments</h1>
            <table id="pdfdiv" className="txt">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Donor</th>
                    <th>DonationCenterID</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {appointments?.map((appointment) => (
                    <tr key={appointment.id}>
                        <td>{appointment.id}</td>
                        <td>{donorNames[appointment.donorID]}</td>
                        <td>{appointment.donationCenterID}</td>
                        <td>{appointment.date}</td>
                        <td>{appointment.statusA === 1 ? "Confirmed" : "Pending"} </td>
                        {(userType==='Admin' || userType==='Doctor') && (
                        <td>
                            <button className={"edit-button"} onClick={() => setEditingAppointment(appointment)} style={{ marginLeft: '20px' }}>Edit</button>
                            <button className="delete-button" onClick={() => handleDelete(appointment.id)} style={{ marginLeft: '10px' }}>Delete</button>
                        </td>
                        )}
                        {(userType==='Donor' && (Date.parse(appointment.date) > (new Date()).getTime())) && (
                            <td>
                                <button className="delete-button" onClick={() => handleDelete(appointment.id)} style={{ marginLeft: '10px' }}>Delete</button>
                            </td>
                        )}
                    </tr>
                ))}
                </tbody>
            </table>
            {userType==='Doctor' && (
                <Button onClick={printDocument} variant="contained" color="primary">
                    Generate Pdf
                </Button>
            )}
            {editingAppointment && (
                <div>
                    <h2>Edit Appointment</h2>
                    <AppointmentForm appointment={editingAppointment} donationCenters={donationCenters} handleSubmit={handleEdit} handleCancel={handleCancel} />
                </div>
            )}
            <p> </p>
            {userType==='Donor' && creatingAppointment && (
                <div>
                    <h2>Create Appointment</h2>
                    <AppointmentForm appointment={creatingAppointment} donationCenters={donationCenters} handleSubmit={handleCreate} handleCancel={handleCancel} />
                </div>
            )}
            {userType==='Donor' && !creatingAppointment && (
                <button onClick={() => setCreatingAppointment({donorID: userID})}>Create Appointment</button>
            )}
            {(userType==='Admin' || userType==='Doctor') && !creatingAppointment && (
                <button onClick={() => setCreatingAppointment(true)}>Create Appointment</button>
            )}
        </div>
    );
}

export default Appointments;
