import React, {useState} from "react";
import "./AuthButton.css"

const AuthButton: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleLogin = () => {
        setIsLoggedIn(true);
    };

    const handleRegister = () => {
        alert("Register clicked");
    };

    return (
        <>
            <p className="message">
                Log in or register to save your conversation history.
            </p>
            <button className="btn" onClick={handleLogin}>
                Log In
            </button>
            <button className="btn outline" onClick={handleRegister}>
                Register
            </button>
        </>
    );
};

export default AuthButton;
