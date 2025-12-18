import React from "react";
import InputArea from "../../components/InputArea/InputArea";
import Ribbon from "../../components/Ribbon/Ribbon.tsx";
import Sidebar from "../../components/Sidebar/Sidebar.tsx";
import {useUIContext} from "../../contexts/UIContext/UIContext.tsx";

function ChatPage() {
    const {showSidebar} = useUIContext();

    return (
        <div
            style={{
                display: "flex",
                height: "100vh",
                width: "100%",
                overflow: "hidden",
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0
            }}>

            <div
                style={{
                    width: showSidebar ? "250px" : "0px",
                    transition: "width 0.3s ease",
                    flexShrink: 0,
                    overflow: "hidden",
                }}>
                <Sidebar/>
            </div>

            <div
                style={{
                    flex: 1,
                    minWidth: 0,
                    position: "relative",
                    overflow: "hidden",
                }}>

                <div
                    style={{
                        position: "absolute",
                        zIndex: 1100,
                    }}>
                    <Ribbon/>
                </div>

                <div
                    style={{
                        height: "100%",
                        overflow: "auto",
                    }}>
                    <InputArea/>
                </div>
            </div>
        </div>
    );
}

export default ChatPage;