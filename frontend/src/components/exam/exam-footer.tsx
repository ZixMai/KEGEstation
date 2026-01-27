"use client";

import { useState, useEffect } from "react";
import { useCurrentTask, useExamStore } from "@/stores/exam-store";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {X} from "lucide-react";

export function ExamFooter() {
  const task = useCurrentTask();
  const { setAnswer, endExam } = useExamStore();
  const [answer, setAnswerLocal] = useState("");

  useEffect(() => {
    if (task) {
      setAnswerLocal(task.answer || "");
    }
  }, [task]);

  if (!task) return (
      <div className="p-4 bg-background h-16">
      </div>
  );

  const handleSave = () => {
    setAnswer(answer.trim());
  };

  const handleDelete = () => {
    setAnswer("");
    setAnswerLocal("");
  };

  const isAnswerSaved = task.answer !== "" && answer === task.answer;

  return (
    <div className="p-4 bg-background h-16">
      <div className="flex items-center gap-4 max-w-md ml-auto">
        <div className="flex-1">
          <div className="flex gap-2">
            <Input
              type="text"
              value={answer}
              onChange={(e) => setAnswerLocal(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !isAnswerSaved) handleSave();
              }}
              disabled={endExam}
              placeholder="Введите ответ"
              className="flex-1"
            />
            {isAnswerSaved ? (
              <>
                <Button variant="destructive" onClick={handleDelete} disabled={endExam}>
                  <X />
                </Button>
                <Button variant="secondary" disabled>
                  Ответ сохранён
                </Button>
              </>
            ) : (
              <Button className="bg-green-600 hover:bg-green-400" onClick={handleSave} disabled={endExam}>
                Сохранить ответ
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
