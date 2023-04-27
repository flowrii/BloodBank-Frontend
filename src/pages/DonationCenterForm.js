import React, { useState } from 'react';

function DonationCenterForm({ donationCenter, handleSubmit, handleCancel }) {
    const [area, setArea] = useState(donationCenter?.area ?? '');
    const [address, setAddress] = useState(donationCenter?.address ?? '');
    const [isActive, setIsActive] = useState(donationCenter?.isActive ?? '');
    const [opensAt, setOpensAt] = useState(donationCenter?.opensAt ?? '');
    const [closesAt, setClosesAt] = useState(donationCenter?.closesAt ?? '');
    const [bloodBankID, setBloodBankID] = useState(donationCenter?.bloodBankID ?? '');
    const [maxDayAppointments, setMaxDayAppointments] = useState(donationCenter?.maxDayAppointments ?? '');

    const submitHandler = (e) => {
        e.preventDefault();
        handleSubmit({
            donationCenterID: donationCenter?.donationCenterID,
            area,
            address,
            isActive,
            opensAt,
            closesAt,
            bloodBankID,
            maxDayAppointments
        });
    };

    const cancelHandler = () => {
        handleCancel();
    };

    return (
        <form className="donationCenter-form" onSubmit={submitHandler}>
            <label>
                Area:
            </label>
            <input type="text" value={area} onChange={(e) => setArea(e.target.value)} required />

            <label>
                Address:
            </label>
            <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} required />

            <label>
                Is Active:
            </label>
            <input type="tel" value={isActive} onChange={(e) => setIsActive(e.target.value)} required />

            <label>
                OpensAt:
            </label>
            <input type="tel" value={opensAt} onChange={(e) => setOpensAt(e.target.value)} required />

            <label>
                ClosesAt:
            </label>
            <input type="tel" value={closesAt} onChange={(e) => setClosesAt(e.target.value)} required />

            <label>
                BloodBank ID:
            </label>
            <input type="tel" value={bloodBankID} onChange={(e) => setBloodBankID(e.target.value)} required />

            <label>
                Appointments/Day:
            </label>
            <input type="tel" value={maxDayAppointments} onChange={(e) => setMaxDayAppointments(e.target.value)} required />

            <p> </p>
            <p>
                <button className={"edit-button"} type="submit">Save</button>
                <button className={"delete-button"} type="button" onClick={cancelHandler} style={{ marginLeft: '10px' }}>Cancel</button>
            </p>
        </form>
    );
}

export default DonationCenterForm;
