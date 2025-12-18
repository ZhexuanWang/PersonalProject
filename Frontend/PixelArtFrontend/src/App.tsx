import React from 'react'
import './App.css'
import {Route, Routes} from "react-router-dom";
import {useUIContext} from "./contexts/UIContext/UIContext.tsx";
import ProfilePage from "./pages/ProfilePage/ProfilePage.tsx";
import ChatPage from "./pages/ChatPage/ChatPage.tsx";
import AuthPage from "./pages/AuthPage/AuthPage.tsx";

function App() {
    const {isLoggedIn} = useUIContext();
    return (
        <>
            <Routes>
                <Route path="/" element={<ChatPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/auth" element={<AuthPage />}></Route>
            </Routes>
        </>
    )
}

export default App
