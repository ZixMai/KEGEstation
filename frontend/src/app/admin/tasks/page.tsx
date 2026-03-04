"use client";

import Link from "next/link";
import { PlusIcon } from "lucide-react";

import { useGetAllTasks } from "@/api/kim";
import { LatexWrapper } from "@/components/latex-wrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TasksListPage() {
  const { data: tasks, isLoading } = useGetAllTasks();

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Задания</h1>
        <Button asChild>
          <Link href="/admin/tasks/new">
            <PlusIcon className="mr-2 size-4" />
            Создать задание
          </Link>
        </Button>
      </div>

      {isLoading && (
        <p className="text-muted-foreground">Загрузка заданий...</p>
      )}

      {!isLoading && (!tasks || tasks.length === 0) && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Заданий пока нет</p>
            <Button asChild className="mt-4">
              <Link href="/admin/tasks/new">Создать первое задание</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {tasks && tasks.length > 0 && (
        <div className="space-y-2">
          {tasks.map((task) => (
            <Link key={task.id} href={`/admin/tasks/${task.id}`}>
              <Card className="cursor-pointer transition-colors hover:bg-muted/50">
                <CardHeader className="py-4">
                  <h3>ID {task.id}</h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                        {task.number ?? "–"}
                      </span>
                      <div>
                        <CardTitle className="text-base font-normal">
                          {task.text ? (
                            <LatexWrapper content={task.text} />
                          ) : (
                            "Без текста"
                          )}
                        </CardTitle>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Ключ: {task.key}
                          {task.table &&
                            ` | Таблица: ${task.table.rows}x${task.table.columns}`}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
