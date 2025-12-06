import express from "express";
import serverless from "serverless-http";
import backendApp from "./backendApp";
import {requireAuth} from "./auth.middleware";

const app = express();

// Middleware & routes
app.use(express.json());
//app.use(requireAuth);   // 👈 this would protect every route
app.get("/", (req, res) => {
    console.log("Root route hit");
    res.send("Hello from Express on Vercel!");
});

app.get("/protected", requireAuth, (req, res) => {
    console.log("Protected");
    res.json({ message: `Hello user ${res.locals.userId}` });
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
