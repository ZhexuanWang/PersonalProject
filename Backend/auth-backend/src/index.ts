// src/index.ts
import app from "./backendApp";
import serverless from "serverless-http";

// Always export for Vercel
module.exports = serverless(app);

// Local dev: run app.listen if not on Vercel
if (!process.env.VERCEL) {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Local server running on http://localhost:${PORT}`);
    });
}
