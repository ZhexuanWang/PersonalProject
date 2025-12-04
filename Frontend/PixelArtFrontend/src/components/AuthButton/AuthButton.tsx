import React, {useState} from "react";
import "./AuthButton.css"
import {useUIContext} from "../UIContext/UIContext"
import LogoutButton from "../LogoutButton/LogoutButton.tsx";

const AuthButton: React.FC = () => {
    const {isLoggedIn, setIsLoggedIn} = useUIContext();
    const handleLogin = () => {
        setIsLoggedIn(true);
    };

    const handleRegister = () => {
        alert("Register clicked");
    };

    return (
        <>
            {!isLoggedIn ? (
                <>
                    <button className="btn outline" onClick={handleRegister}>
                        Register
                    </button>
                    <button className="btn" onClick={handleLogin}>
                        Log In
                    </button>
                </>
            ) : (<LogoutButton/>
            )}
        </>
    );
};

export default AuthButton;
