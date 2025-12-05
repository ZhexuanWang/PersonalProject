import { useState } from "react";
import api from "../api/api";

export function useAuth() {
    const [user, setUser] = useState<any>(null);

    async function register(email: string, password: string) {
        const res = await api.post("/auth/register", { email, password });
        return res.data; // { id, email }
    }

    async function login(email: string, password: string) {
        const res = await api.post("/auth/login", { email, password });
        localStorage.setItem("access_token", res.data.access_token);
        setUser({ email });
    }

    async function logout() {
        await api.post("/auth/logout");
        localStorage.removeItem("access_token");
        setUser(null);
    }

    async function getProfile() {
        const res = await api.get("/profile");
        setUser(res.data);
    }

    return { user, login, logout, getProfile, register };
}
