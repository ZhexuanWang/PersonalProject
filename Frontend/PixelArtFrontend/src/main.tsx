import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {UIProvider} from "./contexts/UIContext/UIContext.tsx";
import {BrowserRouter} from "react-router-dom";

const container = document.getElementById('root');
if (!container) {
    throw new Error('找不到 #root 元素，请检查 public/index.html');
}
const root = createRoot(container);
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </React.StrictMode>
);
