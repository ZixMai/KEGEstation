import "@/styles/globals.css";

import type {Metadata} from "next";
import {Geist} from "next/font/google";
import {Providers} from "@/app/providers";

export const metadata: Metadata = {
    title: "Станция КЕГЭ",
    description: "Демонстрационная станция КЕГЭ",
    icons: [{rel: "icon", url: "/favicon.ico"}],
};

const geist = Geist({
    subsets: ["latin"],
    variable: "--font-geist-sans",
});

export default function RootLayout({
                                       children,
                                   }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html className={`${geist.variable}`} lang="en">
            <body>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
