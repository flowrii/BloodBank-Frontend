import React, {useEffect, useState} from 'react';
import api from "./api";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

function AppointmentForm({ appointment, donationCenters, handleSubmit, handleCancel }) {
    const [donorID, setDonorID] = useState(appointment?.donorID ?? null);
    const [donationCenterID, setDonationCenterID] = useState(appointment?.donationCenterID ?? '');
    console.log("donationCenter", donationCenterID)
    const [date, setDate] = useState(appointment?.date ?? '');
    const [statusA, setStatusA] = useState(appointment?.statusA ?? '0');
    const [userType, setUserType] = useState(localStorage.getItem('userType') || '');
    const [appointments, setAppointments] = useState([]);
    const [maxApp, setMaxApp]=useState(0);
    const [notificationType, setNotificationType] = useState('0');
    const [nextAppointment, setNextAppointment] = useState(dayjs());

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

        async function getNextAppointment(){
            if(donorID) {
                const response = await api.get(`/api/Appointments/nextAppointment/${donorID}`)
                console.log(response.data)
                setNextAppointment(response.data);
            }
        }

        if (donationCenterID) {
            getAppointments();
            getDonationCenter();
            getNextAppointment();
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
        }, notificationType);
    };

    const cancelHandler = () => {
        handleCancel();
    };

    const isDateAvailable = (date) => {
        let formattedDate=dayjs(date).format('YYYY-MM-DDTHH:mm:ss');
        const maxAppointments = maxApp;
        const appointmentsOnDate = appointments.filter((app) => app.date.slice(0,10) === formattedDate.slice(0,10));
        let nextAvailable=dayjs(nextAppointment?.date);
        console.log("NEXT",nextAvailable);
        return (appointmentsOnDate.length < maxAppointments) && (date.getDay() !== 0) && (date.getDay() !== 6) && (date>nextAvailable);
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
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={['DatePicker']}>
                            <DatePicker
                                defaultValue = {dayjs(new Date().toISOString().split("T")[0])}
                                minDate={dayjs()}
                                shouldDisableDate={(e)=>!isDateAvailable(e.$d)}
                                onChange={(e) => {
                                    setDate(dayjs(e.$d).format('YYYY-MM-DDTHH:mm:ss'));
                                }}

                            />
                        </DemoContainer>
                    </LocalizationProvider>
                </>
            )}
            <label>
                Notification Type:
            </label>
            <select value={notificationType} onChange={(e) => setNotificationType(e.target.value)}>
                <option value='0'>Email</option>
                <option value='1'>SMS</option>
            </select>


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