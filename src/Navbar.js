import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar({ isLoggedIn, username, userType, handleLogout }) {
    return (
        <nav className="nav">
            <Link to="/" className="site-title">
                Blood App
            </Link>
            <ul>
                {isLoggedIn ? (
                    <>
                        {userType === 'Admin' && (
                            <li>
                                <Link to="/doctor">Doctors</Link>
                            </li>
                        )}
                        <li>
                            <Link to="/donationCenter">Donation Centers</Link>
                        </li>
                        <li>
                            <Link to="/appointment">Appointments</Link>
                        </li>
                        {userType === 'Admin' && (
                            <li>
                                Welcome, {username}!
                            </li>
                        )}
                        {(userType === 'Donor' || userType === 'Doctor') && (
                            <li>
                                <Link to="/accDetails">Welcome, {username}!</Link>
                            </li>
                        )}
                        <li>
                            <button onClick={handleLogout}>Log out</button>
                        </li>
                    </>
                ) : (
                    <>
                        <li>
                            <Link to="/login">Login</Link>
                        </li>
                        <li>
                            <Link to="/register">Register</Link>
                        </li>
                    </>
                )}
            </ul>
        </nav>
    );
}
