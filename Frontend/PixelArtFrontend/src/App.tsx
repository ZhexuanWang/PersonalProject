import React from 'react'
import './App.css'
import InputArea from "./components/InputArea/InputArea.tsx";
import Ribbon from "./components/Ribbon/Ribbon.tsx";
import AuthArea from "./components/AuthArea/AuthArea.tsx";
import {Route, Routes} from "react-router-dom";
import Profile from "./components/Profile/Profile.tsx";
import {useUIContext} from "./contexts/UIContext/UIContext.tsx";

function App() {
    const {isLoggedIn} = useUIContext();
    return (
        <>
            <Routes>
                <Route path="/" element={<></>} />
            </Routes>
            {isLoggedIn&&<Profile />}
            <Ribbon/>
            <AuthArea/>
            <InputArea/>
        </>
    )
}

export default App
