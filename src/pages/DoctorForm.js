import React, { useState } from 'react';

function DoctorForm({ doctor, handleSubmit, handleCancel }) {
    const [username, setUsername] = useState(doctor?.username ?? '');
    const [password, setPassword] = useState(doctor?.password ?? '');
    const [firstName, setFirstName] = useState(doctor?.firstName ?? '');
    const [lastName, setLastName] = useState(doctor?.lastName ?? '');
    const [email, setEmail] = useState(doctor?.email ?? '');
    const [cnp, setCNP] = useState(doctor?.cnp ?? '');
    const [donationCenterID, setDonationCenterID] = useState(doctor?.donationCenterID ?? '');

    const submitHandler = (e) => {
        e.preventDefault();
        handleSubmit({
            doctorID: doctor?.doctorID,
            username,
            password,
            firstName,
            lastName,
            email,
            cnp,
            donationCenterID
        });
    };

    const cancelHandler = () => {
        handleCancel();
    };

    return (
        <form className="doctor-form" onSubmit={submitHandler}>
            <label>
                Username:
            </label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />

            <label>
                Password:
            </label>
            <input type="text" value={password} onChange={(e) => setPassword(e.target.value)} required />

            <label>
                First Name:
            </label>
            <input type="tel" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />

            <label>
                Last Name:
            </label>
            <input type="tel" value={lastName} onChange={(e) => setLastName(e.target.value)} required />

            <label>
                Email:
            </label>
            <input type="tel" value={email} onChange={(e) => setEmail(e.target.value)} required />

            <label>
                CNP:
            </label>
            <input type="tel" value={cnp} onChange={(e) => setCNP(e.target.value)} required />

            <label>
                Donation Center ID:
            </label>
            <input type="tel" value={donationCenterID} onChange={(e) => setDonationCenterID(e.target.value)} required />

            <p> </p>
            <p>
                <button className={"edit-button"} type="submit">Save</button>
                <button className={"delete-button"} type="button" onClick={cancelHandler} style={{ marginLeft: '10px' }}>Cancel</button>
            </p>
        </form>
    );
}

export default DoctorForm;
