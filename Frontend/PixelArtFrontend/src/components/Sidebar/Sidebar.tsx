import React, {useState} from "react";
import "./Sidebar.css";
import AuthButton from "../AuthButton/AuthButton.tsx";
import {useUIContext} from "../../contexts/UIContext/UIContext.tsx";

export const SidebarButton: React.FC = () => {
    const {setShowSidebar} = useUIContext();

    return (
        <>
            <button className="" onClick={() => setShowSidebar(true)}>
                ⚙
            </button>
        </>
    );
}

const Sidebar: React.FC = () => {
    const {setShowSidebar, showSidebar, isLoggedIn, conversations, setConversations} = useUIContext();

    const handleCreateConversation = () => {
        setConversations((prev) => [
            ...prev,
            `Conversation ${prev.length + 1}`,
        ]);
    };

    return (
        <>
            <div className={`sidebar ${showSidebar ? "open" : ""}`}>
                <div className="sidebar-header">
                    <h2>Copilot‑Style Sidebar</h2>
                </div>
                <div className="sidebar-body">
                    <button className="sidebar-arrow" onClick={() => setShowSidebar(false)}
                            style={{
                                position: "absolute",
                                top: "50%",
                                right: "-20px", // makes it exceed the sidebar edge
                                transform: "translateY(-50%)",
                                background: "transparent", // no circle background
                                border: "none",
                                fontSize: "20px",
                                cursor: "pointer",
                                outline: "none",
                                boxShadow: "none",
                            }}>
                        ◀
                    </button>
                    {!isLoggedIn ? (
                        <>
                            <div>Login to save your dialogs.</div>
                        </>
                    ) : (
                        <>
                            <button className="btn success" onClick={handleCreateConversation}>
                                Create New Conversation
                            </button>
                            <h4>Saved Conversations</h4>
                            <ul>
                                {conversations.length === 0 ? (
                                    <li>No conversations yet</li>
                                ) : (
                                    conversations.map((conv, idx) => (
                                        <li key={idx}>{conv}</li>
                                    ))
                                )}
                            </ul>
                        </>
                    )}
                </div>
                <AuthButton/>
            </div>

            {showSidebar && <div className="" onClick={() => setShowSidebar(false)}/>}
        </>
    );
};

export default Sidebar;
