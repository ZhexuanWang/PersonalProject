import React, {useRef, useState} from "react";
import "./Artbook.css";

interface ArtbookProps {
    images: string[];
    error?: string | null;
    onDownload: (url: string) => void;
    onDelete: (index: number) => void;
}

const Artbook: React.FC<ArtbookProps> = ({ images, error, onDownload, onDelete }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const galleryRef = useRef<HTMLDivElement | null>(null);

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
                    <div className="image-top-actions">
                        <div className="image-info">
                            <div className="image-title">Generated Image</div>
                            <div className="image-meta">1024×1024 • Just now</div>
                        </div>
                        <div className="image-actions">
                            <button className="action-button" title="Share">↗</button>
                            <button className="action-button" title="Favorite">♥</button>
                            <button className="action-button" title="Info">ⓘ</button>
                        </div>
                    </div>

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
