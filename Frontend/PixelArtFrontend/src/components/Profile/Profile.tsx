import React, { useState, useEffect, useContext } from "react";
import api from "../../api/api";

interface User {
    id: string;
    email: string;
    name?: string;
}

function Profile() {
    const [profile, setProfile] = useState<User | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        api
            .get("/me")
            .then((res) => setProfile(res.data))
            .catch((err) => {
                setError("Failed to load profile");
                console.error(err);
            });
    }, []);

    if (error) return <p>{error}</p>;
    if (!profile) return <p>Loading...</p>;

    return (
        <div>
            <h2>Hello {profile.name ?? profile.email}</h2>
            <p>User ID: {profile.id}</p>
        </div>
    );}

export default Profile;
