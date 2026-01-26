"use client";

import {useEffect, useRef} from "react";
import katex from "katex";
import renderMathInElement from 'katex/dist/contrib/auto-render.mjs';
import "katex/dist/katex.min.css";

interface LatexWrapperProps {
    content: string;
    scale?: number;
    className?: string;
}

export function LatexWrapper({content, scale, className = ""}: LatexWrapperProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
            if (containerRef.current) {
                // katex.render(content, containerRef.current, {
                //
                // });
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
    }, []);

    return (
        <div
            ref={containerRef}
            className={className}
            dangerouslySetInnerHTML={{__html: content}}
        />
    );
}
