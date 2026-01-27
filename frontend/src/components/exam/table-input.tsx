"use client";

import { useCurrentTask, useExamStore } from "@/stores/exam-store";
import { useState, useEffect, useRef } from "react";
import { Button } from "../ui/button";

export function TableInput() {
  const task = useCurrentTask();
  const { setAnswer, endExam } = useExamStore();
  const [localAnswer, setLocalAnswer] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (task) {
      setLocalAnswer(task.answer || "");
    }
  }, [task]);

  if (!task?.table) return null;

  const rows = task.table.rows;
  const cols = task.table.columns;

  // Парсинг ответа: строки разделены \n, значения в строке разделены пробелами
  const parseAnswer = (answer: string): string[][] => {
    if (!answer) return [];
    return answer.split("\\n").map((row) => row.split(" "));
  };

  // Получение значения ячейки
  const getValue = (i: number, j: number): string => {
    const parsed = parseAnswer(localAnswer);
    if (parsed[i] && parsed[i][j]) return parsed[i][j];
    return "";
  };

  // Обновление ответа из всех input полей
  const updateAnswer = () => {
    if (!containerRef.current) return;

    const inputs = containerRef.current.querySelectorAll<HTMLInputElement>(".input");
    const values: string[][] = [];
    let subarray: string[] = [];

    inputs.forEach((input, i) => {
      if (i !== 0 && i % cols === 0) {
        values.push(subarray);
        subarray = [];
      }
      subarray.push(input.value.trim());
    });
    values.push(subarray);

    // Удаление пустых строк с конца
    for (let i = rows - 1; i >= 0; i--) {
      if (values[i]?.every((el) => el === "")) {
        values.splice(i, 1);
      } else {
        break;
      }
    }

    const newAnswer = values.map((row) => row.join(" ")).join("\\n");
    setLocalAnswer(newAnswer);
  };

  // Сохранение ответа в store
  const saveAnswer = () => {
    setAnswer(localAnswer);
  };

  // Очистка ответа
  const deleteAnswer = () => {
    setLocalAnswer("");
    if (containerRef.current) {
      const inputs = containerRef.current.querySelectorAll<HTMLInputElement>(".input");
      inputs.forEach((input) => {
        input.value = "";
      });
    }
  };

  // Обработка вставки из буфера обмена
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>, i: number, j: number) => {
    e.stopPropagation();
    e.preventDefault();

    const clipboardData = e.clipboardData;
    const pastedData = clipboardData.getData("text");

    const pastedRows = pastedData.split(/\r\n|\n|\r/);

    for (let rowIndex = 0; rowIndex < Math.min(pastedRows.length, rows - i); rowIndex++) {
      const row = pastedRows[rowIndex];
      if (!row) continue;

      const pastedCols = row.split(/,|;| |\t/);

      for (let colIndex = 0; colIndex < Math.min(pastedCols.length, cols - j); colIndex++) {
        if (pastedCols[colIndex] !== "") {
          const targetInput = containerRef.current?.querySelector<HTMLInputElement>(
            `#r${i + rowIndex}c${j + colIndex}`
          );
          if (targetInput) {
            targetInput.value = pastedCols[colIndex] || "";
          }
        }
      }
    }

    updateAnswer();
  };

  const isAnswerSaved = task.answer !== "" && localAnswer === task.answer;

  return (
    <div className="p-4 bg-background" ref={containerRef}>
      <div className="space-y-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
          <p className="text-sm text-blue-900 dark:text-blue-100">
            Введите или скопируйте свой ответ в поля таблицы
          </p>
        </div>

        <div className="overflow-x-auto border rounded-lg">
          <table className="border-collapse w-full">
            <tbody>
              {/* Header row with column numbers */}
              <tr>
                <td className="border border-border bg-muted p-2 text-center w-12"></td>
                {Array.from({ length: cols }, (_, j) => (
                  <td
                    key={j}
                    className="border border-border bg-muted p-2 text-center font-semibold"
                  >
                    {j + 1}
                  </td>
                ))}
              </tr>

              {/* Data rows */}
              {Array.from({ length: rows }, (_, i) => (
                <tr key={i}>
                  {/* Row number */}
                  <td className="border border-border bg-muted p-2 text-center font-semibold w-12">
                    {i + 1}
                  </td>

                  {/* Input cells */}
                  {Array.from({ length: cols }, (_, j) => (
                    <td key={j} className="border border-border p-0">
                      <input
                        type="text"
                        id={`r${i}c${j}`}
                        className="input w-full h-12 px-2 text-center border-0 focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed"
                        defaultValue={getValue(i, j)}
                        disabled={endExam}
                        onInput={updateAnswer}
                        onPaste={(e) => handlePaste(e, i, j)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            saveAnswer();
                          }
                        }}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Buttons */}
        <div className="flex gap-2 justify-end">
          <Button variant="destructive" onClick={deleteAnswer} disabled={endExam}>
            Очистить
          </Button>

          {isAnswerSaved ? (
            <Button variant="secondary" disabled>
              Ответ сохранён
            </Button>
          ) : (
            <Button className="bg-green-600 hover:bg-green-400" onClick={saveAnswer} disabled={endExam}>
              Сохранить ответ
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
