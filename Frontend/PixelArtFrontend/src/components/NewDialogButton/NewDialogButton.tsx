import React from "react";
import { Button } from "react-bootstrap";
import { useUIContext } from "../UIContext/UIContext";

const NewDialogButton: React.FC = () => {
    const {
        setShowDialog,
        setShowSidebar,
        setHasGenerated,
        requestTokenRef
    } = useUIContext();

    const handleNewDialog = () => {
        setShowDialog(false);
        setShowSidebar(false);
        setHasGenerated(false);
        requestTokenRef.current += 1;
    };

    return (
        <Button variant="outline-primary" onClick={handleNewDialog}>
            New Dialog
        </Button>
    );
};

export default NewDialogButton;
