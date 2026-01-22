import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/lib/types";

interface UserState {
  user: User | null;
  theme: string;
  setUser: (user: User | null) => void;
  logout: () => void;
  toggleTheme: () => void;
}

function parseJwt(token: string): User | null {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map((c) => {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

function initTheme(): string {
  if (typeof window === "undefined") return "light-theme";

  const hasDarkPreference = window.matchMedia("(prefers-color-scheme: dark)")
    .matches
    ? "dark-theme"
    : "light-theme";
  const localStorageValue = localStorage.getItem("user-theme");

  const theme = localStorageValue || hasDarkPreference || "light-theme";
  localStorage.setItem("user-theme", theme);
  // document.documentElement.className = theme;

  return theme;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      theme: initTheme(),

      setUser: (user) => set({ user }),

      logout: () => {
        set({ user: null });
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
          window.location.href = "/";
        }
      },

      toggleTheme: () =>
        set((state) => {
          const newTheme =
            state.theme === "light-theme" ? "dark-theme" : "light-theme";
          if (typeof window !== "undefined") {
            localStorage.setItem("user-theme", newTheme);
            // document.documentElement.className = newTheme;
          }
          return { theme: newTheme };
        }),
    }),
    {
      name: "user-storage",
      partialize: (state) => ({ user: state.user, theme: state.theme }),
    }
  )
);

export function authFromToken(token: string) {
  const user = parseJwt(token);
  if (user) {
    useUserStore.getState().setUser(user);
    if (typeof window !== "undefined") {
      localStorage.setItem("token", token);
    }
  }
}
