import React, { useState } from "react";
import axios from "axios";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [error, setError] = useState("");

    const handleSendOtp = async () => {
        try {
            await axios.post("http://localhost:5000/api/auth/generate-otp", { email });
            setIsOtpSent(true);
            setError("");
            alert("OTP sent successfully!");
        } catch (error) {
            setError("Failed to send OTP. Please try again.");
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:5000/api/auth/reset-password", {
                email,
                otp,
                newPassword,
            });
            alert(response.data.message);
        } catch (error) {
            setError(error.response?.data?.error || "An error occurred. Please try again.");
        }
    };

    return (
        <div className="form-container">
            <h2>Forgot Password</h2>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleResetPassword}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                {isOtpSent && (
                    <>
                        <input
                            type="text"
                            placeholder="OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </>
                )}
                <button type="button" onClick={handleSendOtp} disabled={isOtpSent}>
                    {isOtpSent ? "OTP Sent" : "Send OTP"}
                </button>
                {isOtpSent && <button type="submit">Reset Password</button>}
            </form>
        </div>
    );
};

export default ForgotPassword;