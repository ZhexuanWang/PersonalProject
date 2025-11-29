import { useState } from "react";
import { Form, Button, InputGroup, Spinner } from "react-bootstrap";
import * as React from "react";

const InputArea: React.FC = () => {
    const [prompt, setPrompt] = useState("");
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async () => {
        if (!prompt.trim()) return;
        setLoading(true);
        setError(null);
        setImageUrl(null);

        try {
            const response = await fetch("http://localhost:5000/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt }),
            });

            if (!response.ok) throw new Error("Image generation failed");

            const data = await response.json();
            setImageUrl(data.imageUrl);
        } catch (err: any) {
            setError(err.message);
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
        <div className="p-3 border rounded bg-light">
            <InputGroup>
                <Form.Control
                    placeholder="Type a prompt..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                />
                <Button variant="primary" onClick={handleSubmit} disabled={loading}>
                    {loading ? <Spinner size="sm" animation="border" /> : "Generate"}
                </Button>
            </InputGroup>

            {error && <div className="text-danger mt-2">{error}</div>}

            {imageUrl && (
                <div className="mt-3 text-center">
                    <img src={imageUrl} alt="Generated" className="img-fluid rounded shadow" />
                    <div className="mt-2">
                        <Button variant="success" onClick={handleDownload}>
                            Download
                        </Button>
                        <Button
                            variant="outline-secondary"
                            className="ms-2"
                            onClick={() => setImageUrl(null)}
                        >
                            Clear
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InputArea;
