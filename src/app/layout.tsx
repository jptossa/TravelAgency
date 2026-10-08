import type { Metadata } from "next";
import { Cinzel, EB_Garamond } from "next/font/google";
import Link from "next/link";
import { Suspense } from "react";
import { SITE_NAME } from "@/lib/content";
import { UserNav } from "./user-nav";
import "./globals.css";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
});

const garamond = EB_Garamond({
  variable: "--font-garamond",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: SITE_NAME,
  description: "Travel to the solar systems and planets of the 41st Millennium.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${cinzel.variable} ${garamond.variable}`}>
      <body>
        <header>
          <Link href="/">{SITE_NAME}</Link>
          <nav>
            <Link href="/">Home</Link>
            <Link href="/planets">Planets</Link>
            <Suspense fallback={null}>
              <UserNav />
            </Suspense>
          </nav>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
