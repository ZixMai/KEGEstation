"use client";

import {useExamStore} from "@/stores/exam-store";
import {Button} from "../ui/button";
import {Input} from "../ui/input";
import {useRef, useState} from "react";
import {ChevronLeft, ChevronRight, CircleAlert} from "lucide-react";
import {InputOTP, InputOTPGroup, InputOTPSlot} from "@/components/ui/input-otp";
import {REGEXP_ONLY_DIGITS} from "input-otp";
import Image from 'next/image'
import {Warning} from "postcss";

export function Registration() {
    const {startExam, setBlankNumber, kimData} = useExamStore();
    const [stage, setStage] = useState(1);
    const [blankNum, setBlankNum] = useState("");
    const [instructionIndex, setInstructionIndex] = useState(0);
    const [hasReadAllInstructions, setHasReadAllInstructions] = useState(false);
    const [activationCode, setActivationCode] = useState("");

    const input1Ref = useRef<HTMLInputElement>(null);
    const input2Ref = useRef<HTMLInputElement>(null);
    const input3Ref = useRef<HTMLInputElement>(null);

    // Форматирование номера бланка
    const formatBlankNumber = (value: string) => {
        const digits = value.replace(/\D/g, "");
        const parts = [];

        if (digits.length > 0) parts.push(digits.substring(0, 1));
        if (digits.length > 1) parts.push(digits.substring(1, 7));
        if (digits.length > 7) parts.push(digits.substring(7, 13));

        return parts;
    };

    const handleBlankNumberChange = (
        inputIndex: number,
        value: string,
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const digits = value.replace(/\D/g, "");

        // Определяем текущую позицию курсора
        const cursorPos = e.target.selectionStart || 0;
        const wasAtEnd = cursorPos === e.target.value.length;

        if (inputIndex === 0) {
            // Первое поле - только 1 цифра
            const newValue = digits.slice(0, 1);
            const restDigits = blankNum.substring(1);
            const newBlankNum = newValue + restDigits;

            if (newBlankNum.length <= 13) {
                setBlankNum(newBlankNum);

                // Автофокус на следующее поле если введена цифра
                if (newValue.length === 1 && wasAtEnd) {
                    setTimeout(() => input2Ref.current?.focus(), 0);
                }
            }
        } else if (inputIndex === 1) {
            // Второе поле - до 6 цифр
            const firstDigit = blankNum.substring(0, 1);
            const newValue = digits.slice(0, 6);
            const restDigits = blankNum.substring(7);
            const newBlankNum = firstDigit + newValue + restDigits;

            if (newBlankNum.length <= 13) {
                setBlankNum(newBlankNum);

                // Автофокус на следующее поле если введено 6 цифр
                if (newValue.length === 6 && wasAtEnd) {
                    setTimeout(() => input3Ref.current?.focus(), 0);
                }
            }
        } else if (inputIndex === 2) {
            // Третье поле - до 6 цифр
            const firstPart = blankNum.substring(0, 7);
            const newValue = digits.slice(0, 6);
            const newBlankNum = firstPart + newValue;

            if (newBlankNum.length <= 13) {
                setBlankNum(newBlankNum);
            }
        }
    };

    const instructionPictures = [
        "https://kompege.ru/images/1.png",
        "https://kompege.ru/images/2.png",
        "https://kompege.ru/images/3.png",
        "https://kompege.ru/images/4.png",
        "https://kompege.ru/images/5.png",
        "https://kompege.ru/images/6.png",
        "https://kompege.ru/images/7.png",
        "https://kompege.ru/images/8.png"
    ]

    const handleNextInstruction = () => {
        if (instructionIndex < instructionPictures.length - 1) {
            setInstructionIndex(instructionIndex + 1);
        }
        // Помечаем что прочитали все, когда дошли до последней страницы
        if (instructionIndex === instructionPictures.length - 1) {
            setHasReadAllInstructions(true);
        }
    };

    const handlePrevInstruction = () => {
        if (instructionIndex > 0) {
            setInstructionIndex(instructionIndex - 1);
        }
    };

    const handleStart = () => {
        if (blankNum) {
            setBlankNumber(blankNum);
        }
        startExam();
    };

    const blankParts = formatBlankNumber(blankNum);
    const isBlankNumberComplete = blankNum.length === 13;
    const isLastInstruction = instructionIndex === instructionPictures.length - 1;

    const instructionTitles = [
        "Единый государственный экзамен Информатика и ИКТ",
        "Инструкция",
        "Регистрация участника",
        "Активация экзамена"
    ]


    return (
        <div className="min-h-screen flex flex-col bg-[#2a2a2a] w-full text-white p-4">
            {/*<div className="">*/}
            <h1 className="text-3xl text-left top-[-1]">
                {instructionTitles[stage - 1]}
            </h1>
            {/* Stage 1: Ввод номера бланка */}
            {stage === 1 && (<>
                <div className="flex flex-col justify-between space-y-8 grow mt-10">
                    <div className="flex justify-center items-ce p-8 rounded-lg space-y-8">
                        <div>
                            <h2 className="text-xl mb-4">
                                Введите номер вашего бланка регистрации
                            </h2>

                            <InputOTP maxLength={13} pattern={REGEXP_ONLY_DIGITS} value={blankNum}
                                      className="flex gap-2 mb-4" onChange={setBlankNum}>
                                <InputOTPGroup>
                                    <InputOTPSlot index={0}/>
                                </InputOTPGroup>
                                <InputOTPGroup>
                                    <InputOTPSlot index={1}/>
                                    <InputOTPSlot index={2}/>
                                    <InputOTPSlot index={3}/>
                                    <InputOTPSlot index={4}/>
                                    <InputOTPSlot index={5}/>
                                    <InputOTPSlot index={6}/>
                                </InputOTPGroup>
                                <InputOTPGroup>
                                    <InputOTPSlot index={7}/>
                                    <InputOTPSlot index={8}/>
                                    <InputOTPSlot index={9}/>
                                    <InputOTPSlot index={10}/>
                                    <InputOTPSlot index={11}/>
                                    <InputOTPSlot index={12}/>
                                </InputOTPGroup>
                            </InputOTP>

                            <p className="text-sm text-gray-400 mb-6">
                                На данном этапе Вам необходимо ввести с клавиатуры номер бланка
                                регистрации и нажать «Далее». Кнопка «Далее» будет доступна после
                                ввода номера бланка, включающего 13 цифр.
                            </p>
                        </div>
                        <div>
                            В этом месте бланка регистрации указан номер,который Вам необходимо внести в систему.
                            <Image src="https://kompege.ru/images/blank.png" alt="fdfsf" width={500} height={500}/>
                        </div>
                    </div>
                    <div className="self-end">
                        <Button
                            onClick={() => setStage(2)}
                            disabled={!isBlankNumberComplete}
                            className="px-8 py-3 text-lg bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
                        >
                            Далее
                        </Button>
                    </div>
                </div>
            </>)}

            {/* Stage 2: Инструкция */}
            {stage === 2 && (
                <div className="flex flex-col justify-between space-y-8 grow mt-10">
                    <div className="text-black rounded-lg overflow-hidden">

                        <div className="min-h-[500px] flex items-center justify-center relative">
                            {/* Левая стрелка */}
                            {instructionIndex > 0 && (
                                <button
                                    onClick={handlePrevInstruction}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-cyan-500 hover:bg-cyan-600 flex items-center justify-center text-white transition-colors"
                                >
                                    <ChevronLeft className="w-8 h-8"/>
                                </button>
                            )}

                            {/* Контент */}
                            <img className="w-[60%]" src={instructionPictures[instructionIndex]!} alt=""/>

                            {/* Правая стрелка */}
                            {!isLastInstruction && (
                                <button
                                    onClick={handleNextInstruction}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-cyan-500 hover:bg-cyan-600 flex items-center justify-center text-white transition-colors"
                                >
                                    <ChevronRight className="w-8 h-8"/>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Кнопка Далее появляется на последней странице */}
                    {isLastInstruction && (
                        <div className="absolute flex bottom-4 right-4">
                            <Button
                                onClick={() => setStage(3)}
                                className="px-8 py-3 text-lg bg-cyan-600 hover:bg-cyan-700"
                            >
                                Далее
                            </Button>
                        </div>
                    )}
                </div>
            )}

            {/* Stage 3: Проверка данных */}
            {stage === 3 && (
                <div className="flex flex-col justify-between space-y-8 grow mt-10">
                    <div className="p-8 rounded-lg space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold mb-4">БЛАНК РЕГИСТРАЦИИ</h3>
                            <div className="flex gap-2 mb-6">
                                <InputOTP maxLength={13} pattern={REGEXP_ONLY_DIGITS} value={blankNum}
                                          className="flex gap-2 mb-4" readOnly disabled>
                                    <InputOTPGroup>
                                        <InputOTPSlot index={0}/>
                                    </InputOTPGroup>
                                    <InputOTPGroup>
                                        <InputOTPSlot index={1}/>
                                        <InputOTPSlot index={2}/>
                                        <InputOTPSlot index={3}/>
                                        <InputOTPSlot index={4}/>
                                        <InputOTPSlot index={5}/>
                                        <InputOTPSlot index={6}/>
                                    </InputOTPGroup>
                                    <InputOTPGroup>
                                        <InputOTPSlot index={7}/>
                                        <InputOTPSlot index={8}/>
                                        <InputOTPSlot index={9}/>
                                        <InputOTPSlot index={10}/>
                                        <InputOTPSlot index={11}/>
                                        <InputOTPSlot index={12}/>
                                    </InputOTPGroup>
                                </InputOTP>
                                <Button
                                    variant="destructive"
                                    onClick={() => setStage(1)}
                                    className="px-6"
                                >
                                    ИЗМЕНИТЬ
                                </Button>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-4">НОМЕР КИМ</h3>
                            <div className="flex gap-2 mb-6">
                                <InputOTP maxLength={8} pattern={REGEXP_ONLY_DIGITS} value={kimData?.id?.toString()}
                                          className="flex gap-2 mb-4" readOnly disabled>
                                    <InputOTPGroup>
                                        <InputOTPSlot index={0}/>
                                        <InputOTPSlot index={1}/>
                                        <InputOTPSlot index={2}/>
                                        <InputOTPSlot index={3}/>
                                    </InputOTPGroup>
                                    <InputOTPGroup>
                                        <InputOTPSlot index={4}/>
                                        <InputOTPSlot index={5}/>
                                        <InputOTPSlot index={6}/>
                                    </InputOTPGroup>
                                    <InputOTPGroup>
                                        <InputOTPSlot index={7}/>
                                    </InputOTPGroup>
                                </InputOTP>
                            </div>
                        </div>

                        <div className="space-y-4 bg-black p-6 rounded">
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-12 h-12 rounded-full bg-cyan-500 flex items-center justify-center text-xl font-bold">
                                    1
                                </div>
                                <p>
                                    Сверьте приведенный выше номер бланка регистрации с номером,
                                    указанным на Вашем бланке регистрации.
                                </p>
                            </div>

                            <div className="flex items-center gap-3">
                                <div
                                    className="w-12 h-12 rounded-full bg-cyan-500 flex items-center justify-center text-xl font-bold">
                                    2
                                </div>
                                <p>
                                    Если Вы ошиблись при вводе номера бланка регистрации, нажмите
                                    "Изменить" справа от номера бланка.
                                </p>
                            </div>

                            <div className="flex items-center gap-3">
                                <div
                                    className="w-12 h-12 rounded-full bg-cyan-500 flex items-center justify-center text-xl font-bold">
                                    3
                                </div>
                                <p>
                                    Если введенный номер бланка регистрации верный, дождитесь
                                    организатора для подтверждения его корректности.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex justify-center">
                            <Button
                                onClick={() => setStage(4)}
                                className="px-8 py-3 text-lg bg-green-600 hover:bg-green-700"
                            >
                                ДАННЫЕ КОРРЕКТНЫ
                            </Button>
                        </div>

                        <CircleAlert />
                        <div className="text-center text-sm text-gray-400">
                            <p>Внимание!</p>
                            <p>
                                В режиме имитации подтвердите корректность данных самостоятельно,
                                нажав кнопку «Данные корректны».
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Stage 4: Активация экзамена */}
            {stage === 4 && (
                <div className="flex flex-col justify-between space-y-8 grow mt-10">
                    <div className="p-8 rounded-lg space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold mb-4">БЛАНК РЕГИСТРАЦИИ</h3>
                            <div className="flex gap-2 mb-6">
                                <InputOTP maxLength={13} pattern={REGEXP_ONLY_DIGITS} value={blankNum}
                                          className="flex gap-2 mb-4" readOnly disabled>
                                    <InputOTPGroup>
                                        <InputOTPSlot index={0}/>
                                    </InputOTPGroup>
                                    <InputOTPGroup>
                                        <InputOTPSlot index={1}/>
                                        <InputOTPSlot index={2}/>
                                        <InputOTPSlot index={3}/>
                                        <InputOTPSlot index={4}/>
                                        <InputOTPSlot index={5}/>
                                        <InputOTPSlot index={6}/>
                                    </InputOTPGroup>
                                    <InputOTPGroup>
                                        <InputOTPSlot index={7}/>
                                        <InputOTPSlot index={8}/>
                                        <InputOTPSlot index={9}/>
                                        <InputOTPSlot index={10}/>
                                        <InputOTPSlot index={11}/>
                                        <InputOTPSlot index={12}/>
                                    </InputOTPGroup>
                                </InputOTP>
                                <Button
                                    variant="destructive"
                                    onClick={() => setStage(1)}
                                    className="px-6"
                                >
                                    ИЗМЕНИТЬ
                                </Button>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-4">НОМЕР КИМ</h3>
                            <div className="flex gap-2 mb-6">
                                <InputOTP maxLength={8} pattern={REGEXP_ONLY_DIGITS} value={kimData?.id?.toString()}
                                          className="flex gap-2 mb-4" readOnly disabled>
                                    <InputOTPGroup>
                                        <InputOTPSlot index={0}/>
                                        <InputOTPSlot index={1}/>
                                        <InputOTPSlot index={2}/>
                                        <InputOTPSlot index={3}/>
                                    </InputOTPGroup>
                                    <InputOTPGroup>
                                        <InputOTPSlot index={4}/>
                                        <InputOTPSlot index={5}/>
                                        <InputOTPSlot index={6}/>
                                    </InputOTPGroup>
                                    <InputOTPGroup>
                                        <InputOTPSlot index={7}/>
                                    </InputOTPGroup>
                                </InputOTP>
                            </div>
                        </div>

                        <div className="space-y-4 bg-black p-6 rounded">
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-12 h-12 rounded-full bg-cyan-500 flex items-center justify-center text-xl font-bold">
                                    1
                                </div>
                                <p>
                                    Введите код активации, сообщенный организатором в аудитории.
                                </p>
                            </div>

                            <div className="flex items-center gap-3">
                                <div
                                    className="w-12 h-12 rounded-full bg-cyan-500 flex items-center justify-center text-xl font-bold">
                                    2
                                </div>
                                <p>
                                    Нажмите "Начать экзамен", после объявления о начале экзамена в
                                    аудитории.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-4 flex justify-between items-center">
                        <div className="text-center text-sm text-gray-400">
                            <CircleAlert />
                            <p>Код активации сообщает организатор в аудитории.</p>
                            {/*<p>В режиме имитации введите 1597</p>*/}
                        </div>

                        <div className="flex gap-4 items-center justify-center">
                            <button className="text-cyan-400 hover:text-cyan-300 text-sm">
                                Забыли код активации?
                            </button>
                            <Input
                                type="text"
                                value={activationCode}
                                onChange={(e) => setActivationCode(e.target.value)}
                                placeholder="ВВЕДИТЕ КОД АКТИВАЦИИ"
                                className="w-80 h-12 text-center text-lg bg-[#2a2a2a] border-2 border-cyan-500 uppercase"
                                maxLength={4}
                            />
                            <Button
                                onClick={handleStart}
                                disabled={activationCode !== kimData?.unlockCode}
                                className="px-8 py-3 text-lg bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
                            >
                                Начать экзамен
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
        // </div>
    );
}
