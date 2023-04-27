import React, { useState  } from "react";
import api from "./api";

export default function Login({ setIsLoggedIn, setUsername, setUserType, setUserID }) {

    const [usernameInput, setUsernameInput] = useState("");
    const [passwordInput, setPasswordInput] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await api.post("/Account/Login", {
                username: usernameInput,
                password: passwordInput,
            });
            console.log("Login successful:", response.data);

            const { userType } = response.data;

            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("username", usernameInput);
            localStorage.setItem("userType", userType);

            if(userType==='Donor') {
                const userResponse=await api.get(`/api/Donors/username/${usernameInput}`);
                console.log(userResponse.data);
                setUserID(userResponse.data.donorID);
                localStorage.setItem("userID", userResponse.data.donorID);
            }
            setIsLoggedIn(true);
            setUsername(usernameInput);
            setUserType(userType);
            window.location.href = "/";
        } catch (error) {
            console.error("Login failed:", error.response.data);
            setError(error.response.data);
        }
    };

    return (
        <div className="auth-form-container">
            <h1>Login</h1>
            <form className="login-form" onSubmit={handleSubmit}>
                <label htmlFor="username">Username</label>
                <input
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    type="text"
                    id="username"
                    name="username"
                />
                <label htmlFor="password">Password</label>
                <input
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    type="password"
                    id="password"
                    name="password"
                />
                <button type="submit">Login</button>
                {error && (
                    <div className="alert alert-danger" role="alert">
                        {error==="Wrong username or password"? error : JSON.stringify(error.errors)}
                    </div>
                )}
                <a href="/register">Don't have an account? Click here to register</a>
            </form>
        </div>
    );
}
