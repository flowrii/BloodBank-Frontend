import Navbar from "./Navbar";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import {Route, Routes} from "react-router-dom";
import {useState} from "react";
import Appointment from "./pages/Appointments";
import Doctor from "./pages/Doctors";
import AccDetails from "./pages/AccDetails";
import DonationCenters from "./pages/DonationCenters";


function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');
    const [username, setUsername] = useState(localStorage.getItem('username') || '');
    const [userType, setUserType]=useState(localStorage.getItem('userType') || '');
    const [userID, setUserID]=useState(localStorage.getItem('userID') || '');

    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username');
        localStorage.removeItem('userType');
        localStorage.removeItem('userID');
        setIsLoggedIn(false);
        setUsername('');
        setUserType('');
        setUserID('');
        window.location.href = '/';
    };
    return (
        <>
            <Navbar isLoggedIn={isLoggedIn} username={username} userType={userType} handleLogout={handleLogout} />
            <div className="container">
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} setUsername={setUsername} setUserType={setUserType} setUserID={setUserID}/>}/>
                    <Route path="/register" element={<Register/>}/>
                    <Route path="/doctor" element={<Doctor/>}/>
                    <Route path="/appointment" element={<Appointment/>}/>
                    <Route path="/accDetails" element={<AccDetails handleLogout={handleLogout} />}/>
                    <Route path="/donationCenter" element={<DonationCenters/>}/>
                </Routes>
            </div>
        </>
    );
}

export default App;
