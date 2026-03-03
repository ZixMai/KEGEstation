"use client";

import {useUserStore} from "@/stores/user-store";
import {redirect, useSearchParams} from "next/navigation";
import {ExamForm} from "@/components/exam/exam-form";
import {Suspense} from "react";

function RegisterContent() {
    const {user} = useUserStore();
    const params = useSearchParams();

    if (user) {
        redirect(`variant?kim=${params.get("kim")}`)
    }

    return (<div className="h-screen flex flex-row justify-center items-center w-full"><ExamForm/></div>);
}

export default function RegisterPage() {
    return (
        <Suspense
            fallback={
                <div className="flex min-h-screen items-center justify-center">
                    <div className="text-xl">Загрузка...</div>
                </div>
            }
        >
            <RegisterContent/>
        </Suspense>
    )
}