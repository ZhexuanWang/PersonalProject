import React, {useState} from "react";
import "./Sidebar.css";
import AuthButton from "../AuthButton/AuthButton.tsx";
import {useUIContext} from "../../contexts/UIContext/UIContext.tsx";

export const SidebarButton: React.FC = () => {
    const {setShowSidebar} = useUIContext();

    return (
        <>
            <button className="" onClick={() => setShowSidebar(true)}>
                Open Sidebar
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
                    <button className="close-btn" onClick={() => setShowSidebar(false)}>
                        ×
                    </button>
                </div>
                <div className="sidebar-body">
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

            {showSidebar && <div className="overlay" onClick={() => setShowSidebar(false)}/>}
        </>
    );
};

export default Sidebar;
