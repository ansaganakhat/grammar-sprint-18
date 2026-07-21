import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AppShell } from "@/components/app-shell";

const publicBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const metadata: Metadata = {
  title: "Grammar Sprint 18",
  description: "Қазақстан магистратурасына ағылшын грамматикасынан дайындық платформасы",
  manifest: `${publicBasePath}/manifest.webmanifest`,
  icons: { icon: `${publicBasePath}/icon.svg` }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="kk" suppressHydrationWarning><body><ThemeProvider><AppShell>{children}</AppShell></ThemeProvider></body></html>;
}
