import React from "react";
import AuthForm from "../components/AuthForm";

const Signup = () => {
    return (
        <div>
            <h1>Signup</h1>
            <AuthForm isLogin={false} />
        </div>
    );
};

export default Signup;