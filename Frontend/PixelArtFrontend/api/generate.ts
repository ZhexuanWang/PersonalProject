// api/generate.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";

// 预定义的图片URL数组 - 这里是一些免费的占位图片
const MOCK_IMAGES = [
    "https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=800&auto=format&fit=crop", // 书籍
    "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&auto=format&fit=crop", // 艺术
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop", // 人物
    "https://images.unsplash.com/photo-1519681393784-d120267933ba?w-800&auto=format&fit=crop", // 风景
    "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&auto=format&fit=crop", // 猫
    "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=800&auto=format&fit=crop", // 工作台
    "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=800&auto=format&fit=crop", // 建筑
    "https://images.unsplash.com/photo-1579546929662-711aa81148cf?w=800&auto=format&fit=crop", // 渐变背景
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop", // 山脉
    "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&auto=format&fit=crop", // 冲浪
    "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=800&auto=format&fit=crop", // 城市夜景
    "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&auto=format&fit=crop", // 抽象艺术
    "https://images.unsplash.com/photo-1550684376-efcbd6e3f031?w=800&auto=format&fit=crop", // 森林
    "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=800&auto=format&fit=crop", // 山间小路
    "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&auto=format&fit=crop", // 星空
];
type ExtendedVercelRequest = VercelRequest & {
    body: {
        prompt: string;
    };
    method: string;
    status?: number;
};

type ExtendedVercelResponse = VercelResponse & {
    status: (code: number) => VercelResponse;
    json: (data: any) => void;
};

export default async function handler(req: ExtendedVercelRequest, res: ExtendedVercelResponse) {
    const response = res as any;

    if (req.method !== "POST") {
        return response.status(405).json({ error: "Method not allowed" });
    }

    const { prompt } = req.body;

    if (!prompt || typeof prompt !== "string") {
        return response.status(400).json({ error: "Prompt is required" });
    }

    console.log("Received prompt:", prompt);

    // 模拟延迟，更真实
    await new Promise(resolve => setTimeout(resolve, 1500));

    // 随机选择一张图片
    const randomIndex = Math.floor(Math.random() * MOCK_IMAGES.length);
    const imageUrl = MOCK_IMAGES[randomIndex];

    // 生成一个模拟的图片ID（用于跟踪）
    const imageId = `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    response.status(200).json({
        imageUrl: imageUrl,
        imageId: imageId,
        promptReceived: prompt,
        seed: Math.floor(Math.random() * 1000000), // 模拟随机种子
        width: 800,
        height: 600,
        timestamp: new Date().toISOString(),
        model: "mock-dalle-3", // 模拟模型名称
    });
}