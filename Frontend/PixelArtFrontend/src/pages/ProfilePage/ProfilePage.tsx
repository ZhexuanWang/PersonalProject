import React, {useEffect} from "react";
import Profile from "../../components/Profile/Profile";
import "./ProfilePage.css";
import {useUIContext} from "../../contexts/UIContext/UIContext.tsx"; // optional CSS module or stylesheet

export default function ProfilePage() {
    const {isLoggedIn}=useUIContext();
    useEffect(() => {
        console.log("当前LoggedIn状态："+isLoggedIn);
    }, []);
    return (
        <div className="profile-page">
            <h1 className="profile-title">My Profile</h1>
            <div className="profile-container">
                <Profile />
            </div>
        </div>
    );
}
