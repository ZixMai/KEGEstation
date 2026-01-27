"use client";

import { useEffect, useRef } from "react";
import { useExamStore } from "@/stores/exam-store";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import {ArrowDown, ArrowUp} from "lucide-react";

export function ExamNav() {
  const { kimData, index, setIndex } = useExamStore();
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (navRef.current) {
      const block = index === null ? 1 : index + 2;
      const scrollTop = navRef.current.scrollTop;
      const clientHeight = navRef.current.clientHeight;

      if (clientHeight + scrollTop < 50 * block) {
        navRef.current.scroll(0, 50 * block - clientHeight);
      }
      if (50 * block - scrollTop <= 0) {
        navRef.current.scroll(0, 50 * (block - 1));
      }
    }
  }, [index]);

  if (!kimData) return null;

  const answeredCount = kimData.tasksForKim.filter((t) => t.answer && t.answer !== "").length;

  const handleScroll = (direction: "up" | "down") => {
    if (navRef.current) {
      const delta = direction === "up" ? -300 : 300;
      navRef.current.scroll(0, navRef.current.scrollTop + delta);
    }
  };

  return (
    <div className="flex flex-col h-full items-center">
      {/* Answered count */}
      <div className="flex flex-col items-center p-3 border-b">
        <p className="text-xs font-semibold text-muted-foreground">Дано ответов</p>
        <p className="text-2xl font-bold">
          {answeredCount}/{kimData.tasksForKim.length}
        </p>
      </div>

      {/* Up scroll button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleScroll("up")}
        className="shrink-0 m-2 mb-1 bg-blue-400  hover:bg-blue-300  text-white w-12 h-12"
      >
          <ArrowUp />
      </Button>

      {/* Vertical task list */}
      <div
        ref={navRef}
        className="flex flex-col gap-1 overflow-y-hidden overflow-x-hidden px-2 flex-1"
        id="navTasks"
      >
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "shrink-0 h-12 w-12",
            index === null && "bg-primary text-primary-foreground"
          )}
          onClick={() => setIndex(null)}
        >
          i
        </Button>

        {kimData.tasksForKim.map((task, i) => (
          <Button
            key={i}
            variant="outline"
            size="sm"
            className={cn(
              "shrink-0 w-12 h-12",
              task.answer && task.answer.length > 0
                ? "border-2 border-green-600"
                : "bg-background",
              index === i && "ring-2 ring-primary"
            )}
            onClick={() => {
                if (index !== i) {
                    setIndex(i);
                }
            }}
          >
            {task.number}
          </Button>
        ))}
      </div>

      {/* Down scroll button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleScroll("down")}
        className="shrink-0 m-2 mt-1 bg-blue-400  hover:bg-blue-300  text-white h-12 w-12"
      >
          <ArrowDown />
      </Button>
    </div>
  );
}
