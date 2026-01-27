import {create} from "zustand";
import {SCALE} from "@/lib/constants";
import rateAnswers from "@/lib/score";
import type {GetKimResponse, KimTask} from "@/api";
import apiClient from "@/lib/axios";
import type {User} from "@/stores/user-store";

const setLocalStorage = (data: GetKimResponse) =>
    localStorage.setItem("kimData", JSON.stringify(data));
const getLocalStorage = (): GetKimResponse | null => {
    const data = localStorage.getItem("kimData");
    return data ? JSON.parse(data) : null;
};
const removeLocalStorage = () => localStorage.removeItem("kimData");

const getPrimaryScore = (tasks: KimTask[]) =>
    tasks.reduce((acc, el) => acc + el.score, 0);
const getSecondaryScore = (primaryScore: number) => SCALE[primaryScore] || 0;

interface ExamState {
    kimData: GetKimResponse | null;
    index: number | null;
    showResult: boolean;
    blankNumber: string;
    endExam: boolean;
    isTransfered: boolean;

    // Actions
    updateKimData: () => void;
    saveTasks: (data: GetKimResponse) => void;
    setIndex: (index: number | null) => void;
    setBlankNumber: (number: string) => void;
    setAnswer: (answer: string) => void;
    nextIndex: () => void;
    prevIndex: () => void;
    backToTask: (index: number) => void;
    startExam: () => void;
    endExamAction: () => void;
    // updateTimer: () => void;
    loadKim: (kim: string, user: User) => Promise<void>;
    sendResult: (isVariant: boolean) => Promise<void>;
}

export const useExamStore = create<ExamState>()((set, get) => ({
    kimData: null,
    index: null,
    showResult: false,
    blankNumber: "",
    endExam: false,
    isTransfered: false,

    updateKimData: () => {
        const kimData = getLocalStorage();
        set({kimData});
    },

    saveTasks: (data) => {
        setLocalStorage(data);
        set({
            kimData: data,
            showResult: false,
            endExam: false,
            index: null,
        });
    },

    setIndex: (index) => set({index}),

    setBlankNumber: (blankNumber) => set({blankNumber}),

    setAnswer: (answer) => {
        const {kimData, index} = get();
        if (!kimData || index === null) return;

        const task = kimData.tasksForKim[index];
        if (task) {
            task.answer = answer;
            setLocalStorage(kimData);
            set({kimData: {...kimData}});
        }
    },

    nextIndex: () => {
        const {index, kimData} = get();
        if (!kimData) return;
        if (index === kimData.tasksForKim.length - 1) return;
        set({index: index === null ? 0 : index + 1});
    },

    prevIndex: () => {
        const {index} = get();
        if (index === null) return;
        set({index: index === 0 ? null : index - 1});
    },

    backToTask: (index) => {
        set({showResult: false, index});
    },

    startExam: () => {
        const {kimData} = get();
        if (kimData) {
            kimData.realMode = false;
            set({kimData});
        }
    },

    endExamAction: () => {
        removeLocalStorage();
        const {kimData} = get();
        rateAnswers(kimData!.tasksForKim);
        set({showResult: true, endExam: true});
    },

    // updateTimer: () => {
    //   const { kimData } = get();
    //   if (!kimData || kimData.time >= EXAM_DURATION) return;
    //
    //   kimData.time += 1;
    //   setLocalStorage(kimData);
    //   set({ kimData: { ...kimData } });
    //
    //   if (
    //     kimData.time === EXAM_DURATION &&
    //     confirm(
    //       "Время выполнения экзамена окончено! OK - завершить экзамен / Cancel - продолжить выполнение"
    //     )
    //   ) {
    //     removeLocalStorage();
    //     set({ showResult: true, endExam: true });
    //   }
    // },

    loadKim: async (kim, user) => {
        let kimData = getLocalStorage();

        console.log(kimData)

        if (kimData) {
            set({kimData});
            return;
        }

        try {
            // const response = await fetch(url);
            // const data: KimData = await response.json();
            const response = await apiClient.post<GetKimResponse>("kim/get", {
                kimId: Number(kim),
                ...user
            });
            const data = response.data;

            // if (data.authRequired && !userId) {
            //   throw new Error("authError");
            // }

            if (data && data.id.toString() === kim) {
                data.tasksForKim.forEach((el, i) => {
                    el.answer = data.tasksForKim[i] ? data.tasksForKim[i].answer : "";
                    el.score = 0;
                });
                // data.time = kimData.time;
            } else {
                data.tasksForKim.forEach((el) => {
                    // el.key = JSON.parse(el.answer).answer;
                    el.answer = "";
                    el.score = 0;
                });
                // data.time = 0;
            }

            get().saveTasks(data);
        } catch (error) {
            throw error;
        }
    },

    sendResult: async (isVariant) => {
        const {kimData, isTransfered} = get();
        if (!kimData) return;

        rateAnswers(kimData.tasksForKim);

        const token =
            typeof window !== "undefined" ? localStorage.getItem("token") : null;

        const result = kimData.tasksForKim.map(
            ({number, answer,  /*key*/ id, score}) => ({
                number,
                answer,
                //key,
                id,
                score,
            })
        );

        const primaryScore = getPrimaryScore(kimData.tasksForKim);
        const secondaryScore = getSecondaryScore(primaryScore);

        // TODO sending

        const data = {
            kimId: kimData.id,
            userId: kimData.userId,
            result: kimData.tasksForKim.filter((t) => t.score > 0).length,
            metadata: {
                primaryScore,
                secondaryScore,
                tasks: kimData.tasksForKim.map((item) => ({
                    id: item.id,
                    number: item.number,
                    answer: item.answer,
                    score: item.score,
                    key: item.key
                }))
            }
        };

        try {
            const response = await apiClient.post("kim/createResult", data);
            set({isTransfered: true});
        } catch (error) {
            console.error("Failed to send result:", error);
        }
    },
}));

// Selector for current task
export const useCurrentTask = () => {
    return useExamStore((state) => {
        if (state.index === null || !state.kimData) return null;
        return state.kimData.tasksForKim[state.index];
    });
};
