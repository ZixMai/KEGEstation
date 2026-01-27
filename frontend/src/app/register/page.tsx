"use client";

import {useUserStore} from "@/stores/user-store";
import {redirect, useSearchParams} from "next/navigation";
import {ExamForm} from "@/components/exam/exam-form";

export default function RegisterPage() {
    const {user} = useUserStore();
    const params = useSearchParams();

    if (user) {
        redirect(`variant?kim=${params.get("kim")}`)
        return;
    }

    return (<div className="h-screen flex flex-row justify-center items-center w-full"><ExamForm/></div>);
}