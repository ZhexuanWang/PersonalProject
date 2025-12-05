import React, {useState} from "react";
import "./AuthButton.css"
import {useUIContext} from "../UIContext/UIContext"
import LogoutButton from "../LogoutButton/LogoutButton.tsx";
import { useAuth } from "./../../hooks/useAuth";

const AuthButton: React.FC = () => {
    const {isLoggedIn, setIsLoggedIn} = useUIContext();
    const { login, register } = useAuth();


    async function handleLogin() {
        try {
            await login("test@example.com", "mypassword"); // call the hook function
            alert("Logged in!");
            setIsLoggedIn(true);
        } catch (err) {
            console.error(err);
            alert("Login failed");
        }
    }

    async function handleRegister() {
        try {
            const user = await register("test@example.com", "mypassword");
            alert(`Registered user: ${user.email}`);
        } catch (err) {
            console.error(err);
            alert("Registration failed");
        }
    }

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
