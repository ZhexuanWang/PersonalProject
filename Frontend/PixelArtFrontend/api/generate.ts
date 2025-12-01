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
        imageUrl: "https://placekitten.com/512/512",
        promptReceived: prompt,
    });
}
