import {create} from "zustand";
import {persist} from "zustand/middleware";
// import type { User } from "@/lib/types";

export type User = {
    name: string;
    lastName: string;
    patronymic: string;
    school: string;
    schoolClassName: string;
    locality: string;
}

const setLocalStorage = (data: User) =>
    localStorage.setItem("kimData", JSON.stringify(data));
const getLocalStorage = (): User | null => {
    const data = localStorage.getItem("user");
    return data ? JSON.parse(data) : null;
};
const removeLocalStorage = () => localStorage.removeItem("user");

interface UserState {
    user: User | null;
    theme: string;
    setUser: (user: User | null) => void;
    loadUser: () => void;
    // logout: () => void;
    toggleTheme: () => void;
    clearUser: () => void;
}

// function parseJwt(token: string): User | null {
//   try {
//     const base64Url = token.split(".")[1];
//     if (!base64Url) return null;
//     const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
//     const jsonPayload = decodeURIComponent(
//       window
//         .atob(base64)
//         .split("")
//         .map((c) => {
//           return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
//         })
//         .join("")
//     );
//
//     return JSON.parse(jsonPayload);
//   } catch {
//     return null;
//   }
// }
//
// function initTheme(): string {
//   if (typeof window === "undefined") return "light-theme";
//
//   const hasDarkPreference = window.matchMedia("(prefers-color-scheme: dark)")
//     .matches
//     ? "dark-theme"
//     : "light-theme";
//   const localStorageValue = localStorage.getItem("user-theme");
//
//   const theme = localStorageValue || hasDarkPreference || "light-theme";
//   localStorage.setItem("user-theme", theme);
//   // document.documentElement.className = theme;
//
//   return theme;
// }

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            user: null,
            theme: "light-theme",

            setUser: (user) => set({user}),

            // logout: () => {
            //   set({ user: null });
            //   if (typeof window !== "undefined") {
            //     localStorage.removeItem("token");
            //     window.location.href = "/";
            //   }
            // },
            loadUser: () => {
                const data = getLocalStorage();

                if (data) {
                    set({user: data})
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
                    return {theme: newTheme};
                }),
            clearUser: () => {
                set({user: null})
            },
        }),
        {
            name: "user-storage",
            partialize: (state) => ({user: state.user, theme: state.theme}),
        }
    )
);

// export function authFromToken(token: string) {
//   const user = parseJwt(token);
//   if (user) {
//     useUserStore.getState().setUser(user);
//     if (typeof window !== "undefined") {
//       localStorage.setItem("token", token);
//     }
//   }
// }
