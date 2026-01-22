"use client";

import { useEffect } from "react";
import "@/lib/axios"; // Initialize axios

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize axios on client side
    import("@/lib/axios");
  }, []);

  return <>{children}</>;
}
