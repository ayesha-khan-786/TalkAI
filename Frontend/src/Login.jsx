import { useState } from "react";
import API from "./api/axios";
import "./Login.css";

function Login({ onClose }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");


    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const res = await API.post("/auth/login", {
                email,
                password,
            });

            // Save Token
            localStorage.setItem("token", res.data.token);

            if(onClose) onClose();

            alert("Login Successful");
        } catch(err) {
            console.log(err.response?.data);
            alert("Login Failed!");
        }
    };

    return (
    <div className="login-container">
        <h2>Welcome Back</h2>
        <p className="subtitle">Login to continue</p>

        <form onSubmit={handleLogin}>
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

            <button type="submit">Login</button>
        </form>
    </div>
);

}

export default Login;