import React from "react";
import Profile from "../../components/Profile/Profile";
import "./ProfilePage.css"; // optional CSS module or stylesheet

export default function ProfilePage() {
    return (
        <div className="profile-page">
            <h1 className="profile-title">My Profile</h1>
            <div className="profile-container">
                <Profile />
            </div>
        </div>
    );
}
