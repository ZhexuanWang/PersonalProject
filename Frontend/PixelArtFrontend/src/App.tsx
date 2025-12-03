import React from 'react'
import './App.css'
import InputArea from "./components/InputArea/InputArea.tsx";
import Sidebar from "./components/Sidebar/Sidebar.tsx";
import NewDialogButton from "./components/NewDialogButton/NewDialogButton.tsx";
import WebsiteIcon from "./components/WebsiteIcon/WebsiteIcon.tsx";
import { BrowserRouter } from "react-router-dom";

function App() {

  return (
      <>
          <BrowserRouter>
              <WebsiteIcon />
          </BrowserRouter>
          <Sidebar />
          <NewDialogButton />
          <InputArea/>
      </>
  )
}

export default App
