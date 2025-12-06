// src/index.ts (single entry point)
import app from "./backendApp";
import serverless from "serverless-http";

// If running on Vercel (serverless), export the handler
if (process.env.VERCEL) {
    module.exports = serverless(app);
} else {
    // Otherwise, run locally with app.listen
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Local server running on http://localhost:${PORT}`);
    });
}
