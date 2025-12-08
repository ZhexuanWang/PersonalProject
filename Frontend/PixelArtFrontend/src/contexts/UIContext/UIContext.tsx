import React, {createContext, useContext, useRef, useState} from "react";

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
    conversations: string[],
    setConversations: React.Dispatch<React.SetStateAction<string[]>>;
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
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [conversations, setConversations] = useState<string[]>([]);
    const [mode, setMode] = useState<"none" | "login" | "register">("none");

    const requestTokenRef = useRef(0);

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
            setMode,
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
