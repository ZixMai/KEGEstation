"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useExamStore } from "@/stores/exam-store";
import { useUserStore } from "@/stores/user-store";
import { ExamShell } from "@/components/exam/exam-shell";
import { Registration } from "@/components/exam/registration";
import { Result } from "@/components/exam/result";

function VariantContent() {
  const searchParams = useSearchParams();
  const [dataLoaded, setDataLoaded] = useState(false);
  const { loadKim, kimData, realMode, showResult } = useExamStore();
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    const kim = searchParams.get("kim") || "-";
    const difficult = Number(searchParams.get("difficult")) || 2;

    loadKim(kim, difficult, user?.id)
      .then(() => setDataLoaded(true))
      .catch((err) => {
        if (err.message === "authError") {
          alert("Необходима авторизация!");
          window.location.href = "/";
        }
        if (err.message === "loadError") {
          window.location.href = "/";
        }
      });
  }, [searchParams, loadKim, user]);

  if (!dataLoaded || !kimData) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-xl">Загрузка...</div>
      </div>
    );
  }

  if (realMode) {
    return <Registration />;
  }

  if (showResult) {
    return <Result />;
  }

  return <ExamShell />;
}

export default function VariantPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-xl">Загрузка...</div>
        </div>
      }
    >
      <VariantContent />
    </Suspense>
  );
}
