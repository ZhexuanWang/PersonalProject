import React, { useEffect } from "react";
import api from "../../api/api.ts";

export default function GoogleLoginButton() {
    useEffect(() => {
        window.google.accounts.id.initialize({
            client_id: import.meta.env.REACT_APP_GOOGLE_CLIENT_ID!,
            callback: async (response: any) => {
                const res = await api.post("/auth/google", { idToken: response.credential });
                console.log("Logged in:", res.data);
                // here you’d update AuthContext with res.data.user + res.data.accessToken
            }
        });
        window.google.accounts.id.renderButton(
            document.getElementById("googleBtn"),
            { theme: "outline", size: "large" }
        );
    }, []);

    return <div id="googleBtn"></div>;
}
