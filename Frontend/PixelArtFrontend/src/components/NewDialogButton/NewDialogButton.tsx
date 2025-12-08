import React, {useState} from "react";
import { Button } from "react-bootstrap";
import { useUIContext } from "../../contexts/UIContext/UIContext";

const NewDialogButton: React.FC = () => {

    const {
        setShowDialog,
        setShowSidebar,
        setHasGenerated,
        requestTokenRef,
        setConversations
    } = useUIContext();

    const handleNewDialog = () => {
        setShowDialog(false);
        setShowSidebar(false);
        setHasGenerated(false);
        requestTokenRef.current += 1;
        setConversations((prev) => [
            ...prev,
            `Conversation ${prev.length + 1}`,
        ]);
    };

    return (
        <Button variant="outline-primary" onClick={handleNewDialog}>
            New Dialog
        </Button>
    );
};

export default NewDialogButton;
