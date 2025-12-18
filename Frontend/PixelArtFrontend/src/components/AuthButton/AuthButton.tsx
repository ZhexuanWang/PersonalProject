import React from "react";
import "./AuthButton.css"
import {useUIContext} from "../../contexts/UIContext/UIContext"
import LogoutButton from "../LogoutButton/LogoutButton.tsx";
import {useNavigate} from "react-router-dom";

const AuthButton: React.FC = () => {
    const {isLoggedIn, setMode} = useUIContext();
    const navigate = useNavigate();

    async function showPanelLogin() {
        alert("Show login panel!");
        setMode("login");
        navigate("/auth");
    }

    async function showPanelRegister() {
        alert(`Show registration panel!`);
        setMode("register");
        navigate("/auth");
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
