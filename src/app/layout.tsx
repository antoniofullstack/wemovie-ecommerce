import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import Header from "@/components/Header";
import Providers from "./providers";
import "./globals.css";

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "WeMovies",
  description: "E-commerce de filmes WeMovies",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${openSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background font-sans">
        <Providers>
          <Header />
          <main className="mx-auto flex w-full max-w-[1080px] flex-1 flex-col px-4">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
