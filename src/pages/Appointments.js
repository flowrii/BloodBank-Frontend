import React, { useState, useEffect } from 'react';
import api from './api';
import AppointmentForm from './AppointmentForm';

function Appointments() {
    const [appointments, setAppointments] = useState([]);
    const [donationCenters, setDonationCenters] = useState([]);
    const [editingAppointment, setEditingAppointment] = useState(null);
    const [creatingAppointment, setCreatingAppointment] = useState(null);
    const [username, setUsername] = useState(localStorage.getItem('username') || '');
    const [userType, setUserType] = useState(localStorage.getItem('userType') || '');
    const [userID, setUserID] = useState(localStorage.getItem('userID') || '');

    useEffect(() => {
        if(userType === 'Donor'){
            getAppointmentsForDonor();
        }
        else {
            getAppointments();
        }
        getDonationCenters();
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

    async function handleCreate(appointment) {
        try {
            if(appointment.statusA==='1') {
                appointment.statusA = 1;
            } else {
                appointment.statusA = 0;
            }
            const response = await api.post('/api/Appointments', appointment);
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
            <table>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>DonorID</th>
                    <th>DonationCenterID</th>
                    <th>Date</th>
                    <th>StatusA</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {appointments?.map((appointment) => (
                    <tr key={appointment.id}>
                        <td>{appointment.id}</td>
                        <td>{appointment.donorID}</td>
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
            {editingAppointment && (
                <div>
                    <h2>Edit Appointment</h2>
                    <AppointmentForm appointment={editingAppointment} donationCenters={donationCenters} handleSubmit={handleEdit} handleCancel={handleCancel} />
                </div>
            )}
            <p> </p>
            {creatingAppointment && (
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
