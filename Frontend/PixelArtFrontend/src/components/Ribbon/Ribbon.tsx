import React from "react";
import { useUIContext } from "../../contexts/UIContext/UIContext";
import "./Ribbon.css"
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
                <NewDialogButton />
                <SidebarButton />
            </div>
        </>
    );
};

export default Ribbon;
