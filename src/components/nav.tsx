"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { logout } from "@/app/login/actions";

const links = [
  { href: "/review", label: "Review" },
  { href: "/sheets", label: "Sheet" },
  { href: "/problems", label: "Log" },
  { href: "/leaderboard", label: "Ranks" },
];

export function Nav() {
  const pathname = usePathname();

  if (pathname === "/login" || pathname === "/register") return null;

  const isDashboard = pathname === "/";

  return (
    <motion.div
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 28 }}
      className="fixed inset-x-0 bottom-6 z-50 flex justify-center px-4"
    >
      <div className="flex items-center gap-1 rounded-full bg-[#111] p-1.5 shadow-[0_3px_14px_rgba(0,0,0,0.28)]">
        {/* Q. badge — also serves as Dashboard link */}
        <Link
          href="/"
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-display text-[15px] tracking-[0.5px] transition-colors ${
            isDashboard ? "bg-white text-[#111]" : "bg-[#F5F1E8] text-[#111]"
          }`}
        >
          Q.
        </Link>

        {links.map((link) => {
          const isActive = pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-full px-3.5 py-[7px] text-[12px] font-medium transition-colors whitespace-nowrap ${
                isActive ? "bg-white font-bold text-[#111]" : "text-white/60 hover:text-white/80"
              }`}
            >
              {link.label}
            </Link>
          );
        })}

        <Link
          href="/problems/new"
          className="rounded-full border-[1.5px] border-white/40 px-3.5 py-[6px] text-[12px] font-bold text-white whitespace-nowrap"
        >
          + New
        </Link>

        <form action={logout}>
          <button
            type="submit"
            className="flex h-8 w-8 items-center justify-center rounded-full text-white/40 transition-colors hover:text-white/70"
            title="Sign out"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </form>
      </div>
    </motion.div>
  );
}
