"use client";

import { useEffect } from "react";
import { useExamStore } from "@/stores/exam-store";
import { Button } from "../ui/button";
// import { setInterval, clearInterval } from "worker-timers";
import {CircleQuestionMark, Minus, X} from "lucide-react";

export function ExamHeader() {
  const { kimData, blankNumber, endExam, endExamAction, updateTimer } =
    useExamStore();

  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     updateTimer();
  //   }, 60000);
  //
  //   return () => clearInterval(timer);
  // }, [updateTimer]);

  const handleEnd = () => {
    if (endExam) {
      endExamAction();
    } else if (confirm("Вы уверены, что хотите завершить экзамен?")) {
      endExamAction();
    }
  };

  if (!kimData) return null;

  return (
    <div className="flex items-center justify-between p-4 bg-[#1e325a] text-white">
      <div className="flex items-center gap-4">
        {kimData.kim && kimData.kim !== "-" && (
          <>
            <span className="font-semibold">КИМ № {kimData.kim}</span>
            <span className="font-semibold">БР № {blankNumber}</span>
          </>
        )}
      </div>

      <div className="flex items-center gap-4">
        <Button onClick={handleEnd} variant="ghost">
          {endExam ? "Вернуться к результатам" : "Завершить экзамен досрочно"}
        </Button>
        {
          !endExam && (
                <Button onClick={handleEnd} variant="ghost">
                  <CircleQuestionMark />
                </Button>
            )
        }
        {
            !endExam && (
                <Button onClick={handleEnd} variant="ghost">
                  <Minus />
                </Button>
            )
        }
        {
            !endExam && (
                <Button onClick={handleEnd} variant="ghost">
                  <X />
                </Button>
            )
        }
      </div>
    </div>
  );
}
