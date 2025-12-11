import axios from "axios";

const isLocalhost = window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1';

const api = axios.create({
    baseURL: isLocalhost
        ? "http://localhost:5000"  // 本地开发
        : "https://personal-project-backend-masy.onrender.com",  // 生产环境
    withCredentials: true,
});

// 可选：添加日志确认
console.log('当前环境:', isLocalhost ? '本地开发' : '生产环境');
console.log('API地址:', isLocalhost ? "http://localhost:5000" : "https://personal-project-backend-masy.onrender.com");

// 添加调试信息
console.log('环境诊断:', {
    主机名: window.location.hostname,
    完整URL: window.location.href,
    是localhost吗: isLocalhost,
    使用的API: isLocalhost ? "http://localhost:5000" : "https://personal-project-backend-masy.onrender.com"
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
