import React, {useEffect, useState} from 'react';
import api from "./api";

function AppointmentForm({ appointment, donationCenters, handleSubmit, handleCancel }) {
    const [donorID, setDonorID] = useState(appointment?.donorID ?? '');
    const [donationCenterID, setDonationCenterID] = useState(appointment?.donationCenterID ?? '');
    console.log("donationCenter", donationCenterID)
    const [date, setDate] = useState(appointment?.date ?? '');
    const [statusA, setStatusA] = useState(appointment?.statusA ?? '0');
    const [userType, setUserType] = useState(localStorage.getItem('userType') || '');
    const [appointments, setAppointments] = useState([]);
    const [maxApp, setMaxApp]=useState(0);

    useEffect(() => {
        async function getAppointments() {
            try {
                const response = await api.get(`/api/Appointments/donationCenter/${donationCenterID}`);
                console.log(response.data.$values);
                setAppointments(response.data.$values);
            } catch (error) {
                console.error('Error fetching appointments:', error);
            }
        }

        async function getDonationCenter() {
            try {
                const response = await api.get(`/api/DonationCenters/${donationCenterID}`);
                console.log("DONATION CENTER FOUND:", response.data);
                setMaxApp(response.data.maxDayAppointments);
            } catch (error) {
                console.error('Error fetching donation center:', error);
                console.log("ERROR", donationCenterID)
            }
        }

        if (donationCenterID) {
            getAppointments();
            getDonationCenter();
        }
    }, [donationCenterID]);

    const submitHandler = (e) => {
        e.preventDefault();
        handleSubmit({
            id: appointment?.id,
            donorID,
            donationCenterID,
            date,
            statusA
        });
    };

    const cancelHandler = () => {
        handleCancel();
    };

    const isDateAvailable = () => {
        const maxAppointments = maxApp;
        const appointmentsOnDate = appointments.filter((app) => app.date.slice(0,10) === date.slice(0,10));
        return appointmentsOnDate.length < maxAppointments;
    };

    return (
        <form className="appointment-form" onSubmit={submitHandler}>
            {(userType==='Doctor' || userType==='Admin') && (
                <label>
                    Donor ID:
                </label>) && (
                <input type="text" value={donorID} onChange={(e) => setDonorID(e.target.value)} required />
            )}
            <label>
                Donation Center ID:
            </label>
            <select value={donationCenterID} onChange={(e) => setDonationCenterID(e.target.value)}>
                <option value={""}>Select Donation Center</option>
                {donationCenters.map((option) => (
                    <option key={option.donationCenterID} value={option.donationCenterID}>{option.address}</option>
                ))}
            </select>


            {donationCenterID && (
                <>
                    <label>
                        Date:
                    </label>
                    <input type="datetime-local"
                           value={date}
                           onChange={(e) => {
                               setDate(e.target.value);
                           }}
                           onFocus={() => {
                               if (!isDateAvailable()) {
                                   setDate('');
                                   alert('This date is unavailable. Please choose another date.');
                               }
                           }}
                           min={new Date().toISOString().slice(0, 16)}
                           required
                           disabled={!isDateAvailable()}
                    />
                </>
            )}


            {(userType==='Doctor' || userType==='Admin') && (
                <label>
                    Status:
                </label>) && (
                <select value={statusA} onChange={(e) => setStatusA(e.target.value)}>
                    <option value="">Select status</option>
                    <option value='0'>Pending</option>
                    <option value='1'>Confirmed</option>
                </select>
            )}
            <p> </p>
            <p>
                <button className={"edit-button"} type="submit">Save</button>
                <button className={"delete-button"} type="button" onClick={cancelHandler} style={{ marginLeft: '10px' }}>Cancel</button>
            </p>
        </form>
    );
}

export default AppointmentForm;