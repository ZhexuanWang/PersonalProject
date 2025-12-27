import React, {useState} from "react";
import "./Sidebar.css";
import AuthButton from "../AuthButton/AuthButton.tsx";
import {useUIContext} from "../../contexts/UIContext/UIContext.tsx";

interface Conversation {
    id: string;
    title: string;
    images: string[];
    createdAt: Date;
    prompt?: string;
}

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
    const {
        setShowSidebar,
        showSidebar,
        isLoggedIn,
        conversations,
        setConversations,
        setShowDialog,
        setHasGenerated
    } = useUIContext();

    // 保存当前画廊的函数（将在 InputArea 中调用）
    const saveCurrentGallery = (images: string[], prompt?: string) => {
        if (!isLoggedIn) {
            alert("Please login to save galleries");
            return false;
        }

        const newConversation: Conversation = {
            id: Date.now().toString(),
            title: prompt ? `Gallery: ${prompt.substring(0, 20)}...` : `Gallery ${conversations.length + 1}`,
            images: [...images],
            createdAt: new Date(),
            prompt: prompt
        };

        setConversations((prev) => [newConversation, ...prev]);
        alert("Gallery saved successfully!");
        return true;
    };

    // 加载画廊对话
    const loadGalleryConversation = (conversation: Conversation) => {
        // 存储到 localStorage 以便 Artbook 读取
        localStorage.setItem('loadedGallery', JSON.stringify({
            ...conversation,
            loadedAt: new Date().toISOString()
        }));

        // 关闭侧边栏，打开画廊
        setShowSidebar(false);
        setShowDialog(true);
        setHasGenerated(true);
    };

    // 删除对话
    const deleteConversation = (id: string) => {
        if (window.confirm("Are you sure you want to delete this gallery?")) {
            setConversations(prev => prev.filter(conv => conv.id !== id));
        }
    };

    // 暴露保存函数到全局，让 InputArea 可以调用
    React.useEffect(() => {
        (window as any).saveCurrentGallery = saveCurrentGallery;
        return () => {
            delete (window as any).saveCurrentGallery;
        };
    }, [isLoggedIn, conversations]);

    return (
        <>
            <div className={`sidebar ${showSidebar ? "open" : ""}`}>
                <div className="sidebar-header">
                    <h2>CopilotStyle Sidebar</h2>
                </div>
                <div className="sidebar-body">
                    <button className="sidebar-arrow" onClick={() => setShowSidebar(false)}
                            style={{
                                position: "absolute",
                                top: "50%",
                                right: "-20px",
                                transform: "translateY(-50%)",
                                background: "transparent",
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
                            <button
                                className="btn success"
                                onClick={() => {
                                    // 这个按钮可以在生成图片后，在 Artbook 中调用
                                    alert("Save your current gallery from the Artbook dialog");
                                }}
                                style={{ marginBottom: '15px' }}
                            >
                                💾 Save Current Gallery
                            </button>

                            <h4 style={{ marginTop: '20px', marginBottom: '10px' }}>Gallery History</h4>

                            {conversations.length === 0 ? (
                                <div style={{
                                    padding: '20px',
                                    textAlign: 'center',
                                    color: '#666',
                                    border: '1px dashed #ddd',
                                    borderRadius: '8px'
                                }}>
                                    <div style={{ fontSize: '24px', marginBottom: '10px' }}>🖼️</div>
                                    <p>No galleries saved yet</p>
                                    <p style={{ fontSize: '12px', color: '#999', marginTop: '5px' }}>
                                        Generate images and save them as galleries
                                    </p>
                                </div>
                            ) : (
                                <ul style={{ listStyle: 'none', padding: 0 }}>
                                    {conversations.map((conv) => (
                                        <li
                                            key={conv.id}
                                            style={{
                                                padding: '12px',
                                                border: '1px solid #eee',
                                                borderRadius: '6px',
                                                marginBottom: '8px',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s ease'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.backgroundColor = '#f5f5f5';
                                                e.currentTarget.style.borderColor = '#007bff';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.backgroundColor = '';
                                                e.currentTarget.style.borderColor = '#eee';
                                            }}
                                            onClick={() => loadGalleryConversation(conv)}
                                        >
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontWeight: '500', marginBottom: '4px' }}>
                                                    {conv.title}
                                                </div>
                                                <div style={{
                                                    display: 'flex',
                                                    gap: '10px',
                                                    fontSize: '12px',
                                                    color: '#666'
                                                }}>
                                                    <span>
                                                        {conv.images.length} image{conv.images.length !== 1 ? 's' : ''}
                                                    </span>
                                                    <span>
                                                        {new Date(conv.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', gap: '5px' }}>
                                                <button
                                                    style={{
                                                        padding: '4px 8px',
                                                        background: '#28a745',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '4px',
                                                        cursor: 'pointer',
                                                        fontSize: '12px'
                                                    }}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        loadGalleryConversation(conv);
                                                    }}
                                                >
                                                    Open
                                                </button>
                                                <button
                                                    style={{
                                                        padding: '4px 8px',
                                                        background: '#dc3545',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '4px',
                                                        cursor: 'pointer',
                                                        fontSize: '12px'
                                                    }}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        deleteConversation(conv.id);
                                                    }}
                                                >
                                                    🗑
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}

                            {/* 原有的对话功能保留 */}
                            <h4 style={{ marginTop: '30px', marginBottom: '10px' }}>Saved Conversations</h4>
                            <ul>
                                {conversations.length === 0 ? (
                                    <li>No conversations yet</li>
                                ) : (
                                    conversations.map((conv, idx) => (
                                        <li key={idx}>{conv.title}</li>
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