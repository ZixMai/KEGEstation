"use client";

import { useCurrentTask, useExamStore } from "@/stores/exam-store";
import { Button } from "../ui/button";
import { LatexWrapper } from "../latex-wrapper";

export function ExamTask({ scale }: { scale: number }) {
  const task = useCurrentTask();
  const { kimData } = useExamStore();

  if (task === null) {
    return <InstructionContent kimData={kimData} />;
  }

  if (!task) {
    return <div>Выберите задание</div>;
  }

  // Определяем какое поле содержит текст задания
  const taskContent = task.text || (task as any).text || "";
  // const taskInstruction = task.instruction || "";

  return (
    <div
      style={{ zoom: `${scale*100}%`}}
      className="space-y-4 break-normal"
    >
      <h2 className="text-2xl font-bold">Задание {task.number}</h2>

      {/*{taskInstruction && (*/}
      {/*  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">*/}
      {/*    <LatexWrapper*/}
      {/*      content={taskInstruction}*/}
      {/*      className="text-sm text-blue-900 dark:text-blue-100"*/}
      {/*      scale={scale}*/}
      {/*    />*/}
      {/*  </div>*/}
      {/*)}*/}

      {taskContent && (
        <div className="prose dark:prose-invert max-w-none">
          <LatexWrapper content={taskContent} className="break-normal"scale={scale} />
        </div>
      )}

      {/*{!taskContent && !taskInstruction && (*/}
      {/*  <div className="text-muted-foreground">*/}
      {/*    Текст задания отсутствует*/}
      {/*  </div>*/}
      {/*)}*/}

      {task.fileS3Keys && task.fileS3Keys.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-semibold">Прикреплённые файлы:</h3>
          <div className="flex flex-wrap gap-2">
            {task.fileS3Keys.map((file, index) => (
              <a
                key={index}
                href={`${process.env.NEXT_PUBLIC_API_URL}kim/getFile/${file.url}`}
                download={file.name}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                {file.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function InstructionContent({ kimData }: { kimData: any }) {
  const hasTasks = kimData?.tasks?.length > 0;
  const hasFiles = hasTasks && kimData.tasks.some((t: any) => t.files?.length > 0);
  const hideAnswer = kimData?.hideAnswer;
  const oneAttempt = kimData?.oneAttempt;

  const downloadAllFiles = () => {
    if (!kimData?.tasks) return;

    const ids = kimData.tasks
      .filter((task: any) => task.taskId)
      .map((task: any) => task.taskId.toString())
      .join(",");

    if (ids) {
      window.open(`https://kompege.ru/zip?tasks=${ids}`, "_blank");
    }
  };

  return (
    <div className="prose dark:prose-invert max-w-none p-4">
      <p>В заданиях используются следующие соглашения.</p>

      <p>
        <span className="font-semibold">1</span> Обозначения для логических
        связок (операций):
        <br />
        <span className="font-semibold">a)</span> отрицание (инверсия, логическое
        НЕ) обозначается ¬ (например, ¬А);
        <br />
        <span className="font-semibold">b)</span> конъюнкция (логическое
        умножение, логическое И) обозначается ∧ (например, А ∧ В) либо & (например,
        А & В);
        <br />
        <span className="font-semibold">c)</span> дизъюнкция (логическое сложение,
        логическое ИЛИ) обозначается ∨ (например, А ∨ В) либо | (например, А | В);
        <br />
        <span className="font-semibold">d)</span> следование (импликация)
        обозначается → (например, А → В);
        <br />
        <span className="font-semibold">e)</span> тождество обозначается ≡
        (например, A ≡ B); выражение A ≡ B истинно тогда и только тогда, когда
        значения A и B совпадают (либо они оба истинны, либо они оба ложны);
        <br />
        <span className="font-semibold">f)</span> символ 1 используется для
        обозначения истины (истинного высказывания); символ 0 – для обозначения лжи
        (ложного высказывания).
      </p>

      <p>
        <span className="font-semibold">2</span> Два логических выражения,
        содержащие переменные, называются равносильными (эквивалентными), если
        значения этих выражений совпадают при любых значениях переменных. Так,
        выражения А → В и (¬А) ∨ В равносильны, а А ∨ В и А ∧ В неравносильны
        (значения выражений разные, например, при А = 1, В = 0).
      </p>

      <p>
        <span className="font-semibold">3</span> Приоритеты логических операций:
        инверсия (отрицание), конъюнкция (логическое умножение), дизъюнкция
        (логическое сложение), импликация (следование), тождество. Таким образом, ¬А
        ∧ В ∨ С ∧ D означает то же, что и ((¬А) ∧ В) ∨ (С ∧ D). Возможна запись А ∧
        В ∧ С вместо (А ∧ В) ∧ С. То же относится и к дизъюнкции: возможна запись А
        ∨ В ∨ С вместо (А ∨ В) ∨ С.
      </p>

      <p>
        <span className="font-semibold">4</span> Обозначения Мбайт и Кбайт
        используются в традиционном для информатики смысле – как обозначения единиц
        измерения, соотношение которых с единицей «байт» выражается степенью двойки.
      </p>

      <br />

      {hasFiles && !hideAnswer && !oneAttempt && (
        <Button onClick={downloadAllFiles} className="mt-4">
          Скачать все файлы
        </Button>
      )}
    </div>
  );
}
