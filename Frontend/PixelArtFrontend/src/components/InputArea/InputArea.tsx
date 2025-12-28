import {useEffect, useState} from "react";
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
    const {showDialog, setShowDialog, hasGenerated, setHasGenerated, requestTokenRef, showSidebar} = useUIContext();
    const [currentConversationId, setCurrentConversationId] = useState<string | undefined>(() => {
        // 从 localStorage 恢复上次的对话ID
        return localStorage.getItem('currentGalleryId') || undefined;
    });

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
            // 可选：当没有图片时关闭对话框并让输入框居中
            setHasGenerated(false);
            setShowDialog(false);
        }
    };

    // InputArea.tsx - 更新 handleLoadGallery 函数
    useEffect(() => {
        const handleLoadGallery = (event: CustomEvent) => {
            console.log("InputArea: 收到 loadGallery 事件", event.detail);

            // 解构新格式的数据
            const { images, title, prompt, id } = event.detail;

            console.log("加载的画廊 ID:", id);
            console.log("标题:", title);
            console.log("提示词:", prompt);
            console.log("图片数量:", images?.length);
            console.log("图片内容:", images);

            // 验证数据
            if (!images || !Array.isArray(images)) {
                console.error("无效的图片数据:", images);
                alert("Invalid gallery data!");
                return;
            }

            // if (images.length === 0) {
            //     console.warn("图片数组为空");
            //     alert("This gallery has no images!");
            //     return;
            // }

            // 设置图片状态
            setImages(images);
            setCurrentConversationId(id); // 设置对话ID
            localStorage.setItem('currentGalleryId', id); // 保存到 localStorage

            // 可选：设置 prompt
            if (prompt) {
                setPrompt(prompt);
            }

            // 打开对话框
            setShowDialog(true);
            setHasGenerated(true);

            console.log("✅ 画廊加载完成，已设置", images.length, "张图片");
        };

        window.addEventListener('loadGallery', handleLoadGallery as EventListener);

        return () => {
            window.removeEventListener('loadGallery', handleLoadGallery as EventListener);
        };
    }, [setShowDialog, setHasGenerated, setPrompt]);

    // InputArea.tsx 中添加清理监听
    useEffect(() => {
        const handleClearCurrentGallery = () => {
            console.log("InputArea: 收到清理当前画廊事件");
            setCurrentConversationId(undefined);
            setImages([]);
            setPrompt("");
            setShowDialog(false);
            setHasGenerated(false);

            // 清理 localStorage
            localStorage.removeItem('currentGalleryId');
        };

        window.addEventListener('clearCurrentGallery', handleClearCurrentGallery);

        return () => {
            window.removeEventListener('clearCurrentGallery', handleClearCurrentGallery);
        };
    }, [setShowDialog, setHasGenerated]);

    return (
        <div className={`input-wrapper ${hasGenerated ? "bottom" : "center"}`}>
            {showDialog && ReactDOM.createPortal(
                <div className={`artbook-modal-overlay  ${showSidebar?"sidebar-open":"sidebar-close"}`}>
                    <Artbook
                        images={images}
                        error={error}
                        onDownload={handleDownload}
                        onDelete={handleDelete}
                        currentPrompt={prompt}
                        currentConversationId={currentConversationId}
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
