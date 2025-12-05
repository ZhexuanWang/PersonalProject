import React from "react";
import {Button} from "react-bootstrap";
import {useUIContext} from "../UIContext/UIContext";
import { useAuth } from "../../hooks/useAuth";

const LogoutButton: React.FC = () => {
    const {setIsLoggedIn, setShowSidebar, setShowDialog, setHasGenerated} = useUIContext();
    const { logout } = useAuth();

    async function handleLogout() {
        await logout();
        alert("Logged out!");
        setIsLoggedIn(false);
        setShowSidebar(false);
        setShowDialog(false);
        setHasGenerated(false);
    }

    return (
        <Button variant="outline-danger" onClick={handleLogout}>
            Logout
        </Button>
    );
};

export default LogoutButton;
