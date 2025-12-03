import React from "react";
import { useNavigate } from "react-router-dom"; // if using react-router

const WebsiteIcon: React.FC = () => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate("/");
    };

    return (
        <div
            onClick={handleClick}
            style={{
                cursor: "pointer",
                display: "inline-block",
            }}
        >
            <img
                src="/logo.svg"
                alt="Website Icon"
                style={{ height: "40px", width: "40px" }}
            />
        </div>
    );
};

export default WebsiteIcon;
