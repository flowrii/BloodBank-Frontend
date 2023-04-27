import React, { useEffect, useState } from "react";
import api from './api';
import DonorForm from "./DonorForm";

export default function AccDetails({handleLogout}) {
    const [details, setDetails] = useState(null);
    const [username, setUsername] = useState(localStorage.getItem('username') || '');
    const [userType, setUserType] = useState(localStorage.getItem('userType') || '');

    const [editingDonor, setEditingDonor] = useState(null);

    useEffect(() => {
        getDetails();
    }, []);

    async function getDetails() {
        if (userType === 'Doctor') {
            const response = await api.get(  `/api/Doctors/username/${username}`);
            console.log(response.data);
            setDetails(response.data);
        } else if (userType === 'Donor') {
            const response = await api.get(`/api/Donors/username/${username}`);
            console.log(response.data);
            setDetails(response.data);
        } else {
            throw new Error('Invalid userType');
        }
    }

    async function handleDelete(id) {
        const confirmed = window.confirm("Are you sure you want to delete this doctor?");
        if (!confirmed) {
            return;
        }
        try {
            await api.delete(`/api/Donors/${id}`);
            handleLogout();
        } catch (err) {
            console.error(err);
        }
    }

    async function handleEdit(donor) {
        try {
            console.log(donor);
            console.log(donor.donorID);
            await api.put(`/api/Donors/${donor.donorID}`, donor);
            setEditingDonor(null);
            setDetails({
                ...details,
                username: donor.username,
                password: donor.password,
                firstName: donor.firstName,
                lastName: donor.lastName,
                email: donor.email,
                area: donor.area,
                bloodGroup: donor.bloodGroup
            });
        } catch (err) {
            console.error(err);
        }
    }

    function handleCancelEdit() {
        setEditingDonor(null);
    }
    function renderDetails() {
        if (!details) {
            return <p>Loading...</p>;
        }

        return (
            <div>
                <h1>{userType} Details</h1>
                <p><strong>Username:</strong> {details.username}</p>
                <p><strong>Password:</strong> {details.password}</p>

                {userType === 'Doctor' && (
                    <>
                        <p><strong>Doctor ID:</strong> {details.doctorID}</p>
                        <p><strong>First Name:</strong> {details.firstName}</p>
                        <p><strong>Last Name:</strong> {details.lastName}</p>
                        <p><strong>Email:</strong> {details.email}</p>
                        <p><strong>CNP:</strong> {details.cnp}</p>
                        <p><strong>Donation Center ID:</strong> {details.donationCenterID}</p>
                    </>
                )}

                {userType === 'Donor' && (
                    <>
                        <p><strong>Donor ID:</strong> {details.donorID}</p>
                        <p><strong>First Name:</strong> {details.firstName}</p>
                        <p><strong>Last Name:</strong> {details.lastName}</p>
                        <p><strong>Email:</strong> {details.email}</p>
                        <p><strong>Area:</strong> {details.area}</p>
                        <p><strong>Blood Group:</strong> {details.bloodGroup}</p>
                        <p>
                            <button className="edit-button" onClick={() => setEditingDonor(details)} style={{ marginLeft: '20px' }}>Edit</button>
                            <button className="delete-button" onClick={() => handleDelete(details.donorID)} style={{ marginLeft: '10px' }}>Delete</button>
                        </p>
                        <p> </p>
                        {editingDonor && (
                            <div>
                                <h2>Edit Account</h2>
                                <DonorForm donor={editingDonor} handleSubmit={handleEdit} handleCancel={handleCancelEdit} />
                            </div>
                        )}
                    </>
                )}
            </div>
        );
    }

    return (
        <div>
            {renderDetails()}
        </div>
    );
}
