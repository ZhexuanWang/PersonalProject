// src/context/AuthContext.tsx
import React, { createContext, useState, useEffect } from "react";
import api from "../../api/api.ts";

interface User {
    id: string;
    email: string;
    name?: string;
}

interface AuthContextType {
    user: User | null;
    accessToken: string | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>(null!);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);

    async function login(email: string, password: string) {
        const res = await api.post("/auth/login", { email, password });
        setUser(res.data.user);
        setAccessToken(res.data.accessToken);
    }

    async function logout() {
        await api.post("/auth/logout");
        setUser(null);
        setAccessToken(null);
    }

    // auto-refresh token example
    async function refresh() {
        try {
            const res = await api.post("/auth/refresh");
            setAccessToken(res.data.accessToken);
        } catch {
            setUser(null);
            setAccessToken(null);
        }
    }

    useEffect(() => {
        refresh(); // try refresh on mount
    }, []);

    return (
        <AuthContext.Provider value={{ user, accessToken, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
