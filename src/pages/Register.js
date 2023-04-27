import React, {useState} from "react";
import api from "./api";

export default function Register() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [area, setArea] = useState('');
    const [bloodGroup, setBloodGroup] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmedPassword, setConfirmedPassword] = useState('')

    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        api.post("/Account/Register", {
            username,
            email,
            firstName,
            lastName,
            area,
            bloodGroup,
            password,
            confirmPassword: confirmedPassword
        })
            .then(response => {
                console.log(response);
                window.location.href = "/Login";
            })
            .catch(error => {
                console.error("Login failed:", error.response.data);
                setError(error.response.data);
            });
    }

    return (
        <div className="auth-form-container">
            <h1>Register</h1>
            <form className="register-form" onSubmit={handleSubmit}>
                <label htmlFor="firstName">First Name</label>
                <input value={firstName} onChange={(e) => setFirstName(e.target.value)} type="firstName" id="firstName"
                       name="FirstName"/>

                <label htmlFor="lastName">Last Name</label>
                <input value={lastName} onChange={(e) => setLastName(e.target.value)} type="lastName" id="lastName"
                       name="LastName"/>

                <label htmlFor="email">Email</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" id="email"
                       name="Email"/>

                <label htmlFor="area">Area</label>
                <input value={area} onChange={(e) => setArea(e.target.value)} type="area" id="area"
                       name="Area"/>

                <label htmlFor="bloodGroup">Blood Group</label>
                <input value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)} type="bloodGroup" id="bloodGroup"
                       name="BloodGroup"/>

                <label htmlFor="username">Username</label>
                <input value={username} onChange={(e) => setUsername(e.target.value)} type="username" id="username"
                       name="Username"/>

                <label htmlFor="password">Password</label>
                <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" id="password"
                       name="Password"/>

                <label htmlFor="confirmedPassword">Confirm Password</label>
                <input value={confirmedPassword} onChange={(e) => setConfirmedPassword(e.target.value)} type="password" id="confirmedPassword"
                       name="ConfirmPassword"/>

                <button type="submit">Register</button>

                {error && (
                    <div className="alert alert-danger" role="alert">
                        {JSON.stringify(error.errors)}
                    </div>
                )}

                <a href="/login">Already have an account? Click here to login</a>
            </form>
        </div>
    );
}