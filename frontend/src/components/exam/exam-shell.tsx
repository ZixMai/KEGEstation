"use client";

import {useCallback, useEffect, useState} from "react";
import {useCurrentTask, useExamStore} from "@/stores/exam-store";
import {ExamHeader} from "./exam-header";
import {ExamNav} from "./exam-nav";
import {ExamTask} from "./exam-task";
import {ExamFooter} from "./exam-footer";
import {TableInput} from "./table-input";
import {Button} from "../ui/button";
import {ArrowLeft, ArrowRight, Minus, Plus, RotateCcw} from "lucide-react";

export function ExamShell() {
    const [scale, setScale] = useState(1);
    const {nextIndex, prevIndex, index} = useExamStore();
    const currentTask = useCurrentTask();

    const handleNext = useCallback(() => {
        const activeElement = document.activeElement as HTMLElement;
        if (activeElement?.nodeName !== "INPUT") {
            setScale(1);
            nextIndex();
        }
    }, [nextIndex]);

    const handlePrev = useCallback(() => {
        const activeElement = document.activeElement as HTMLElement;
        if (activeElement?.nodeName !== "INPUT") {
            setScale(1);
            prevIndex();
        }
    }, [prevIndex]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowRight") handleNext();
            if (e.key === "ArrowLeft") handlePrev();
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handleNext, handlePrev]);

    return (
        <div className="flex flex-col h-screen" tabIndex={0}>
            <div className="border-b">
                <ExamHeader/>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Left sidebar with controls and navigation */}
                <div className="flex flex-col border-r bg-background w-[120px] bg-blue-100">
                    {/* Vertical navigation */}
                    <ExamNav/>
                </div>

                {/* Main content area */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Check if task has table with valid rows and cols */}
                    {index !== null && currentTask?.table && currentTask.table.rows > 0 && currentTask.table.columns > 0 ? (
                        // Layout for tasks with table: task on left, table on right
                        <div className="flex-1 overflow-auto">
                            <div className="flex h-full">
                                {/* Left arrow */}
                                <div className="relative flex items-center justify-between p-2">
                                    {/* Scale controls */}
                                    <div className="absolute flex flex-col items-center gap-2 p-4 top-2 left-1/2 -translate-x-1/2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setScale(1)}
                                            title="Сброс масштаба"
                                            className="w-12 h-12"
                                        >
                                            ⟲
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setScale((s) => Math.min(s + 0.1, 2))}
                                            title="Увеличить"
                                            className="w-12 h-12"
                                        >
                                            +
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setScale((s) => Math.max(s - 0.1, 0.5))}
                                            title="Уменьшить"
                                            className="w-12 h-12"
                                        >
                                            -
                                        </Button>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={handlePrev}
                                        className="h-16 w-16 rounded-full"
                                    >
                                        <ArrowLeft />
                                    </Button>
                                </div>

                                <div className="flex p-4 overflow-auto">
                                    <ExamTask scale={scale}/>
                                </div>

                                <div className="min-w-lg border-l overflow-auto">
                                    <TableInput/>
                                </div>

                                {/* Right arrow */}
                                <div className="flex items-center justify-center p-2">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={handleNext}
                                        className="h-16 w-16 rounded-full"
                                    >
                                        <ArrowRight />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        // Layout for regular tasks: task on top, input at bottom
                        <>
                            <div className="flex-1 overflow-auto">
                                <div className="flex h-full">
                                    {/* Left arrow */}
                                    <div className="relative flex items-center justify-between p-2">
                                        {/* Scale controls */}
                                        <div className="absolute flex flex-col items-center gap-2 p-4 top-2 left-1/2 -translate-x-1/2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setScale(1)}
                                                title="Сброс масштаба"
                                                className="w-12 h-12"
                                            >
                                                <RotateCcw />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setScale((s) => Math.min(s + 0.1, 2))}
                                                title="Увеличить"
                                                className="w-12 h-12"
                                            >
                                                <Plus/>
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setScale((s) => Math.max(s - 0.1, 0.5))}
                                                title="Уменьшить"
                                                className="w-12 h-12"
                                            >
                                                <Minus/>
                                            </Button>
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={handlePrev}
                                            className="h-16 w-16 rounded-full"
                                        >
                                            <ArrowLeft />
                                        </Button>
                                    </div>

                                    <div className="flex-1 p-4 overflow-auto">
                                        <ExamTask scale={scale}/>
                                    </div>

                                    {/* Right arrow */}
                                    <div className="flex items-center justify-center p-2">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={handleNext}
                                            className="h-16 w-16 rounded-full"
                                        >
                                            <ArrowRight />
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t">
                                <ExamFooter/>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
