import React, { useState, useEffect } from 'react';
import api from './api';
import DonationCenterForm from "./DonationCenterForm";

function DonationCenters() {
    const [donationCenters, setDonationCenters] = useState([]);
    const [editingDonationCenter, setEditingDonationCenter] = useState(null);
    const [creatingDonationCenter, setCreatingDonationCenter] = useState(null);
    const [userType, setUserType] = useState(localStorage.getItem('userType') || '');

    useEffect(() => {
        getDonationCenters();
    }, []);

    async function getDonationCenters() {
        const response = await api.get('/api/DonationCenters');
        setDonationCenters(response.data.$values);
        console.log(donationCenters);
    }

    async function handleDelete(id) {
        const confirmed = window.confirm("Are you sure you want to delete this donation center?");
        if (!confirmed) {
            return;
        }

        try {
            await api.delete(`/api/DonationCenters/${id}`);
            setDonationCenters(donationCenters.filter((donationCenter) => donationCenter.donationCenterID !== id));
        } catch (err) {
            console.error(err);
        }
    }

    async function handleEdit(donationCenter) {
        try {
            console.log(donationCenter);
            await api.put(`/api/DonationCenters/${donationCenter.donationCenterID}`, donationCenter);
            const updatedDonationCenters = donationCenters.map((d) => (d.donationCenterID === donationCenter.donationCenterID ? donationCenter : d));
            setDonationCenters(updatedDonationCenters);
            setEditingDonationCenter(null);
        } catch (err) {
            console.error(err);
        }
    }

    async function handleCreate(donationCenter) {
        try {
            const response = await api.post('/api/DonationCenters', donationCenter);
            setDonationCenters([...donationCenters, response.data]);
            setCreatingDonationCenter(null);
        } catch (err) {
            console.error(err);
        }
    }

    function handleCancelEdit() {
        setEditingDonationCenter(null);
    }

    function handleCancelCreate() {
        setCreatingDonationCenter(null);
    }

    return (
        <div>
            <h1>DonationCenters</h1>
            <table>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Area</th>
                    <th>Address</th>
                    <th>IsActive</th>
                    <th>OpensAt</th>
                    <th>ClosesAt</th>
                    <th>BloodBankID</th>
                    <th>maxDayAppointments</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {donationCenters?.map((donationCenter) => (
                    <tr key={donationCenter.donationCenterID}>
                        <td>{donationCenter.donationCenterID}</td>
                        <td>{donationCenter.area}</td>
                        <td>{donationCenter.address}</td>
                        <td>{donationCenter.isActive === true ? "Yes" : "No"}</td>
                        <td>{donationCenter.opensAt}</td>
                        <td>{donationCenter.closesAt}</td>
                        <td>{donationCenter.bloodBankID}</td>
                        <td>{donationCenter.maxDayAppointments}</td>
                        {userType === 'Admin' && (
                        <td>
                            <button className="edit-button" onClick={() => setEditingDonationCenter(donationCenter)} style={{ marginLeft: '20px' }}>Edit</button>
                            <button className="delete-button" onClick={() => handleDelete(donationCenter.donationCenterID)} style={{ marginLeft: '10px' }}>Delete</button>
                        </td>
                        )}
                    </tr>
                ))}
                </tbody>
            </table>
            {editingDonationCenter && (
                <div>
                    <h2>Edit DonationCenter</h2>
                    <DonationCenterForm donationCenter={editingDonationCenter} handleSubmit={handleEdit} handleCancel={handleCancelEdit} />
                </div>
            )}
            <p> </p>
            {userType === 'Admin' && creatingDonationCenter && (
                <div>
                    <h2>Create DonationCenter</h2>
                    <DonationCenterForm donationCenter={creatingDonationCenter} handleSubmit={handleCreate} handleCancel={handleCancelCreate} />
                </div>
            )}
            {userType === 'Admin' && !creatingDonationCenter && (
                <button onClick={() => setCreatingDonationCenter(true)}>Create DonationCenter</button>
            )}
        </div>
    );

}

export default DonationCenters;
