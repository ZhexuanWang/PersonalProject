import React from "react";
import { Modal, Button } from "react-bootstrap";
import {useUIContext} from "../UIContext/UIContext"

interface GeneratedDialogProps {
    show: boolean;
    imageUrl: string | null;
    error: string | null;
    onClose: () => void;
    onDownload: () => void;
    onClear: () => void;
}

const GeneratedDialog: React.FC<GeneratedDialogProps> = ({
                                                             show,
                                                             imageUrl,
                                                             error,
                                                             onClose,
                                                             onDownload,
                                                             onClear,
                                                         }) => {

    const { showDialog, setShowDialog, hasGenerated, setHasGenerated } = useUIContext();

    return (
        <Modal show={show} onHide={onClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Generated Result</Modal.Title>
            </Modal.Header>
            <Modal.Body className="text-center">
                {error && <div className="text-danger mb-2">{error}</div>}
                {imageUrl ? (
                    <>
                        <img
                            src={imageUrl}
                            alt="Generated"
                            className="img-fluid rounded shadow"
                        />
                        <div className="mt-3">
                            <Button variant="success" onClick={onDownload}>
                                Download
                            </Button>
                            <Button
                                variant="outline-secondary"
                                className="ms-2"
                                onClick={onClear}
                            >
                                Clear
                            </Button>
                        </div>
                    </>
                ) : (
                    <p>No image generated yet.</p>
                )}
            </Modal.Body>
        </Modal>
    );
};

export default GeneratedDialog;
