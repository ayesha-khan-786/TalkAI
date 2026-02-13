import { useState } from "react";
import API from "./api/axios";

function Register({ switchToLogin }) {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            const res = await API.post("/auth/register", {
                name,
                email,
                password
            });

            setMessage("🎉 Registration successful! Please login.");
            setError("");

            setTimeout(() => {
                switchToLogin();
            }, 2000);

        } catch (err) {
            setError(err.response?.data?.message || "Registration failed");
            setMessage("");
        }
    };

    return (
        <div className="login-container">
            <h2>Create Account</h2>
            <p className="subtitle">Join TalkAI</p>

            {message && <p style={{ color: "green" }}>{message}</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            <form onSubmit={handleRegister}>
                <input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button type="submit">Register</button>
            </form>

            <p
                style={{ marginTop: "15px", cursor: "pointer", fontSize: "14px" }}
                onClick={switchToLogin}
            >
                Already have an account? Login
            </p>
        </div>
    );
}

export default Register;
