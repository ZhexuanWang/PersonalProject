import React, {useEffect, useState} from "react";
import "./Sidebar.css";
import AuthButton from "../AuthButton/AuthButton.tsx";
import {useUIContext} from "../../contexts/UIContext/UIContext.tsx";

interface Conversation {
    id: string;
    title: string;
    images: string[];
    createdAt: Date;
    updatedAt: Date; // 添加更新时间
    prompt?: string;
    isNew?: boolean; // 标记是否是新对话
    source?: 'current' | 'history'; // 标记来源
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
        setHasGenerated,
    } = useUIContext();

    const [currentConversationId, setCurrentConversationId] = useState<string | undefined>(() => {
        // 从 localStorage 恢复上次的对话ID
        return localStorage.getItem('currentGalleryId') || undefined;
    });

    // Sidebar.tsx 中的 saveCurrentGallery 函数
    const saveCurrentGallery = (images: string[], prompt?: string) => {
        console.log("=== saveCurrentGallery 调用 ===");
        console.log("当前选中的 currentConversationId:", currentConversationId);
        console.log("localStorage currentGalleryId:", localStorage.getItem('currentGalleryId'));
        // console.log("图片数量:", images.length);
        // console.log("提示词:", prompt);

        if (!isLoggedIn) {
            alert("Please login to save galleries");
            return false;
        }

        if (!images || images.length === 0) {
            alert("No images to save!");
            return false;
        }

        let updatedConversations: ({
            createdAt: Date;
            images: string[];
            id: string;
            isNew: boolean;
            title: string;
            prompt: string | undefined;
            updatedAt: Date
        } | Conversation)[];

        if (currentConversationId) {
            // 更新现有对话
            // console.log("更新现有对话:", currentConversationId);
            updatedConversations = conversations.map(conv => {
                if (conv.id === currentConversationId) {
                    return {
                        ...conv,
                        images: [...images], // 更新图片
                        prompt: prompt || conv.prompt,
                        updatedAt: new Date(),
                        isNew: false // 标记为已保存
                    };
                }
                return conv;
            });
        } else {
            // 创建新对话
            // console.log("创建新对话");
            const newId = generateUniqueId();
            const newConversation: Conversation = {
                id: newId,
                title: prompt ? `Gallery: ${prompt.substring(0, 20)}...` : `Gallery ${conversations.length + 1}`,
                images: [...images],
                createdAt: new Date(),
                updatedAt: new Date(),
                prompt: prompt,
                isNew: true,
                source: 'current'
            };
            console.log("newConversation.id: "+newConversation.id);
            updatedConversations = [newConversation, ...conversations];
        }

        // console.log("更新后的对话列表:", updatedConversations);

        // 保存到状态和 localStorage
        setConversations(updatedConversations);
        localStorage.setItem('galleryConversations', JSON.stringify(updatedConversations));

        alert(currentConversationId ? "✅ Gallery updated!" : "✅ Gallery saved successfully!");
        return true;
    };

    // 生成唯一ID的函数
    const generateUniqueId = (): string => {
        return `gallery_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    };

    // 加载画廊对话
    const loadGalleryConversation = (conversation: Conversation) => {
        localStorage.setItem('currentGalleryId', conversation.id); // 保存到 localStorage
        setCurrentConversationId(conversation.id);
        // console.log("=== 加载对话 ===");
        // console.log("对话:", conversation);
        // console.log("图片数组:", conversation.images);
        // console.log("图片数量:", conversation.images?.length);

        // if (!conversation.images || conversation.images.length === 0) {
        //     alert("This gallery has no images!");
        //     return;
        // }

        // 方式1：使用全局事件传递数据（首选）
        window.dispatchEvent(new CustomEvent('loadGallery', {
            detail: {
                images: conversation.images, // 确保传递图片数组
                title: conversation.title,
                prompt: conversation.prompt,
                id: conversation.id
            }
        }));
    };

    // 删除对话
    const deleteConversation = (id: string) => {
        if (window.confirm("Are you sure you want to delete this gallery?")) {
            const updatedConversations = conversations.filter(conv => conv.id !== id);
            setConversations(updatedConversations);
            localStorage.setItem('galleryConversations', JSON.stringify(updatedConversations));

            // 关键：如果删除的是当前正在查看的对话，清理相关状态
            const currentGalleryId = localStorage.getItem('currentGalleryId');
            if (currentGalleryId === id) {
                // console.log("删除的是当前对话，清理状态");
                cleanupCurrentGalleryState();
            }

            alert("✅ Gallery deleted!");
        }
    };

    // 添加调试日志
    useEffect(() => {
        // console.log("=== Sidebar 对话状态 ===");
        // console.log("conversations 长度:", conversations.length);
        // console.log("conversations 内容:", conversations);

        // 检查 localStorage
        const saved = localStorage.getItem('galleryConversations');
        // console.log("localStorage galleryConversations:", saved);
        // console.log("localStorage currentGalleryId:", localStorage.getItem('currentGalleryId'));
        // console.log("currentConversationId: "+currentConversationId);

        if (conversations.length === 0 && saved) {
            console.warn("⚠️ conversations 为空但 localStorage 有数据！");
            try {
                const parsed = JSON.parse(saved);
                // console.log("解析后的数据:", parsed);
            } catch (error) {
                // console.error("解析失败:", error);
            }
        }
    }, [conversations, currentConversationId]);

    // 暴露保存函数到全局，让 InputArea 可以调用
    React.useEffect(() => {
        (window as any).saveCurrentGallery = saveCurrentGallery;
        return () => {
            delete (window as any).saveCurrentGallery;
        };
    }, [saveCurrentGallery]);

    // 创建新画廊函数
    const handleCreateNewGallery = () => {
        if (!isLoggedIn) {
            alert("Please login to create galleries");
            return;
        }

        // 清理当前状态
        cleanupCurrentGalleryState();

        // // 创建新对话
        // const newId = generateUniqueId();
        // const newConversation: Conversation = {
        //     id: newId,
        //     title: "Gallery " + (conversations.length+1),
        //     images: [],
        //     createdAt: new Date(),
        //     updatedAt: new Date(),
        //     isNew: true
        // };
        //
        // // 保存到对话列表
        // const updatedConversations = [newConversation, ...conversations];
        // setConversations(updatedConversations);
        // localStorage.setItem('galleryConversations', JSON.stringify(updatedConversations));
        //
        // // 加载这个新对话
        // loadGalleryConversation(newConversation);
        //
        // console.log("✅ 创建新对话，ID:", newId);

        //清空currentComversationId后直接关闭sidebar并居中inputArea
        setShowSidebar(false);
    };

    // 清理当前画廊状态的函数
    const cleanupCurrentGalleryState = () => {
        console.log("=== 清理当前画廊状态 ===");

        // 1. 清理 localStorage
        localStorage.removeItem('currentGalleryId');
        localStorage.removeItem('lastLoadedGallery');
        localStorage.removeItem('loadedGallery');

        // 2. 清理 window 对象
        delete (window as any).currentGalleryId;

        // 3. 通知 InputArea 清理状态
        window.dispatchEvent(new CustomEvent('clearCurrentGallery'));

        console.log("✅ 当前画廊状态已清理");
    };

    return (
        <>
            <div className={`sidebar ${showSidebar ? "open" : ""}`}>
                <div className="sidebar-header">
                    <h2>Copilot Style Sidebar</h2>
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
                                onClick={()=>handleCreateNewGallery()}
                                style={{ marginBottom: '15px' }}
                            >
                                ＋ Create New Gallery
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