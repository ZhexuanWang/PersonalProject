import React, {useState} from "react";
import {useAuth} from "../../hooks/useAuth.ts";
import {useUIContext} from "../../contexts/UIContext/UIContext.tsx";
import {useNavigate} from "react-router-dom";

export default function AuthArea() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const {login, register} = useAuth();
    const {isLoggedIn, setIsLoggedIn, mode, setMode} = useUIContext();
    //const navigate = useNavigate();

    async function handleLogin() {
        try {
            await login(email, password);
            //navigate("/profile");
            setIsLoggedIn(true);
        } catch (err) {
            console.error(err);
            alert("Login failed");
        }
    }

    async function handleRegister() {
        try {
            await register(email, password);
            await login(email, password); // immediately log in after register
            setIsLoggedIn(true);
            //navigate("/profile"); // redirect
        } catch (err) {
            console.error(err);
            alert("Registration failed");
        }
    }

    return (
        <>
            {/* Top-left icon button */}
            <button
                className="open-panel-btn"
                onClick={() => {
                    setMode("register"); // default to register
                }}
            >
                ☰ {/* replace with an icon */}
            </button>

            <div>


                {mode === "login" && (
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleLogin();
                        }}
                    >
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button type="submit">Login</button>
                    </form>
                )}

                {mode === "register" && (
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleRegister();
                        }}
                    >
                        <input
                            type="text"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button type="submit">Register</button>
                    </form>
                )}
            </div>
        </>

    );
}
