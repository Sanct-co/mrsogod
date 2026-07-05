import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { BackgroundFacets } from "@/components/background-facets";
import { SiteIntro } from "@/components/site-intro";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { verifySession } from "@/lib/auth/dal";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Mister Sogod 2026",
  description: "Official candidate gallery and voting for Mister Sogod 2026.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await verifySession();

  return (
    <html lang="en" className={`${montserrat.variable} h-full antialiased`}>
      <body className="relative flex min-h-full flex-col">
        <SiteIntro />
        <BackgroundFacets />
        <SiteHeader hasSession={!!session} />
        <main className="relative z-10 flex-1">{children}</main>
        <SiteFooter />
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#1a1a1a",
              color: "#f5e6c8",
              border: "1px solid #c9a24b",
            },
          }}
        />
      </body>
    </html>
  );
}
