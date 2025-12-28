import React, {useEffect, useRef, useState} from "react";
import "./Artbook.css";

interface ArtbookProps {
    images: string[];
    error?: string | null;
    onDownload: (url: string) => void;
    onDelete: (index: number) => void;
    currentPrompt?: string; // 添加当前提示词
    currentConversationId?: string; // 这个从 InputArea 传递过来
}

const Artbook: React.FC<ArtbookProps> = ({    images,
                                             error,
                                             onDownload,
                                             onDelete,
                                             currentPrompt,
                                             currentConversationId // 这个从 InputArea 传递过来
                                         }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loadedImages, setLoadedImages] = useState<string[]>(images);
    const galleryRef = useRef<HTMLDivElement | null>(null);

    const [conversationId, setConversationId] = useState<string | undefined>(currentConversationId);
    const [isExistingConversation, setIsExistingConversation] = useState(false);

    // 检查对话是否存在
    useEffect(() => {
        const checkConversationExists = () => {
            if (!conversationId) {
                setIsExistingConversation(false);
                return;
            }

            const saved = localStorage.getItem('galleryConversations');
            if (saved) {
                try {
                    const conversations = JSON.parse(saved);
                    const exists = conversations.some((conv: any) => conv.id === conversationId);
                    console.log("对话存在检查:", exists ? "已存在" : "不存在");
                    setIsExistingConversation(exists);
                } catch (error) {
                    console.error("检查对话失败:", error);
                }
            }
        };

        checkConversationExists();
    }, [conversationId]);

    // 保存当前画廊的函数
    const handleSaveGallery = () => {
        console.log("=== Artbook 保存按钮点击 ===");
        console.log("当前 images 状态:", {
            长度: images.length,
            内容: images,
            类型: typeof images,
            是数组: Array.isArray(images)
        });

        // 检查每个图片 URL
        images.forEach((img, index) => {
            console.log(`图片 ${index}:`, {
                url: img,
                类型: typeof img,
                长度: img?.length,
                有效: img.length > 0
            });
        });
        if (images.length === 0) {
            alert("No images to save!");
            return;
        }

        // 调用全局的保存函数（来自 Sidebar）
        if (typeof (window as any).saveCurrentGallery === 'function') {
            const saved = (window as any).saveCurrentGallery(images, currentPrompt,conversationId);
            if (saved) {
                alert("✅ Gallery saved successfully!");
            } else {
                alert("❌ Failed to save gallery. Please make sure you're logged in.");
            }
        } else {
            alert("Save function not available. Please open the sidebar first to initialize.");
        }
    };

    // ========== 修改1：更新事件监听器使用新格式 ==========
    useEffect(() => {
        const handleLoadGallery = (event: CustomEvent) => {
            console.log("Artbook: 收到 loadGallery 事件", event.detail);

            // 解构新格式的数据
            const { images: loadedImages, title, prompt, id } = event.detail;

            console.log("加载的画廊信息:", {
                id,
                title,
                prompt,
                图片数量: loadedImages?.length
            });

            if (loadedImages && Array.isArray(loadedImages) && loadedImages.length > 0) {
                setLoadedImages([...loadedImages]);
                setCurrentIndex(0);
                console.log("✅ Artbook 已更新图片，数量:", loadedImages.length);
            } else {
                console.error("无效的图片数据:", loadedImages);
            }
        };

        window.addEventListener('loadGallery', handleLoadGallery as EventListener);

        return () => {
            window.removeEventListener('loadGallery', handleLoadGallery as EventListener);
        };
    }, []);

    // ========== 修改2：从 localStorage 加载对话，使用新格式 ==========
    useEffect(() => {
        const savedGallery = localStorage.getItem('loadedGallery');
        if (savedGallery) {
            try {
                const gallery = JSON.parse(savedGallery);
                console.log("从 localStorage 恢复画廊:", gallery);

                // 检查是新格式还是旧格式
                if (gallery.images) {
                    // 新格式：直接使用 images
                    setLoadedImages([...gallery.images]);
                } else if (gallery.detail && gallery.detail.images) {
                    // 可能是事件格式
                    setLoadedImages([...gallery.detail.images]);
                }

                setCurrentIndex(0);
                localStorage.removeItem('loadedGallery');
                console.log("✅ 画廊恢复完成");
            } catch (e) {
                console.error('Failed to load gallery:', e);
            }
        }
    }, []);

    // 同步外部 images 到内部状态
    useEffect(() => {
        console.log("Artbook: 同步外部 images，数量:", images.length);
        setLoadedImages(images);
    }, [images]);

    // ========== 修改3：监听 updateGalleryImages 事件（如果 InputArea 发送） ==========
    useEffect(() => {
        const handleUpdateImages = (event: CustomEvent) => {
            console.log("Artbook: 收到 updateGalleryImages 事件", event.detail);
            if (event.detail && Array.isArray(event.detail)) {
                setLoadedImages([...event.detail]);
                setCurrentIndex(0);
            }
        };

        window.addEventListener('updateGalleryImages', handleUpdateImages as EventListener);

        return () => {
            window.removeEventListener('updateGalleryImages', handleUpdateImages as EventListener);
        };
    }, []);

    // 点击缩略图切换主图片
    const handleThumbnailClick = (index: number) => {
        setCurrentIndex(index);
    };

    // 画廊向左滚动
    const scrollGalleryLeft = () => {
        if (galleryRef.current) {
            if ("scrollBy" in galleryRef.current) {
                galleryRef.current.scrollBy({left: -150, behavior: 'smooth'});
            }
        }
    };

    // 画廊向右滚动
    const scrollGalleryRight = () => {
        if (galleryRef.current) {
            if ("scrollBy" in galleryRef.current) {
                galleryRef.current.scrollBy({left: 150, behavior: 'smooth'});
            }
        }
    };

    const prevPage = () => {
        if (images.length === 0) return;
        setCurrentIndex((i) => (i > 0 ? i - 1 : images.length - 1));
    };

    const nextPage = () => {
        if (images.length === 0) return;
        setCurrentIndex((i) => (i < images.length - 1 ? i + 1 : 0));
    };

    const currentImage = images[currentIndex];

    return (
        <div className="artbook-container">
            {/* 在顶部添加保存按钮 */}
            <div className="artbook-header">
                <div className="header-left">
                    <button
                        className="header-button save-gallery-btn"
                        onClick={handleSaveGallery}
                        disabled={loadedImages.length === 0}
                    >
                        💾 Save Gallery
                    </button>
                </div>
                <div className="page-indicator">
                    <span>Gallery: {loadedImages.length} images</span>
                </div>
            </div>

            {/* 移除原来的头部，替换为画廊区域 */}
            <div className="gallery-section">
                {/* 左滚动按钮 */}
                <button
                    className="gallery-scroll-btn left-scroll-btn"
                    onClick={scrollGalleryLeft}
                    disabled={images.length === 0}
                >
                    ◀
                </button>

                {/* 缩略图画廊 */}
                <div className="thumbnail-gallery" ref={galleryRef}>
                    {images.length > 0 ? (
                        images.map((img, index) => (
                            <div
                                key={index}
                                className={`thumbnail-container ${index === currentIndex ? 'active' : ''}`}
                                onClick={() => handleThumbnailClick(index)}
                            >
                                <img
                                    src={img}
                                    alt={`Thumbnail ${index + 1}`}
                                    className="thumbnail-image"
                                />
                                <div className="thumbnail-overlay">
                                    <span className="thumbnail-number">{index + 1}</span>
                                    {index === currentIndex && (
                                        <div className="current-indicator">✓</div>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="empty-gallery">
                            <div className="empty-placeholder">No images yet</div>
                        </div>
                    )}
                </div>

                {/* 右滚动按钮 */}
                <button
                    className="gallery-scroll-btn right-scroll-btn"
                    onClick={scrollGalleryRight}
                    disabled={images.length === 0}
                >
                    ▶
                </button>
            </div>

            {/* 图片区域 */}
            <div className="image-section">
                <button onClick={prevPage} className="arrow-button left-arrow">
                    ◀
                </button>

                <div className="image-wrapper">
                    {/* 图片上方功能区 */}
                    {/*<div className="image-top-actions">*/}
                    {/*    <div className="image-info">*/}
                    {/*        <div className="image-title">Generated Image</div>*/}
                    {/*        <div className="image-meta">1024×1024 • Just now</div>*/}
                    {/*    </div>*/}
                    {/*    <div className="image-actions">*/}
                    {/*        <button className="action-button" title="Share">↗</button>*/}
                    {/*        <button className="action-button" title="Favorite">♥</button>*/}
                    {/*        <button className="action-button" title="Info">ⓘ</button>*/}
                    {/*    </div>*/}
                    {/*</div>*/}

                    {/* 图片显示 */}
                    <div className="image-display">
                        {currentImage ? (
                            <img
                                src={currentImage}
                                alt="Artbook page"
                                className="artbook-image"
                            />
                        ) : (
                            <div className="placeholder-text">
                                {error ? 'Error loading image' : 'No image to display'}
                            </div>
                        )}
                    </div>
                </div>

                <button onClick={nextPage} className="arrow-button right-arrow">
                    ▶
                </button>
            </div>

            {/* 错误信息 */}
            {error && <div className="error-text">{error}</div>}

            {/* 底部按钮区域 */}
            <div className="button-row">
                <button
                    className="primary-button"
                    onClick={() => onDownload(currentImage)}
                    disabled={!currentImage}
                >
                    ⬇ Download
                </button>
                <button className="secondary-button">
                    ✎ Edit
                </button>
                <button
                    className="secondary-button"
                    onClick={() => onDelete(currentIndex)}
                >
                    🗑 Delete
                </button>
            </div>
        </div>
    );
};

export default Artbook;