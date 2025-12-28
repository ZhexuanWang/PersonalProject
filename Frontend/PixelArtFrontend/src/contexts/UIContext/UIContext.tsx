import React, {createContext, useContext, useEffect, useRef, useState} from "react";

export interface Conversation {
    id: string;
    title: string;
    images: string[];
    createdAt: Date;
    updatedAt: Date; // 添加更新时间
    prompt?: string;
    isNew?: boolean; // 标记是否是新对话
    source?: 'current' | 'history'; // 标记来源
}

interface UIContextType {
    showDialog: boolean;
    setShowDialog: React.Dispatch<React.SetStateAction<boolean>>;
    showSidebar: boolean;
    setShowSidebar: React.Dispatch<React.SetStateAction<boolean>>;
    hasGenerated: boolean;
    setHasGenerated: React.Dispatch<React.SetStateAction<boolean>>;
    isLoggedIn: boolean;
    setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
    requestTokenRef: React.RefObject<number>;
    conversations: Conversation[],
    setConversations: React.Dispatch<React.SetStateAction<Conversation[]>>;
    mode: string;
    setMode: React.Dispatch<React.SetStateAction<"none" | "login" | "register">>;
}

const UIContext = createContext<UIContextType>({
    showDialog: false,
    setShowDialog: () => {
    },
    showSidebar: false,
    setShowSidebar: () => {
    },
    hasGenerated: false,
    setHasGenerated: () => {
    },
    isLoggedIn: false,
    setIsLoggedIn: () => {
    },
    requestTokenRef: {current: 0},
    conversations: [],
    setConversations: () => {
    },
    mode: "",
    setMode: () => {
    },
});

export const UIProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [showDialog, setShowDialog] = useState(false);
    const [showSidebar, setShowSidebar] = useState(false);
    const [hasGenerated, setHasGenerated] = useState(false);
    const [mode, setMode] = useState<"none" | "login" | "register">("none");
    const requestTokenRef = useRef(0);

    // 从 localStorage 恢复登录状态
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        const saved = localStorage.getItem('isLoggedIn');
        console.log("从 localStorage 恢复登录状态:", saved);
        return saved === 'true'; // 严格比较
    });

    // 生成唯一ID的函数
    const generateUniqueId = (): string => {
        return `gallery_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    };
    // 从 localStorage 恢复对话 - 确保包含所有字段
    const [conversations, setConversations] = useState<Conversation[]>(() => {
        try {
            const saved = localStorage.getItem('galleryConversations');
            console.log("=== UIProvider 初始化对话 ===");
            console.log("从 localStorage 获取:", saved);

            if (saved) {
                const parsed = JSON.parse(saved);
                console.log("解析后的数据:", parsed);
                console.log("数组长度:", parsed.length);

                // 转换日期
                const restored = parsed.map((conv: any): Conversation => {
                    console.log("转换对话:", conv.id, conv.title);
                    return {
                        id: conv.id || generateUniqueId(),
                        title: conv.title || `Gallery ${Date.now()}`,
                        images: conv.images || [],
                        createdAt: new Date(conv.createdAt || Date.now()),
                        updatedAt: new Date(conv.updatedAt || conv.createdAt || Date.now()),
                        prompt: conv.prompt,
                        isNew: conv.isNew !== undefined ? conv.isNew : false
                    };
                });

                console.log("恢复后的对话:", restored);
                return restored;
            }
        } catch (error) {
            console.error("恢复对话失败:", error);
        }
        console.log("返回空数组");
        return [];
    });

    // 监听 conversations 变化并保存
    useEffect(() => {
        localStorage.setItem('galleryConversations', JSON.stringify(conversations));
        console.log("保存对话到 localStorage:", conversations.length);
    }, [conversations]);

    // 监听 isLoggedIn 变化并保存
    useEffect(() => {
        if (isLoggedIn) {
            localStorage.setItem('isLoggedIn', 'true');
            console.log("保存登录状态: true");
        } else {
            localStorage.removeItem('isLoggedIn');
            console.log("清除登录状态");
        }
    }, [isLoggedIn]);

    useEffect(() => {
        // 页面加载时清理无效的对话ID
        const cleanupInvalidGalleryIds = () => {
            console.log("页面加载：清理无效的对话ID");

            const currentId = localStorage.getItem('currentGalleryId');
            if (!currentId) return;

            const savedConversations = localStorage.getItem('galleryConversations');
            if (savedConversations) {
                try {
                    const conversations = JSON.parse(savedConversations);
                    const conversationExists = conversations.some((conv: any) => conv.id === currentId);

                    if (!conversationExists) {
                        console.warn("清理无效的 currentGalleryId:", currentId);
                        localStorage.removeItem('currentGalleryId');
                        localStorage.removeItem('lastLoadedGallery');
                        delete (window as any).currentGalleryId;
                    }
                } catch (error) {
                    console.error("清理检查失败:", error);
                }
            }
        };

        cleanupInvalidGalleryIds();
    }, []);

    return (
        <UIContext.Provider value={{
            showDialog,
            setShowDialog,
            showSidebar,
            setShowSidebar,
            hasGenerated,
            setHasGenerated,
            isLoggedIn,
            setIsLoggedIn,
            requestTokenRef,
            conversations,
            setConversations,
            mode,
            setMode
        }}>
            {children}
        </UIContext.Provider>
    );
}

export const useUIContext = () => {
    const ctx = useContext(UIContext);
    if (!ctx) throw new Error("useUIContext must be used within a UIProvider");
    return ctx;
};
