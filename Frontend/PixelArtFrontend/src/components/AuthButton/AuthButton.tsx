import React from "react";
import "./AuthButton.css"
import {useUIContext} from "../../contexts/UIContext/UIContext"
import LogoutButton from "../LogoutButton/LogoutButton.tsx";

const AuthButton: React.FC = () => {
    const {isLoggedIn, setMode} = useUIContext();

    async function showPanelLogin() {
        alert("Show login panel!");
        setMode("login");
    }

    async function showPanelRegister() {
        alert(`Show registration panel!`);
        setMode("register");
    }

    return (
        <>
            {!isLoggedIn ? (
                <>
                    <button className="btn outline" onClick={showPanelRegister}>
                        Register
                    </button>
                    <button className="btn" onClick={showPanelLogin}>
                        Log In
                    </button>
                </>
            ) : (<LogoutButton/>
            )}
        </>
    );
};

export default AuthButton;
