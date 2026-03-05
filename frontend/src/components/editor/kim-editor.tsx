"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useCreateKim, useGetAllTasks } from "@/api/kim";
import { LatexWrapper } from "@/components/latex-wrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {toast} from "sonner";

const kimSchema = z.object({
  name: z.string().min(1, "Название обязательно"),
  description: z.string(),
  unlockCode: z.string().min(1, "Код разблокировки обязателен"),
  realMode: z.boolean(),
});

type KimFormValues = z.infer<typeof kimSchema>;

export function KimEditor() {
  const router = useRouter();
  const [selectedTaskIds, setSelectedTaskIds] = useState<Set<number>>(
    new Set(),
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const { data: tasks, isLoading: tasksLoading } = useGetAllTasks();
  const createKim = useCreateKim();

  const form = useForm<KimFormValues>({
    resolver: zodResolver(kimSchema),
    defaultValues: {
      name: "",
      description: "",
      unlockCode: "MAI8",
      realMode: false,
    },
  });

  const toggleTask = (taskId: number) => {
    setSelectedTaskIds((prev) => {
      const next = new Set(prev);
      if (next.has(taskId)) {
        next.delete(taskId);
      } else {
        next.add(taskId);
      }
      return next;
    });
  };

  const handleSubmit = async (data: KimFormValues) => {
    if (selectedTaskIds.size === 0) return;

    setIsSubmitting(true);
    setSubmitSuccess(false);

    try {
      await createKim.mutateAsync({
        name: data.name,
        description: data.description,
        unlockCode: data.unlockCode,
        realMode: data.realMode,
        tasks: Array.from(selectedTaskIds),
      });
      setSubmitSuccess(true);
      toast.success("Новый вариант был успешно создан")
      setTimeout(() => router.push("/admin/kims"), 1000);
    } catch (error) {
      toast.error(`Произошла ошибка при создании варианта ${error}`)
      console.error("Failed to create KIM:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl space-y-6 px-4 py-8">
      <h1 className="text-3xl font-bold">Создание варианта КЕГЭ</h1>

      {/* Kim Metadata */}
      <Card>
        <CardHeader>
          <CardTitle>Параметры варианта</CardTitle>
        </CardHeader>
        <CardContent>
          <form id="kim-form" onSubmit={form.handleSubmit(handleSubmit)}>
            <FieldGroup>
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Название*</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      placeholder="Вариант 1"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="description"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Описание</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      placeholder="Описание варианта"
                    />
                  </Field>
                )}
              />

              <Controller
                name="unlockCode"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>
                      Код разблокировки*
                    </FieldLabel>
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

              <Controller
                name="realMode"
                control={form.control}
                render={({ field }) => (
                  <Field orientation="horizontal">
                    <FieldLabel htmlFor="realMode">
                      Режим реального экзамена
                    </FieldLabel>
                    <Switch
                      id="realMode"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </Field>
                )}
              />
            </FieldGroup>
          </form>
        </CardContent>
      </Card>

      {/* Task Selection */}
      <Card>
        <CardHeader>
          <CardTitle>
            Задания{" "}
            {selectedTaskIds.size > 0 && (
              <span className="text-sm font-normal text-muted-foreground">
                (выбрано: {selectedTaskIds.size})
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {tasksLoading && (
            <p className="text-muted-foreground">Загрузка заданий...</p>
          )}

          {!tasksLoading && (!tasks || tasks.length === 0) && (
            <p className="text-muted-foreground">
              Нет доступных заданий. Сначала создайте задания.
            </p>
          )}

          {tasks && tasks.length > 0 && (
            <div className="space-y-2">
              {tasks.map((task) => (
                <label
                  key={task.id}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors ${
                    selectedTaskIds.has(task.id)
                      ? "border-primary bg-primary/5"
                      : "hover:bg-muted/50"
                  }`}
                >
                  <Checkbox
                    checked={selectedTaskIds.has(task.id)}
                    onCheckedChange={() => toggleTask(task.id)}
                  />
                  <h3>ID {task.id}</h3>
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                    {task.number ?? "–"}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm">
                      {task.text ? (
                        <LatexWrapper content={task.text} />
                      ) : (
                        "Без текста"
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Ключ: {task.key}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Submit */}
      <div className="flex items-center gap-4">
        <Button
          type="submit"
          form="kim-form"
          disabled={isSubmitting || selectedTaskIds.size === 0}
          className="px-8"
        >
          {isSubmitting ? "Создание..." : "Создать вариант"}
        </Button>
        {selectedTaskIds.size === 0 && (
          <span className="text-sm text-muted-foreground">
            Выберите хотя бы одно задание
          </span>
        )}
        {submitSuccess && (
          <span className="text-sm text-green-600">Вариант успешно создан</span>
        )}
      </div>
    </div>
  );
}
