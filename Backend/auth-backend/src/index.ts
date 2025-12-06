import serverless from "serverless-http";
import backendApp from "./backendApp";

module.exports = serverless(backendApp);

// Local dev
if (!process.env.VERCEL) {
    const PORT = process.env.PORT || 5000;
    backendApp.listen(PORT, () => {
        console.log(`Local server running on http://localhost:${PORT}`);
    });
}
