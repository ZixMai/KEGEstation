"use client";

import {Suspense, useEffect, useState} from "react";
import {useSearchParams} from "next/navigation";
import {useExamStore} from "@/stores/exam-store";
import {useUserStore} from "@/stores/user-store";
import {ExamShell} from "@/components/exam/exam-shell";
import {Registration} from "@/components/exam/registration";
import {Result} from "@/components/exam/result";
import {ExamForm} from "@/components/exam/exam-form";

function VariantContent() {
    const searchParams = useSearchParams();
    const [dataLoaded, setDataLoaded] = useState(false);
    const {loadKim, kimData, showResult} = useExamStore();
    const {user, loadUser} = useUserStore();

    useEffect(() => {
        const kim = searchParams.get("kim") || "-";
        // const difficult = Number(searchParams.get("difficult")) || 2;
        if (user) {
            loadKim(kim, user)
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
        }
    }, [searchParams, loadKim, user, loadUser]);



    if (!dataLoaded || !kimData) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-xl">Загрузка...</div>
            </div>
        );
    }

    if (kimData.realMode) {
        return <Registration/>;
    }

    if (showResult) {
        return <Result/>;
    }

    return <ExamShell/>;
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
            <VariantContent/>
        </Suspense>
    );
}
