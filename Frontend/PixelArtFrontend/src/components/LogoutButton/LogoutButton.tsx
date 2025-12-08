import React from "react";
import {Button} from "react-bootstrap";
import {useUIContext} from "../../contexts/UIContext/UIContext";
import { useAuth } from "../../hooks/useAuth";
import {useNavigate} from "react-router-dom";

const LogoutButton: React.FC = () => {
    const {setIsLoggedIn, setShowSidebar, setShowDialog, setHasGenerated} = useUIContext();
    const { logout } = useAuth();
    const navigate = useNavigate();

    async function handleLogout() {
        await logout();
        navigate("/"); // back to home/login
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
