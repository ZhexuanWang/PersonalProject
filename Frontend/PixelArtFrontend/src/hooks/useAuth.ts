import {useEffect, useState} from "react";
import api from "../api/api";

export function useAuth() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const getToken = () => localStorage.getItem("accessToken");

// 修改 setToken 函数，接受两种参数格式
    const setToken = (tokenData: string | { access_token?: string; accessToken?: string }) => {
        let token: string | null = null;

        // 情况1：直接传入 token 字符串
        if (typeof tokenData === 'string') {
            token = tokenData;
        }
        // 情况2：传入响应数据对象
        else if (typeof tokenData === 'object') {
            token = tokenData.access_token || tokenData.accessToken || null;
        }

        if (!token) {
            console.error('❌ setToken: 无法提取 token');
            console.log('传入的数据:', tokenData);
            return;
        }

        console.log('✅ setToken: 存储 token (长度:', token.length, ')');
        localStorage.setItem("accessToken", token);
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    };

    const removeToken = () => {
        localStorage.removeItem("accessToken");
        delete api.defaults.headers.common["Authorization"];
    };

    useEffect(() => {
        const token = getToken();
        if (token) {
            api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

            api.get("/me")
                .then(res => setUser(res.data))
                .catch((err) => {
                    console.error("自动登录失败:", err);
                    if (err.response?.status === 401) {
                        removeToken();
                    }
                    setUser(null);
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    async function register(email: string, password: string) {
        try {
            console.log("🚀 注册流程开始...");
            console.log("📧 邮箱:", email);

            const res = await api.post("/auth/register", {email, password});

            console.log("📊 注册响应状态:", res.status);
            console.log("📦 响应数据:", res.data);
            console.log("🔑 可用字段:", Object.keys(res.data));

            // 详细检查 token 字段
            console.log("🔍 Token 字段检查:");
            console.log("  - access_token:", res.data.access_token);
            console.log("  - accessToken:", res.data.accessToken);
            console.log("  - token:", res.data.token);

            // 提取 token
            const token = res.data.access_token || res.data.accessToken || res.data.token;

            if (token) {
                console.log("✅ 找到 token，自动登录");
                setToken(token);
            } else {
                console.log("ℹ️  注册成功，但未返回 token");
                console.log("ℹ️  这可能是因为：1. 后端设计如此 2. 需要手动登录");
            }

            // 提取用户信息
            const userData = res.data.user || {
                id: res.data.id,
                email: res.data.email || email
            };

            setUser(userData);

            console.log("🎉 注册流程完成");
            return res.data;
        } catch (error) {
            // 特殊处理 409 Conflict（用户已存在）
            if (error.response?.status === 409) {
                console.log("⚠️ 用户已存在，请直接登录");
                throw new Error("该邮箱已被注册，请直接登录");
            }

            console.error("💥 注册错误:", error);
            throw error;
        }
    }

    async function login(email: string, password: string) {
        console.log("📤 Sending login request:", { email, password });

        const res = await api.post("/auth/login", { email, password });

        console.log("📥 Full login response data:", res.data);
        console.log("📥 List of response fields:", Object.keys(res.data));

        // 🔧 关键修复：兼容两种字段名
        const token = res.data.access_token || res.data.accessToken; // 先检查下划线，再检查驼峰
        const userData = res.data.user; // 用户信息

        console.log("🔑 Extracted token:", token ? "✅ Present" : "❌ Absent");

        if (!token) {
            console.error("❌ 所有可用字段:", Object.keys(res.data));
            throw new Error(`Login failed: No token received. Backend returned: ${JSON.stringify(res.data)}`);
        }

        console.log("✅ Token value (前20位):", token.substring(0, 20) + "...");

        setToken(token); // 存储并设置请求头
        setUser(userData || { email }); // 如果 user 字段不存在，使用邮箱
    }

    async function logout() {
        try {
            await api.post("/auth/logout");
        } catch (err) {
            console.warn("API call to log out failed, but continue cleaning up the frontend state", err);
        } finally {
            removeToken(); // 清理令牌和请求头
            setUser(null);
        }
    }

    async function getProfile() {
        const res = await api.get("/me");
        setUser(res.data);
    }

    return {user, loading, login, logout, getProfile, register};
}
