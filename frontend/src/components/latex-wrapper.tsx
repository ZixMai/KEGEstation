"use client";

import {useEffect, useRef} from "react";
//@ts-ignore
import renderMathInElement from 'katex/dist/contrib/auto-render.mjs';
import "katex/dist/katex.min.css";

interface LatexWrapperProps {
    content: string;
    scale?: number;
    className?: string;
}

export function LatexWrapper({content, scale, className = ""}: LatexWrapperProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<string>("");

    useEffect(() => {
        if (containerRef.current && content !== contentRef.current) {
            contentRef.current = content;
            containerRef.current.innerHTML = content;
            renderMathInElement(containerRef.current, {
                delimiters: [
                    {left: "$$", right: "$$", display: true},
                    {left: "$", right: "$", display: false},
                    {left: "\\[", right: "\\]", display: true},
                    {left: "\\(", right: "\\)", display: false},
                ],
                throwOnError: false,
            });
        }
    }, [content, scale]);

    return (
        <div
            ref={containerRef}
            className={className}
        />
    );
}
