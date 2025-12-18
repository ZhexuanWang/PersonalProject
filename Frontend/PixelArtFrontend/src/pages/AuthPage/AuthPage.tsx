import React from "react";
import AuthArea from "../../components/AuthArea/AuthArea";
//import "./AuthPage.css";

export default function AuthPage() {
    return (
        <div className="auth-page">
            <h1 className="auth-title">Welcome Back</h1>
            <div className="auth-container">
                <AuthArea />
            </div>
        </div>
    );
}
