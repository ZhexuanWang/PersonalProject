import React from 'react'
import './App.css'
import InputArea from "./components/InputArea/InputArea.tsx";
import Ribbon from "./components/Ribbon/Ribbon.tsx";
import AuthArea from "./components/AuthArea/AuthArea.tsx";
import {Route, Routes} from "react-router-dom";
import Profile from "./components/Profile/Profile.tsx";

function App() {

    return (
        <>
            <Routes>
                <Route path="/" element={<></>} /> 
                <Route path="/profile" element={<Profile />}></Route>
            </Routes>
            <Ribbon/>
            <AuthArea/>
            <InputArea/>
        </>
    )
}

export default App
