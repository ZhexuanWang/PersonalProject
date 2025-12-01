import React, { useState } from 'react'
import './App.css'
import InputArea from "./components/InputArea/InputArea.tsx";
import AuthButton from "./components/AuthButton/AuthButton";
import Sidebar from "./components/Sidebar/Sidebar";

function App() {

    const handleSignup = () => {
        console.log("Sign Up clicked");
        // TODO: redirect to signup page or open modal
    };
  return (
      <>
          <Sidebar></Sidebar>
          <div className="container mt-5">
              <h2>Welcome to PixelArtWebsite</h2>
              <AuthButton/>
          </div>
          <InputArea/>
      </>
  )
}

export default App
