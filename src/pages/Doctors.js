import React, { useState, useEffect } from 'react';
import api from './api';
import DoctorForm from './DoctorForm';

function Doctors() {
    const [doctors, setDoctors] = useState([]);
    const [editingDoctor, setEditingDoctor] = useState(null);
    const [creatingDoctor, setCreatingDoctor] = useState(null);

    useEffect(() => {
        getDoctors();
    }, []);

    async function getDoctors() {
        const response = await api.get('/api/Doctors');
        setDoctors(response.data.$values);
        console.log(doctors);
    }

    async function handleDelete(id) {
        const confirmed = window.confirm("Are you sure you want to delete this doctor?");
        if (!confirmed) {
            return;
        }

        try {
            await api.delete(`/api/Doctors/${id}`);
            setDoctors(doctors.filter((doctor) => doctor.doctorID !== id));
        } catch (err) {
            console.error(err);
        }
    }

    async function handleEdit(doctor) {
        try {
            console.log(doctor);
            await api.put(`/api/Doctors/${doctor.doctorID}`, doctor);
            const updatedDoctors = doctors.map((d) => (d.doctorID === doctor.doctorID ? doctor : d));
            setDoctors(updatedDoctors);
            setEditingDoctor(null);
        } catch (err) {
            console.error(err);
        }
    }

    async function handleCreate(doctor) {
        try {
            const response = await api.post('/api/Doctors', doctor);
            setDoctors([...doctors, response.data]);
            setCreatingDoctor(null);
        } catch (err) {
            console.error(err);
        }
    }

    function handleCancelEdit() {
        setEditingDoctor(null);
    }

    function handleCancelCreate() {
        setCreatingDoctor(null);
    }

    return (
        <div>
            <h1>Doctors</h1>
            <table>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Username</th>
                    <th>Password</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Email</th>
                    <th>CNP</th>
                    <th>DonationCenterID</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {doctors?.map((doctor) => (
                    <tr key={doctor.doctorID}>
                        <td>{doctor.doctorID}</td>
                        <td>{doctor.username}</td>
                        <td>{doctor.password}</td>
                        <td>{doctor.firstName}</td>
                        <td>{doctor.lastName}</td>
                        <td>{doctor.email}</td>
                        <td>{doctor.cnp}</td>
                        <td>{doctor.donationCenterID}</td>
                        <td>
                            <button className="edit-button" onClick={() => setEditingDoctor(doctor)} style={{ marginLeft: '20px' }}>Edit</button>
                            <button className="delete-button" onClick={() => handleDelete(doctor.doctorID)} style={{ marginLeft: '10px' }}>Delete</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            {editingDoctor && (
                <div>
                    <h2>Edit Doctor</h2>
                    <DoctorForm doctor={editingDoctor} handleSubmit={handleEdit} handleCancel={handleCancelEdit} />
                </div>
            )}
            <p> </p>
            {creatingDoctor && (
                <div>
                    <h2>Create Doctor</h2>
                    <DoctorForm doctor={creatingDoctor} handleSubmit={handleCreate} handleCancel={handleCancelCreate} />
                </div>
            )}
            {!creatingDoctor && (
                <button onClick={() => setCreatingDoctor(true)}>Create Doctor</button>
            )}
        </div>
    );

}

export default Doctors;
