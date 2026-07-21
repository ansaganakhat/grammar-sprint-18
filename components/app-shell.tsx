import type { ReactNode } from "react";
import { DesktopTopbar, MobileHeader, MobileNavigation, Sidebar } from "@/components/navigation";
export function AppShell({ children }: { children: ReactNode }) { return <><Sidebar /><MobileHeader /><main className="min-h-screen pb-24 lg:ml-72 lg:pb-8"><div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 lg:px-8"><DesktopTopbar />{children}</div></main><MobileNavigation /></>; }
