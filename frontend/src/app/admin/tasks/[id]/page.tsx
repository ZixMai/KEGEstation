"use client";

import { use } from "react";

import { useGetAllTasks } from "@/api/kim";
import { TaskEditor } from "@/components/editor/task-editor";

export default function EditTaskPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const taskId = Number(id);
  const { data: tasks, isLoading } = useGetAllTasks();

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <p className="text-muted-foreground">Загрузка задания...</p>
      </div>
    );
  }

  const task = tasks?.find((t) => t.id === taskId);

  if (!task) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <p className="text-destructive">Задание не найдено</p>
      </div>
    );
  }

  return <TaskEditor key={task.id} task={task} />;
}
