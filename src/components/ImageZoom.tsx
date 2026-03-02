"use client";

import Image from "next/image";
import { useState, useRef } from "react";

export default function ImageZoom({ src, alt, className = "" }: { src: string, alt: string, className?: string }) {
    const [isHovering, setIsHovering] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const imageContainerRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!imageContainerRef.current) return;

        const { left, top, width, height } = imageContainerRef.current.getBoundingClientRect();

        // Calculate X and Y position as a percentage (0 to 100)
        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;

        setMousePosition({ x, y });
    };

    return (
        <div
            ref={imageContainerRef}
            className={`relative overflow-hidden cursor-crosshair ${className}`}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onMouseMove={handleMouseMove}
        >
            <Image
                src={src}
                alt={alt}
                fill
                className={`object-cover transition-transform duration-200 ease-out ${isHovering ? "scale-150" : "scale-100"}`}
                style={{
                    transformOrigin: isHovering ? `${mousePosition.x}% ${mousePosition.y}%` : "center center"
                }}
                priority
            />
        </div>
    );
}
