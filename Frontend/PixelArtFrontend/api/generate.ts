// api/generate.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { prompt } = req.body;

    console.log("Received prompt:", prompt);

    // For now, return a placeholder image
    res.status(200).json({
        imageUrl: "https://th.bing.com/th?id=ORMS.f0422e6a3f339b948fd6c1f0d8e3223e&pid=Wdp&w=268&h=140&qlt=90&c=1&rs=1&dpr=1&p=0",
        promptReceived: prompt,
    });
}
