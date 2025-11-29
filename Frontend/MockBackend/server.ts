import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();

// Allow requests from your React dev server
app.use(cors({
    origin: "http://localhost:5173",   // match your frontend dev server
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"]
}));

app.use(bodyParser.json());

app.post("/generate", (req: Request, res: Response) => {
    const { prompt } = req.body;
    console.log("Received prompt:", prompt);

    // For now, return a placeholder image
    res.json({ imageUrl: "https://placekitten.com/512/512" });
});

app.listen(5000, () => {
    console.log("Server running at http://localhost:5000");
});
