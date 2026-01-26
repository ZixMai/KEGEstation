"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Header } from "./header";
import apiClient from "@/lib/axios";
import {useGetAllKims} from "@/api";
import {Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "./ui/card";
import Link from "next/link";

export function StartPage() {
    const [kim, setKim] = useState("");
    const [difficulty, setDifficulty] = useState("0");
    const router = useRouter();
    const {data: kims} = useGetAllKims();

    const startExam = async () => {
        if (kim) {
            try {
                const res = await apiClient.get(`/variant/kim/${kim}/type`);
                const type = res.data.type;
                if (type === "variant") {
                    router.push(`/variant?kim=${kim}`);
                } else {
                    router.push(`/homework?kim=${kim}`);
                }
            } catch {
                setKim("");
            }
        }
    };

    const startRandomExam = () => {
        router.push(`/variant?difficult=${difficulty}`);
    };

    const openFIPI = () => {
        window.open("https://openfipi.devinf.ru/", "_blank");
    };

    const openYandex = () => {
        window.open(
            "https://education.yandex.ru/ege?utm_source=platform&utm_medium=partner&utm_campaign=ege&utm_content=cege_link_kabanov&utm_term=20231101",
            "_blank"
        );
    };

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold mb-4">
                            Демонстрационная версия станции КЕГЭ
                        </h1>
                    </div>

                    <div className="text-xl text-center border-b py-2">
                        Варианты
                    </div>

                    <div className="grid grid-cols-3 gap-2 mt-2">
                        {
                            kims?.kims?.map((kim, idx) => (
                                <Card key={idx}>
                                    <CardHeader>
                                        <CardTitle>{kim.id}</CardTitle>
                                        <CardDescription>{kim.description}</CardDescription>
                                        <CardAction>
                                            <Button asChild>
                                                <Link href={`variant?kim=${kim.id}`}>Начать</Link>
                                            </Button>
                                        </CardAction>
                                    </CardHeader>
                                    <CardContent>
                                        {/*<p>Card Content</p>*/}
                                    </CardContent>
                                    <CardFooter className="flex flex-col">
                                        <p>{kim.creator}</p>
                                        <p>{kim.createdAt}</p>
                                    </CardFooter>
                                </Card>
                            ))
                        }

                    </div>
                    {/*<nav className="mb-8">*/}
                    {/*    <div className="flex flex-wrap justify-center gap-4">*/}
                    {/*        <Button variant="outline" onClick={() => router.push("/task")}>*/}
                    {/*            База заданий*/}
                    {/*        </Button>*/}
                    {/*        <Button variant="outline" onClick={() => router.push("/archive")}>*/}
                    {/*            Варианты*/}
                    {/*        </Button>*/}
                    {/*        <Button variant="outline" onClick={() => router.push("/course")}>*/}
                    {/*            Открытый курс*/}
                    {/*        </Button>*/}
                    {/*        <Button variant="outline" onClick={() => router.push("/jobs")}>*/}
                    {/*            Годовой курс*/}
                    {/*        </Button>*/}
                    {/*        <Button variant="outline" onClick={openYandex}>*/}
                    {/*            ЕГЭ от <span className="text-red-600">Я</span>ндекса*/}
                    {/*        </Button>*/}
                    {/*        <Button variant="outline" onClick={openFIPI}>*/}
                    {/*            Банк ФИПИ*/}
                    {/*        </Button>*/}
                    {/*    </div>*/}
                    {/*</nav>*/}



                </div>
            </div>
        </div>
    );
}
