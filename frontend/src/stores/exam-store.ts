import { create } from "zustand";
import type { KimData, Task } from "@/lib/types";
import { SCALE, EXAM_DURATION } from "@/lib/constants";
import rateAnswers from "@/lib/score";

const setLocalStorage = (data: KimData) =>
  localStorage.setItem("kimData", JSON.stringify(data));
const getLocalStorage = (): KimData | null => {
  const data = localStorage.getItem("kimData");
  return data ? JSON.parse(data) : null;
};
const removeLocalStorage = () => localStorage.removeItem("kimData");

const getPrimaryScore = (tasks: Task[]) =>
  tasks.reduce((acc, el) => acc + el.score, 0);
const getSecondaryScore = (primaryScore: number) => SCALE[primaryScore] || 0;

interface ExamState {
  kimData: KimData | null;
  index: number | null;
  showResult: boolean;
  blankNumber: string;
  endExam: boolean;
  isTransfered: boolean;

  // Actions
  updateKimData: () => void;
  saveTasks: (data: KimData) => void;
  setIndex: (index: number | null) => void;
  setBlankNumber: (number: string) => void;
  setAnswer: (answer: string) => void;
  nextIndex: () => void;
  prevIndex: () => void;
  backToTask: (index: number) => void;
  startExam: () => void;
  endExamAction: () => void;
  updateTimer: () => void;
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

    const task = kimData.tasks[index];
    if (task) {
      task.answer = answer;
      setLocalStorage(kimData);
      set({ kimData: { ...kimData } });
    }
  },

  nextIndex: () => {
    const { index, kimData } = get();
    if (!kimData) return;
    if (index === kimData.tasks.length - 1) return;
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
      kimData.realMode = false;
      set({ kimData: { ...kimData } });
    }
  },

  endExamAction: () => {
    removeLocalStorage();
    set({ showResult: true, endExam: true });
  },

  updateTimer: () => {
    const { kimData } = get();
    if (!kimData || kimData.time >= EXAM_DURATION) return;

    kimData.time += 1;
    setLocalStorage(kimData);
    set({ kimData: { ...kimData } });

    if (
      kimData.time === EXAM_DURATION &&
      confirm(
        "Время выполнения экзамена окончено! OK - завершить экзамен / Cancel - продолжить выполнение"
      )
    ) {
      removeLocalStorage();
      set({ showResult: true, endExam: true });
    }
  },

  loadKim: async (kim, difficult, userId) => {
    let kimData = getLocalStorage();

    if (kimData && kimData.kim === "-" && kim === "-") {
      const pass = confirm("Продолжить решение прошлого варианта?");
      if (pass) {
        set({ kimData });
        return;
      }
      kimData = null;
      removeLocalStorage();
    }

    const url =
      kim === "-"
        ? `/api/variant/random?difficult=${difficult}`
        : `https://kompege.ru/api/v1/variant/kim/${kim}`;

    try {
      const response = await fetch(url);
      const data: KimData = await response.json();

      if (data.authRequired && !userId) {
        throw new Error("authError");
      }

      if (kimData && kimData.kim === kim) {
        data.tasks.forEach((el, i) => {
          el.answer = kimData.tasks[i] ? kimData.tasks[i].answer : "";
          el.score = 0;
        });
        data.time = kimData.time;
      } else {
        data.tasks.forEach((el) => {
          el.answer = "";
          el.score = 0;
        });
        data.time = 0;
      }

      get().saveTasks(data);
    } catch (error) {
      throw error;
    }
  },

  sendResult: async (isVariant) => {
    const { kimData, isTransfered } = get();
    if (!kimData) return;

    rateAnswers(kimData.tasks);

    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    if (token && (!isVariant || !isTransfered)) {
      const result = kimData.tasks.map(
        ({ number, answer, key, taskId, score }) => ({
          number,
          answer,
          key,
          taskId,
          score,
        })
      );

      const primaryScore = getPrimaryScore(kimData.tasks);
      const secondaryScore = getSecondaryScore(primaryScore);

      const data = {
        kim: kimData.kim === "-" ? "0" : kimData.kim,
        result,
        primaryScore,
        secondaryScore,
        hide: kimData.hideAnswer,
        duration: kimData.time * 60000,
      };

      try {
        const existingResponse = await fetch(`/api/result/kim/${data.kim}/user_id`);
        const existing = await existingResponse.json();

        if (existing && data.kim !== "0") {
          if (!kimData.oneAttempt) {
            await fetch(`/api/result/${existing.id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(data),
            });
          }
        } else {
          await fetch("/api/result", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });
        }

        set({ isTransfered: true });
      } catch (error) {
        console.error("Failed to send result:", error);
      }
    }
  },
}));

// Selector for current task
export const useCurrentTask = () => {
  return useExamStore((state) => {
    if (state.index === null || !state.kimData) return null;
    return state.kimData.tasks[state.index];
  });
};
