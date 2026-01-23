import { create } from "zustand";
import type { KimData, Task } from "@/lib/types";
import { SCALE, EXAM_DURATION } from "@/lib/constants";
import rateAnswers from "@/lib/score";
import type {GetKimResponse, KimTask} from "@/api";
import apiClient from "@/lib/axios";

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
  realMode: boolean;

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
  loadKim: (kim: string, difficult: number, userId?: string) => Promise<void>;
  sendResult: (isVariant: boolean) => Promise<void>;
}

export const useExamStore = create<ExamState>()((set, get) => ({
  kimData: null,
  index: null,
  showResult: false,
  blankNumber: "2832503195017",
  endExam: false,
  isTransfered: false,
  realMode: true,

  updateKimData: () => {
    const kimData = getLocalStorage();
    set({ kimData });
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

  setIndex: (index) => set({ index }),

  setBlankNumber: (blankNumber) => set({ blankNumber }),

  setAnswer: (answer) => {
    const { kimData, index } = get();
    if (!kimData || index === null) return;

    const task = kimData.tasksForKim[index];
    if (task) {
      task.userAnswer = answer;
      setLocalStorage(kimData);
      set({ kimData: { ...kimData } });
    }
  },

  nextIndex: () => {
    const { index, kimData } = get();
    if (!kimData) return;
    if (index === kimData.tasksForKim.length - 1) return;
    set({ index: index === null ? 0 : index + 1 });
  },

  prevIndex: () => {
    const { index } = get();
    if (index === null) return;
    set({ index: index === 0 ? null : index - 1 });
  },

  backToTask: (index) => {
    set({ showResult: false, index });
  },

  startExam: () => {
    const { kimData } = get();
    if (kimData) {
      set({ realMode: false });
    }
  },

  endExamAction: () => {
    removeLocalStorage();
    const {kimData} = get();
    rateAnswers(kimData!.tasksForKim);
    set({ showResult: true, endExam: true });
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

  loadKim: async (kim, difficult, userId) => {
    let kimData = getLocalStorage();

    // if (kimData) {
    //   const pass = confirm("Продолжить решение прошлого варианта?");
    //   if (pass) {
    //     set({ kimData });
    //     return;
    //   }
    //   kimData = null;
    //   removeLocalStorage();
    // }

    const url =
      kim === "-"
        ? `/api/variant/random?difficult=${difficult}`
        : `https://kompege.ru/api/v1/variant/kim/${kim}`;

    try {
      // const response = await fetch(url);
      // const data: KimData = await response.json();
      const response = await apiClient.post<GetKimResponse>("kim/get", {
        kimId: Number(kim),
        name: "test",
        firstName: "test",
        contacts: {
          phone: "qq"
        }
      });
      const data = response.data;

      // if (data.authRequired && !userId) {
      //   throw new Error("authError");
      // }

      if (kimData && kimData.id.toString() === kim) {
        data.tasksForKim.forEach((el, i) => {
          el.userAnswer = kimData.tasksForKim[i] ? kimData.tasksForKim[i].userAnswer : "";
          el.score = 0;
        });
        // data.time = kimData.time;
      } else {
        data.tasksForKim.forEach((el) => {
          el.answer = JSON.parse(el.answer).answer;
          el.userAnswer = "";
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
    const { kimData, isTransfered } = get();
    if (!kimData) return;

    rateAnswers(kimData.tasksForKim);

    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    if (token && (!isVariant || !isTransfered)) {
      const result = kimData.tasksForKim.map(
        ({ number, answer,  /*key*/ id, score }) => ({
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

    //   const data = {
    //     kim: kimData.kim === "-" ? "0" : kimData.kim,
    //     result,
    //     primaryScore,
    //     secondaryScore,
    //     hide: kimData.hideAnswer,
    //     duration: kimData.time * 60000,
    //   };
    //
    //   try {
    //     const existingResponse = await fetch(`/api/result/kim/${data.kim}/user_id`);
    //     const existing = await existingResponse.json();
    //
    //     if (existing && data.kim !== "0") {
    //       if (!kimData.oneAttempt) {
    //         await fetch(`/api/result/${existing.id}`, {
    //           method: "PUT",
    //           headers: { "Content-Type": "application/json" },
    //           body: JSON.stringify(data),
    //         });
    //       }
    //     } else {
    //       await fetch("/api/result", {
    //         method: "POST",
    //         headers: { "Content-Type": "application/json" },
    //         body: JSON.stringify(data),
    //       });
    //     }
    //
    //     set({ isTransfered: true });
    //   } catch (error) {
    //     console.error("Failed to send result:", error);
    //   }
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
