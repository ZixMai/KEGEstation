"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LogOutIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/admin/tasks", label: "Задания" },
  { href: "/admin/kims", label: "Варианты" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <nav className="flex items-center gap-6">
            <Link href="/admin/tasks" className="text-lg font-semibold">
              Админ-панель
            </Link>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm transition-colors ${
                  pathname.startsWith(item.href)
                    ? "font-medium text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              localStorage.removeItem("token");
              signOut({ callbackUrl: "/" });
            }}
          >
            <LogOutIcon className="mr-2 size-4" />
            Выйти
          </Button>
        </div>
      </header>
      {children}
    </div>
  );
}
