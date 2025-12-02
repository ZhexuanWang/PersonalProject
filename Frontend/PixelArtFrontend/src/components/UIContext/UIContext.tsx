import {createContext, useContext, useState} from "react";

interface UIContextType {
    showDialog: boolean;
    setShowDialog: React.Dispatch<React.SetStateAction<boolean>>;
    showSidebar: boolean;
    setShowSidebar: React.Dispatch<React.SetStateAction<boolean>>;
    hasGenerated: boolean;
    setHasGenerated: React.Dispatch<React.SetStateAction<boolean>>;
    isLoggedIn: boolean;
    setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

const UIContext = createContext<UIContextType>({
    showDialog: false,
    setShowDialog: () => {},
    showSidebar: false,
    setShowSidebar: () => {},
    hasGenerated: false,
    setHasGenerated: () => {},
    isLoggedIn: false,
    setIsLoggedIn: () => {},
});

export function UIProvider({ children }) {
    const [showDialog, setShowDialog] = useState(false);
    const [showSidebar, setShowSidebar] = useState(false);
    const [hasGenerated, setHasGenerated] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    return (
        <UIContext.Provider value={{ showDialog, setShowDialog, showSidebar, setShowSidebar, hasGenerated, setHasGenerated, isLoggedIn, setIsLoggedIn }}>
            {children}
        </UIContext.Provider>
    );
}

export const useUIContext = () => {
    const ctx = useContext(UIContext);
    if (!ctx) throw new Error("useUIContext must be used within a UIProvider");
    return ctx;
};
