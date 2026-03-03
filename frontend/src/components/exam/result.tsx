"use client";

import { useEffect } from "react";
import { useExamStore } from "@/stores/exam-store";
import { SCALE } from "@/lib/constants";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export function Result() {
  const { kimData, backToTask, sendResult } = useExamStore();

  useEffect(() => {
    if (kimData) {
      sendResult(true);
    }
    console.log(kimData)
  }, [kimData, sendResult]);

  if (!kimData) return null;

  const primaryScore = kimData.tasksForKim.reduce((acc, t) => acc + t.score, 0);
  const secondaryScore = SCALE[primaryScore] || 0;

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-center">Результаты экзамена</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Итоговый балл</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-5xl font-bold">{secondaryScore}</div>
                <div className="text-sm text-muted-foreground mt-2">
                  Первичный балл: {primaryScore}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Статистика</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Всего заданий:</span>
                  <span className="font-bold">{kimData.tasksForKim.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Дано ответов:</span>
                  <span className="font-bold">
                    {kimData.tasksForKim.filter((t) => t.answer && t.answer !== "").length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Правильных ответов:</span>
                  <span className="font-bold">
                    {kimData.tasksForKim.filter((t) => t.score > 0).length}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Детальные результаты</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {kimData.tasksForKim.map((task, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent cursor-pointer"
                  onClick={() => backToTask(index)}
                >
                  <div className="flex items-center gap-4">
                    <span className="font-bold w-12">№{task.number}</span>
                    <span className="text-sm text-muted-foreground">
                      Ваш ответ: {task.answer || "(нет ответа)"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-bold ${
                        task.score > 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {task.score > 0 ? "✓" : "✗"}
                    </span>
                    <span className="text-sm">{task.score} б.</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <Button onClick={() => (window.location.href = "/")}>
            Вернуться на главную
          </Button>
        </div>
      </div>
    </div>
  );
}
