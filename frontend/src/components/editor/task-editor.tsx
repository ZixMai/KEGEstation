"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { Plate, usePlateEditor } from "platejs/react";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileIcon, Trash2Icon, UploadIcon } from "lucide-react";
import { createStaticEditor, serializeHtml } from 'platejs/static';
import { TaskEditorBaseKit } from "./plugins/task-editor-base-kit";

import {
  type GetAllTasksItem,
  type s3,
  useCreateTask,
  useUpdateTask,
  useDeleteTask,
} from "@/api/kim";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Editor, EditorContainer } from "@/components/ui/editor";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { TaskEditorKit } from "./plugins/task-editor-kit";
import { TaskEditorToolbar } from "./task-editor-toolbar";
import {toast} from "sonner";

const taskSchema = z.object({
  number: z.coerce.number().min(1, "Номер задания обязателен"),
  key: z.string().min(1, "Ключ ответа обязателен"),
  answerColumnsSize: z.coerce.number().min(0),
  answerRowsSize: z.coerce.number().min(0),
});

type TaskFormValues = z.infer<typeof taskSchema>;

interface TaskEditorProps {
  task?: GetAllTasksItem;
}

export function TaskEditor({ task }: TaskEditorProps) {
  const isEditMode = !!task;
  const router = useRouter();

  const [files, setFiles] = useState<File[]>([]);
  const [existingFiles, setExistingFiles] = useState<s3[]>(
    task?.fileS3Keys ?? [],
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = usePlateEditor({
    plugins: TaskEditorKit,
    value: task?.editorJson ? JSON.parse(task.editorJson) : undefined,
  });

  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      number: task?.number ?? 1,
      key: task?.key ?? "",
      answerColumnsSize: task?.table?.columns ?? 0,
      answerRowsSize: task?.table?.rows ?? 0,
    },
  });

  const answerColumnsSize = form.watch("answerColumnsSize");
  const answerRowsSize = form.watch("answerRowsSize");
  const isMatrixAnswer = answerColumnsSize > 0 && answerRowsSize > 0;

  const handleSubmit = async (data: TaskFormValues) => {
    setIsSubmitting(true);
    setSubmitSuccess(false);

    try {
      const editorJson = JSON.stringify(editor.children);
      const staticEditor = createStaticEditor({
          plugins: TaskEditorBaseKit,
          value: editor.children,
      });

      const plainText = await serializeHtml(staticEditor)

      const formData = new FormData();
      formData.append("Text", plainText);
      formData.append("EditorJson", editorJson);
      formData.append("Number", String(data.number));
      formData.append("Key", data.key);
      formData.append("AnswerColumnsSize", String(data.answerColumnsSize));
      formData.append("AnswerRowsSize", String(data.answerRowsSize));

      if (isEditMode) {
        formData.append("TaskId", String(task.id));
        formData.append("FileS3Keys", JSON.stringify(existingFiles));
        for (const file of files) {
          formData.append("NewFiles", file);
        }
        await updateTask.mutateAsync(formData);
        toast.success("Задание было успешно обновлено")
      } else {
        for (const file of files) {
          formData.append("Files", file);
        }
        await createTask.mutateAsync(formData);
        toast.success("Задание было успешно создано")
      }

      setSubmitSuccess(true);
      if (!isEditMode) {
        setFiles([]);
      }
    } catch (error) {
      toast.error(`Что-то пошло не так ${error}`);
      console.error("Failed to save task:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!task) return;
    try {
      await deleteTask.mutateAsync(task.id);
      toast.success("Задание было успешно удалено")
      router.push("/admin/tasks");
    } catch (error) {
      toast.error(`Что-то пошло не так ${error}`);
      console.error("Failed to delete task:", error);
    }
  };

  const handleFileAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileRemove = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleExistingFileRemove = (index: number) => {
    setExistingFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="container mx-auto max-w-4xl space-y-6 px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          {isEditMode ? "Редактирование задания" : "Создание задания"}
        </h1>
        {isEditMode && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Удалить задание</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Удалить задание?</AlertDialogTitle>
                <AlertDialogDescription>
                  Это действие нельзя отменить. Задание будет удалено навсегда.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Отмена</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>
                  Удалить
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      {/* Metadata */}
      <Card>
        <CardHeader>
          <CardTitle>Параметры задания</CardTitle>
        </CardHeader>
        <CardContent>
          <form id="task-form" onSubmit={form.handleSubmit(handleSubmit)}>
            <FieldGroup>
              <Controller
                name="number"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Номер задания*</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      type="number"
                      min={1}
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <Controller
                  name="answerRowsSize"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>
                        Строки таблицы ответа
                      </FieldLabel>
                      <Input
                        {...field}
                        id={field.name}
                        type="number"
                        min={0}
                        aria-invalid={fieldState.invalid}
                      />
                    </Field>
                  )}
                />
                <Controller
                  name="answerColumnsSize"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>
                        Столбцы таблицы ответа
                      </FieldLabel>
                      <Input
                        {...field}
                        id={field.name}
                        type="number"
                        min={0}
                        aria-invalid={fieldState.invalid}
                      />
                    </Field>
                  )}
                />
              </div>

              {isMatrixAnswer ? (
                <MatrixKeyInput
                  rows={answerRowsSize}
                  cols={answerColumnsSize}
                  initialValues={task?.key}
                  onChange={(value) => form.setValue("key", value)}
                />
              ) : (
                <Controller
                  name="key"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Ключ ответа*</FieldLabel>
                      <Input
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              )}
            </FieldGroup>
          </form>
        </CardContent>
      </Card>

      {/* Editor */}
      <Card>
        <CardHeader>
          <CardTitle>Текст задания</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-lg border">
            <Plate editor={editor}>
              <TaskEditorToolbar />
              <EditorContainer className="min-h-[300px]">
                <Editor
                  variant="fullWidth"
                  placeholder="Введите текст задания..."
                />
              </EditorContainer>
            </Plate>
          </div>
        </CardContent>
      </Card>

      {/* File Attachments */}
      <Card>
        <CardHeader>
          <CardTitle>Прикреплённые файлы</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div
              className="flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 p-6 transition-colors hover:border-muted-foreground/50"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <UploadIcon className="size-8" />
                <span className="text-sm">Нажмите для выбора файлов</span>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={handleFileAdd}
              />
            </div>

            {existingFiles.length > 0 && (
              <div className="space-y-2">
                {existingFiles.map((file) => (
                  <div
                    key={file.url}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="flex items-center gap-2">
                      <FileIcon className="size-4 text-muted-foreground" />
                      <span className="text-sm">{file.name}</span>
                      <span className="text-xs text-muted-foreground">
                        (существующий)
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        handleExistingFileRemove(existingFiles.indexOf(file))
                      }
                    >
                      <Trash2Icon className="size-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {files.length > 0 && (
              <div className="space-y-2">
                {files.map((file, index) => (
                  <div
                    key={`${file.name}-${index}`}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="flex items-center gap-2">
                      <FileIcon className="size-4 text-muted-foreground" />
                      <span className="text-sm">{file.name}</span>
                      <span className="text-xs text-muted-foreground">
                        ({formatFileSize(file.size)})
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleFileRemove(index)}
                    >
                      <Trash2Icon className="size-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Submit */}
      <div className="flex items-center gap-4">
        <Button
          type="submit"
          form="task-form"
          disabled={isSubmitting}
          className="px-8"
        >
          {isSubmitting
            ? isEditMode
              ? "Обновление..."
              : "Создание..."
            : isEditMode
              ? "Обновить задание"
              : "Создать задание"}
        </Button>
        {submitSuccess && (
          <span className="text-sm text-green-600">
            {isEditMode
              ? "Задание успешно обновлено"
              : "Задание успешно создано"}
          </span>
        )}
      </div>
    </div>
  );
}

function MatrixKeyInput({
  rows,
  cols,
  initialValues,
  onChange,
}: {
  rows: number;
  cols: number;
  initialValues?: string;
  onChange: (value: string) => void;
}) {
  const [values, setValues] = useState<string[][]>(() => {
    if (initialValues) {
      const parsed = initialValues.split("\\n").map((row) => row.split(" "));
      return Array.from({ length: rows }, (_, i) =>
        Array.from({ length: cols }, (_, j) => parsed[i]?.[j] ?? ""),
      );
    }
    return Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => ""),
    );
  });

  const prevRows = useRef(rows);
  const prevCols = useRef(cols);
  if (rows !== prevRows.current || cols !== prevCols.current) {
    prevRows.current = rows;
    prevCols.current = cols;
    const newValues = Array.from({ length: rows }, (_, i) =>
      Array.from({ length: cols }, (_, j) => values[i]?.[j] ?? ""),
    );
    setValues(newValues);
  }

  const handleCellChange = (row: number, col: number, val: string) => {
    const newValues = values.map((r) => [...r]);
    if (newValues[row]) {
      newValues[row][col] = val;
    }
    setValues(newValues);

    const serialized = newValues.map((r) => r.join(" ")).join("\\n");
    onChange(serialized);
  };

  return (
    <Field>
      <FieldLabel>Ключ ответа (матрица)*</FieldLabel>
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full border-collapse">
          <tbody>
            <tr>
              <td className="border border-border bg-muted p-2 text-center" />
              {Array.from({ length: cols }, (_, j) => (
                <td
                  key={j}
                  className="border border-border bg-muted p-2 text-center text-sm font-semibold"
                >
                  {j + 1}
                </td>
              ))}
            </tr>
            {Array.from({ length: rows }, (_, i) => (
              <tr key={i}>
                <td className="w-12 border border-border bg-muted p-2 text-center text-sm font-semibold">
                  {i + 1}
                </td>
                {Array.from({ length: cols }, (_, j) => (
                  <td key={j} className="border border-border p-0">
                    <input
                      type="text"
                      className="h-10 w-full border-0 px-2 text-center focus:outline-none focus:ring-2 focus:ring-primary"
                      value={values[i]?.[j] ?? ""}
                      onChange={(e) => handleCellChange(i, j, e.target.value)}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Field>
  );
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / k ** i).toFixed(1)} ${sizes[i]}`;
}
