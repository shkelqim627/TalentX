import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Providers from "@/providers/Providers";
import ClientLayout from "@/shared/components/layout/ClientLayout";

const proximaNova = localFont({
  src: [
    {
      path: "../../public/fonts/ProximaNovaLight.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/ProximaNovaRegular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/ProximaNovaSemibold.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/ProximaNovaBold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/ProximaNovaExtrabold.otf",
      weight: "800",
      style: "normal",
    },
  ],
  variable: "--font-proxima",
});

export const metadata: Metadata = {
  title: {
    default: "TalentX",
    template: "%s | TalentX"
  },
  description: "TalentX is an AI-first talent network platform connecting businesses with verified talent, teams, and agencies through intelligent matching and integrated collaboration tools.",
  keywords: ["talent matching", "AI recruitment", "freelance developers", "verified talent", "hire teams", "hire agencies", "Toptal competitor"],
  authors: [{ name: "Incrosoft" }],
  creator: "Incrosoft",
  publisher: "Incrosoft",
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={proximaNova.variable} suppressHydrationWarning>
      <body className="antialiased">
        <Providers>
          <ClientLayout>
            {children}
          </ClientLayout>
        </Providers>
      </body>
    </html>
  );
}
