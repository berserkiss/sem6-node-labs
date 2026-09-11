import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const AuthForm = ({ isLogin }) => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        otp: "",
    });
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSendOtp = async () => {
        try {
            await axios.post("http://localhost:5000/api/auth/generate-otp", {
                email: formData.email,
            });
            setIsOtpSent(true);
            setError("");
            alert("OTP sent successfully!");
        } catch (error) {
            setError("Failed to send OTP. Please try again.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const endpoint = isLogin ? "/login" : "/signup";
            const response = await axios.post(
                `http://localhost:5000/api/auth${endpoint}`,
                formData
            );

            if (isLogin) {
                login(response.data.user, response.data.token);
            } else {
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("user", JSON.stringify(response.data.user));
            }

            alert(isLogin ? "Login successful!" : "Signup successful!");
            navigate("/pets");
        } catch (error) {
            setError(error.response?.data?.error || "An error occurred. Please try again.");
        }
    };

    return (
        <div className="form-container">
            <h2>{isLogin ? "Login" : "Signup"}</h2>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit}>
                {!isLogin && (
                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                )}
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                {!isLogin && (
                    <>
                        <input
                            type="text"
                            name="otp"
                            placeholder="OTP"
                            value={formData.otp}
                            onChange={handleChange}
                            required
                        />
                        <button
                            type="button"
                            className="otp-button"
                            onClick={handleSendOtp}
                            disabled={isOtpSent}
                        >
                            {isOtpSent ? "OTP Sent" : "Send OTP"}
                        </button>
                    </>
                )}
                <button type="submit">{isLogin ? "Login" : "Signup"}</button>
            </form>
        </div>
    );
};

export default AuthForm;