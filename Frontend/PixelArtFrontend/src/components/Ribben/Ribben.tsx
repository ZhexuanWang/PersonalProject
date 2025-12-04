import React from "react";
import { useUIContext } from "../UIContext/UIContext";
import "./Ribben.css"
import AuthButton from "../AuthButton/AuthButton.tsx";
import Sidebar from "../Sidebar/Sidebar.tsx";
import NewDialogButton from "../NewDialogButton/NewDialogButton.tsx";
import {SidebarButton} from "../Sidebar/Sidebar.tsx";

const Ribbon: React.FC = () => {
    const {
        showSidebar,
    } = useUIContext();

    return (
        <>
            <div className={`ribbon ${showSidebar ? "faded" : ""}`}>
                <AuthButton />
                <NewDialogButton />
                <SidebarButton />
            </div>
            <Sidebar />
        </>
    );
};

export default Ribbon;
