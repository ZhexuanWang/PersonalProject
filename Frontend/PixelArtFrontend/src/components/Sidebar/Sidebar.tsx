import React, {useState} from "react";
import "./Sidebar.css";
import AuthButton from "../AuthButton/AuthButton.tsx";

const Sidebar: React.FC = () => {
    const [show, setShow] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [conversations, setConversations] = useState<string[]>([]);

    const handleLogin = () => {
        setIsLoggedIn(true);
        setConversations(["Conversation 1", "Conversation 2"]);
    };

    const handleRegister = () => {
        alert("Register clicked");
    };

    const handleCreateConversation = () => {
        setConversations((prev) => [
            ...prev,
            `Conversation ${prev.length + 1}`,
        ]);
    };

    return (
        <>
            <button className="open-btn" onClick={() => setShow(true)}>
                Open Sidebar
            </button>

            <div className={`sidebar ${show ? "open" : ""}`}>
                <div className="sidebar-header">
                    <h2>Copilot‑Style Sidebar</h2>
                    <button className="close-btn" onClick={() => setShow(false)}>
                        ×
                    </button>
                </div>
                <div className="sidebar-body">
                    {!isLoggedIn ? (
                        <AuthButton/>
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
            </div>

            {show && <div className="overlay" onClick={() => setShow(false)}/>}
        </>
    );
};

export default Sidebar;
