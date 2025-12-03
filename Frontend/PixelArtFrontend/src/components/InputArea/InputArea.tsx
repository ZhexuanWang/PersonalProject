import {useState} from "react";
import { Form, Button, InputGroup } from "react-bootstrap";
import * as React from "react";
import "./InputArea.css";
import GeneratedDialog from "../GeneratedDialog/GeneratedDialog.tsx";
import {useUIContext} from "../UIContext/UIContext"

const InputArea: React.FC = () => {
    const [prompt, setPrompt] = useState("");
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { showDialog, setShowDialog, hasGenerated, setHasGenerated, requestTokenRef } = useUIContext();

    const handleGenerate = async () => {
        if (!prompt.trim()) return;
        requestTokenRef.current += 1;
        const token = requestTokenRef.current;
        setHasGenerated(true);
        setLoading(true);
        setError(null);
        setImageUrl(null);

        try {
            const response = await fetch("/api/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt }),
            });

            if (!response.ok) throw new Error("Image generation failed");

            const data = await response.json();

            if (token === requestTokenRef.current) {
                setImageUrl(data.imageUrl);
                setShowDialog(true);
            }
        } catch (err: any) {
            if (token === requestTokenRef.current) {
                setError(err.message || "Something went wrong");
                setShowDialog(true);
            }
        } finally {
            setLoading(false);
        }
    };


    const handleDownload = () => {
        if (imageUrl) {
            const link = document.createElement("a");
            link.href = imageUrl;
            link.download = "generated.png";
            link.click();
        }
    };

    return (
        <div className={`input-area ${hasGenerated ? "bottom" : "center"}`}>
            <InputGroup className="InputArea" style={{ display: "flex" }}>
                <Form.Control
                    placeholder="Type a prompt..."
                    style={{ width: "100%" }}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                />
                <Button variant="primary" onClick={handleGenerate} disabled={loading}>
                    {loading ? "Loading..." : "Generate"}
                </Button>
            </InputGroup>

            {error && <div className="text-danger mt-2">{error}</div>}

            <GeneratedDialog
                show={showDialog}
                imageUrl={imageUrl}
                error={error}
                onClose={() => setShowDialog(false)}
                onDownload={handleDownload}
                onClear={() => setImageUrl(null)}
            />
        </div>
    );
};

export default InputArea;
