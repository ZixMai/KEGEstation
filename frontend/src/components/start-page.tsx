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

export function StartPage() {
    const [kim, setKim] = useState("");
    const [difficulty, setDifficulty] = useState("0");
    const router = useRouter();

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

                    <nav className="mb-8">
                        <div className="flex flex-wrap justify-center gap-4">
                            <Button variant="outline" onClick={() => router.push("/task")}>
                                База заданий
                            </Button>
                            <Button variant="outline" onClick={() => router.push("/archive")}>
                                Варианты
                            </Button>
                            <Button variant="outline" onClick={() => router.push("/course")}>
                                Открытый курс
                            </Button>
                            <Button variant="outline" onClick={() => router.push("/jobs")}>
                                Годовой курс
                            </Button>
                            <Button variant="outline" onClick={openYandex}>
                                ЕГЭ от <span className="text-red-600">Я</span>ндекса
                            </Button>
                            <Button variant="outline" onClick={openFIPI}>
                                Банк ФИПИ
                            </Button>
                        </div>
                    </nav>

                    <div className="prose dark:prose-invert max-w-none mb-8">
                        <p>
                            Предлагаемая демонстрационная версия позволяет проводить тренировку
                            экзамена по Информатике и ИКТ в компьютерной форме (КЕГЭ).
                        </p>
                        <p>
                            В проекте используются задачи с сайта{" "}
                            <a href="http://kpolyakov.spb.ru/school/ege.htm">К.Ю. Полякова</a>,
                            а также авторские задачи.
                        </p>
                        <p>
                            По поводу добавления задач, вариантов, а также прочих пожеланий и
                            замечаний просьба писать{" "}
                            <a target="_blank" href="https://vk.com/cabanovalexey">
                                автору
                            </a>
                            .
                        </p>
                        <p>
                            <span className="font-bold">13.01.2026</span> Добавлен зимний
                            гробовик 👿! (<a href="/archive">Варианты</a>)
                        </p>
                        <p>
                            <span className="font-bold">13.01.2026</span> Добавлен вариант от{" "}
                            <a href="https://t.me/infkege">Л. Шастина и Д. Бахтиева</a>! (
                            <a href="/archive">Варианты</a>)
                        </p>
                        <p>
                            <span className="font-bold">25.12.2025</span> Добавлен вариант от{" "}
                            <a href="https://vk.cc/cRqp6e">Дани Байта</a>! (
                            <a href="/archive">Варианты</a>)
                        </p>
                        <p>
                            <span className="font-bold">22.12.2025</span> Добавлен вариант от{" "}
                            <a href="https://vk.com/vitu22">В. Лашина</a> и{" "}
                            <a href="https://vk.com/fkslaakjcm">К. Иглина</a>! (
                            <a href="/archive">Варианты</a>)
                        </p>
                        <p>
                            <span className="font-bold">16.12.2025</span> Добавлен вариант от{" "}
                            <a href="https://vk.com/so.sergeev">С. Сергеева</a> и{" "}
                            <a href="https://vk.com/max_byte">М. Вардоева</a>! (
                            <a href="/archive">Варианты</a>)
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex gap-4 justify-center">
                            <Select value={difficulty} onValueChange={setDifficulty}>
                                <SelectTrigger className="w-48">
                                    <SelectValue placeholder="Выберите сложность" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="0">Базовый</SelectItem>
                                    <SelectItem value="1">Средний</SelectItem>
                                    <SelectItem value="2">Сложный</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button onClick={startRandomExam}>Начать экзамен</Button>
                        </div>

                        <div className="flex gap-4 justify-center">
                            <Input
                                type="text"
                                value={kim}
                                onChange={(e) => setKim(e.target.value)}
                                placeholder="№ КИМ"
                                className="w-48"
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") startExam();
                                }}
                            />
                            <Button onClick={startExam}>Начать экзамен</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
