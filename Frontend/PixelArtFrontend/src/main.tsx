import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {UIProvider} from "./contexts/UIContext/UIContext.tsx";
import {BrowserRouter} from "react-router-dom";

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <BrowserRouter>
          <UIProvider>
              <App />
          </UIProvider>
      </BrowserRouter>
  </StrictMode>
)
