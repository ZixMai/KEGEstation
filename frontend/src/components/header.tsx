"use client";

import { ThemeButton } from "./theme-button";

export function Header() {
  return (
    <header className="flex items-center justify-between p-4 bg-background border-b">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold">КЕГЭ</h1>
      </div>
      {/*<ThemeButton />*/}
    </header>
  );
}
