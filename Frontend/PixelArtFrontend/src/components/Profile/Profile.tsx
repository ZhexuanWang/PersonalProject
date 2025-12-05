import { useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";

export default function Profile() {
    const { user, getProfile } = useAuth();

    useEffect(() => {
        getProfile();
    }, []);

    if (!user) return <p>Loading...</p>;
    return <p>Welcome {user.email}, your ID is {user.userId}</p>;
}
