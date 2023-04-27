import React, { useState } from 'react';

function DonorForm({ donor, handleSubmit, handleCancel }) {
    const [username, setUsername] = useState(donor?.username ?? '');
    const [password, setPassword] = useState(donor?.password ?? '');
    const [firstName, setFirstName] = useState(donor?.firstName ?? '');
    const [lastName, setLastName] = useState(donor?.lastName ?? '');
    const [email, setEmail] = useState(donor?.email ?? '');
    const [area, setArea] = useState(donor?.area ?? '');
    const [bloodGroup, setBloodGroup] = useState(donor?.bloodGroup ?? '');

    const submitHandler = (e) => {
        e.preventDefault();
        handleSubmit({
            donorID: donor?.donorID,
            username,
            password,
            firstName,
            lastName,
            email,
            area,
            bloodGroup
        });
    };

    const cancelHandler = () => {
        handleCancel();
    };

    return (
        <form className="donor-form" onSubmit={submitHandler}>
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
                Area:
            </label>
            <input type="tel" value={area} onChange={(e) => setArea(e.target.value)} required />

            <label>
                Blood Group:
            </label>
            <input type="tel" value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)} required />

            <p> </p>
            <p>
                <button className={"edit-button"} type="submit">Save</button>
                <button className={"delete-button"} type="button" onClick={cancelHandler} style={{ marginLeft: '10px' }}>Cancel</button>
            </p>
        </form>
    );
}

export default DonorForm;
