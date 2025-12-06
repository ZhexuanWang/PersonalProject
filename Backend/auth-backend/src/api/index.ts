import express from "express";
import serverless from "serverless-http";
import backendApp from "../backendApp";

const app = express();

// Middleware & routes
app.use(express.json());
app.get("/", (req, res) => {
    res.send("Hello from Express on Vercel!");
});

// Export for Vercel
module.exports = serverless(app);

// Local dev: run app.listen if not on Vercel
if (!process.env.VERCEL) {
    const PORT = process.env.PORT || 5000;
    backendApp.listen(PORT, () => {
        console.log(`Local server running on http://localhost:${PORT}`);
    });
}
