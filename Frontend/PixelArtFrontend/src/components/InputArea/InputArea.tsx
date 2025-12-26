import {useState} from "react";
import {Form, Button, InputGroup} from "react-bootstrap";
import * as React from "react";
import "./InputArea.css";
import {useUIContext} from "../../contexts/UIContext/UIContext"
import Artbook from "../GeneratedDialog/Artbook.tsx";
import ReactDOM from 'react-dom';

const InputArea: React.FC = () => {
    const [prompt, setPrompt] = useState("");
    const [images, setImages] = useState<string[]>([]); // 改为数组存储多个图片
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const {showDialog, setShowDialog, hasGenerated, setHasGenerated, requestTokenRef} = useUIContext();

    const handleGenerate = async () => {
        if (!prompt.trim()) return;
        requestTokenRef.current += 1;
        const token = requestTokenRef.current;
        setHasGenerated(true);
        setLoading(true);
        setError(null);
        // 不再清空 images 数组，保留历史记录

        try {
            const response = await fetch("/api/generate", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({prompt}),
            });

            if (!response.ok) throw new Error("Image generation failed");

            const data = await response.json();

            if (token === requestTokenRef.current) {
                // 将新图片添加到数组中，而不是替换
                setImages(prev => [...prev, data.imageUrl]);
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


    const handleDownload = (url: string) => {
        const link = document.createElement("a");
        link.href = url;
        link.download = `generated-${Date.now()}.png`;
        link.click();
    };

    const handleDelete = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
        // 如果删除了最后一张图片，可以决定是否关闭对话框
        if (images.length <= 1) {
            // setShowDialog(false); // 可选：当没有图片时关闭对话框
        }
    };

    return (
        <div className={`input-wrapper ${hasGenerated ? "bottom" : "center"}`}>
            {showDialog && ReactDOM.createPortal(
                <div className="artbook-modal-overlay">
                    <Artbook
                        images={images}
                        error={error}
                        onDownload={handleDownload}
                        onDelete={handleDelete}
                    />
                </div>,
                document.body
            )}
            <div className={`guiding-text  ${hasGenerated ? "bottom" : "center"}`}>
                What can I help you today?
            </div>
            <div className={`input-area`}>
                <InputGroup className="InputArea" style={{display: "flex"}}>
                    <Form.Control
                        placeholder="Type a prompt..."
                        style={{width: "100%"}}
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                    />
                    <Button variant="primary" onClick={handleGenerate} disabled={loading}>
                        {loading ? "Loading..." : "Generate"}
                    </Button>
                </InputGroup>

                {error && <div className="text-danger mt-2">{error}</div>}
            </div>
        </div>
    );
};

export default InputArea;
