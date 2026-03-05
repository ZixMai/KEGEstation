"use client";

import Link from "next/link";
import { PlusIcon } from "lucide-react";

import { useGetAllKims } from "@/api/kim";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function KimsListPage() {
  const { data, isLoading } = useGetAllKims();

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Варианты КЕГЭ</h1>
        <Button asChild>
          <Link href="/admin/kims/new">
            <PlusIcon className="mr-2 size-4" />
            Создать вариант
          </Link>
        </Button>
      </div>

      {isLoading && (
        <p className="text-muted-foreground">Загрузка вариантов...</p>
      )}

      {!isLoading && (!data?.kims || data.kims.length === 0) && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Вариантов пока нет</p>
            <Button asChild className="mt-4">
              <Link href="/admin/kims/new">Создать первый вариант</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {data?.kims && data.kims.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          {data.kims.map((kim) => (
            <Link key={kim.id} href={`/admin/kims/${kim.id}`}>
              <Card className="h-full cursor-pointer transition-colors hover:bg-muted/50">
                <CardHeader>
                  <CardTitle>{kim.name}</CardTitle>
                  {kim.description && (
                    <CardDescription>{kim.description}</CardDescription>
                  )}
                </CardHeader>
                <CardFooter className="text-xs text-muted-foreground">
                  <p>{kim.creator}</p>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
