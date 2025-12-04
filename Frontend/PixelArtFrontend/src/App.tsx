import React from 'react'
import './App.css'
import InputArea from "./components/InputArea/InputArea.tsx";
import Sidebar from "./components/Sidebar/Sidebar.tsx";
import NewDialogButton from "./components/NewDialogButton/NewDialogButton.tsx";
import WebsiteIcon from "./components/WebsiteIcon/WebsiteIcon.tsx";
import { BrowserRouter } from "react-router-dom";
import LogoutButton from "./components/LogoutButton/LogoutButton.tsx";
import Ribben from "./components/Ribben/Ribben.tsx";

function App() {

  return (
      <>
          <BrowserRouter>
            <Ribben />
          </BrowserRouter>
          <InputArea/>
      </>
  )
}

export default App
