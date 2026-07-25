"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

type NavItem = {
  href: string;
  label: string;
  icon: (active: boolean) => ReactNode;
};

const items: NavItem[] = [
  {
    href: "/",
    label: "Home",
    icon: (active) => (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth={active ? 2.25 : 1.75} stroke="currentColor" className="size-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10.5 12 3l9 7.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 9.75V20a.75.75 0 0 0 .75.75h4.5v-5.25a1.5 1.5 0 0 1 1.5-1.5h0a1.5 1.5 0 0 1 1.5 1.5v5.25H18a.75.75 0 0 0 .75-.75V9.75" />
      </svg>
    ),
  },
  {
    href: "/new",
    label: "New",
    icon: (active) => (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth={active ? 2.25 : 1.75} stroke="currentColor" className="size-6">
        <circle cx="12" cy="12" r="8.25" />
        <path strokeLinecap="round" d="M12 8.5v7M8.5 12h7" />
      </svg>
    ),
  },
  {
    href: "/stats",
    label: "Stats",
    icon: (active) => (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth={active ? 2.25 : 1.75} stroke="currentColor" className="size-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5v-6M9.5 19.5v-10M14.5 19.5v-4M19.5 19.5V6" />
      </svg>
    ),
  },
  {
    href: "/settings",
    label: "Settings",
    icon: (active) => (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth={active ? 2.25 : 1.75} stroke="currentColor" className="size-6">
        <circle cx="12" cy="12" r="3" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.4 13.5c.06-.5.06-1 0-1.5l1.9-1.5-1.5-2.6-2.3.6a7.7 7.7 0 0 0-1.3-.75L15.8 5h-3.6l-.4 2.25c-.46.18-.9.43-1.3.75l-2.3-.6-1.5 2.6 1.9 1.5c-.06.5-.06 1 0 1.5l-1.9 1.5 1.5 2.6 2.3-.6c.4.32.84.57 1.3.75L12.2 19h3.6l.4-2.25c.46-.18.9-.43 1.3-.75l2.3.6 1.5-2.6-1.9-1.5Z" />
      </svg>
    ),
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-black/10 bg-white/95 backdrop-blur pb-[env(safe-area-inset-bottom)]"
    >
      <div className="mx-auto flex w-full max-w-md">
        {items.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-label={item.label}
              aria-current={active ? "page" : undefined}
              className={`flex flex-1 items-center justify-center py-3 ${
                active ? "text-neutral-900" : "text-neutral-400"
              }`}
            >
              {item.icon(active)}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
