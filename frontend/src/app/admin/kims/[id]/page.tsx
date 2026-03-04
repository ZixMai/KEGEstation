"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";

import { useGetAllKims } from "@/api/kim";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ViewKimPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const kimId = Number(id);
  const { data, isLoading } = useGetAllKims();

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <p className="text-muted-foreground">Загрузка варианта...</p>
      </div>
    );
  }

  const kim = data?.kims?.find((k) => k.id === kimId);

  if (!kim) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <p className="text-destructive">Вариант не найден</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl space-y-6 px-4 py-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/kims">
            <ArrowLeftIcon className="mr-1 size-4" />
            Назад
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{kim.name}</CardTitle>
          {kim.description && (
            <CardDescription>{kim.description}</CardDescription>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Автор:</span>{" "}
              {kim.creator}
            </div>
            <div>
              <span className="text-muted-foreground">Создан:</span>{" "}
              {new Date(kim.createdAt).toLocaleDateString("ru-RU")}
            </div>
          </div>

          <div className="flex gap-2">
            <Button asChild>
              <Link href={`/register?kim=${kim.id}`}>Начать экзамен</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
