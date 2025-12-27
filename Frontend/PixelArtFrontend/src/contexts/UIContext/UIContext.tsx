import React, {createContext, useContext, useEffect, useRef, useState} from "react";

export interface Conversation {
    id: string;
    title: string;
    images: string[]; // 画廊图片数组
    createdAt: Date;
    prompt?: string; // 可选的提示词
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

    // 从 localStorage 恢复对话
    const [conversations, setConversations] = useState<Conversation[]>(() => {
        const saved = localStorage.getItem('conversations');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                // 转换日期字符串回 Date 对象
                return parsed.map((conv: any) => ({
                    ...conv,
                    createdAt: new Date(conv.createdAt)
                }));
            } catch (e) {
                console.error("恢复对话失败:", e);
                return [];
            }
        }
        return [];
    });

    // 监听 conversations 变化并保存
    useEffect(() => {
        localStorage.setItem('conversations', JSON.stringify(conversations));
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
