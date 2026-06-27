"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { logout } from "@/app/login/actions";

const PRIMARY_LINKS = [
  { href: "/review", label: "Review" },
  { href: "/sheets", label: "Sheet" },
  { href: "/problems", label: "Log" },
];

const SECONDARY_LINKS = [
  { href: "/recommend", label: "Find" },
  { href: "/lld", label: "LLD" },
  { href: "/schedule", label: "Schedule" },
  // { href: "/leaderboard", label: "Ranks" },
];

export function Nav() {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(false);

  if (pathname === "/login" || pathname === "/register") return null;

  const isDashboard = pathname === "/";

  return (
    <motion.div
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 28 }}
      className="fixed inset-x-0 bottom-6 z-50 flex justify-center px-4"
    >
      {/* Wrapper is relative so the popup can be positioned above the pill */}
      <div className="relative flex flex-col items-center gap-2">

        {/* ── Vertical popup — appears above the pill ── */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              key="popup"
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="w-44 overflow-hidden rounded-2xl bg-[#111] shadow-[0_4px_24px_rgba(0,0,0,0.35)]"
            >
              {SECONDARY_LINKS.map((link) => {
                const isActive = pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setExpanded(false)}
                    className={`flex items-center px-4 py-3 text-[13px] font-medium transition-colors ${
                      isActive
                        ? "bg-white/10 text-white font-bold"
                        : "text-white/60 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}

              <div className="border-t border-white/10" />

              <Link
                href="/problems/new"
                onClick={() => setExpanded(false)}
                className="flex items-center gap-2 px-4 py-3 text-[13px] font-bold text-white hover:bg-white/5 transition-colors"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="6" y1="1" x2="6" y2="11" />
                  <line x1="1" y1="6" x2="11" y2="6" />
                </svg>
                New Problem
              </Link>

              <form action={logout}>
                <button
                  type="submit"
                  className="flex w-full items-center gap-2 px-4 py-3 text-[13px] text-white/40 hover:bg-white/5 hover:text-white/70 transition-colors"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  Sign out
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Main pill — fixed width, never changes ── */}
        <div className="flex items-center gap-0.5 rounded-full bg-[#111] p-1.5 shadow-[0_3px_14px_rgba(0,0,0,0.28)]">
          {/* Q. — Dashboard */}
          <Link
            href="/"
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-display text-[15px] tracking-[0.5px] transition-colors ${
              isDashboard ? "bg-white text-[#111]" : "bg-[#F5F1E8] text-[#111]"
            }`}
          >
            Q.
          </Link>

          {/* Primary links */}
          {PRIMARY_LINKS.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-3 py-[7px] text-[12px] font-medium transition-colors ${
                  isActive ? "bg-white font-bold text-[#111]" : "text-white/60 hover:text-white/80"
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          {/* More toggle */}
          <button
            onClick={() => setExpanded((e) => !e)}
            className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
              expanded ? "bg-white/15 text-white" : "text-white/40 hover:text-white/70"
            }`}
            aria-label={expanded ? "Close menu" : "More options"}
          >
            <AnimatePresence mode="wait" initial={false}>
              {expanded ? (
                <motion.svg
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.12 }}
                  width="13" height="13" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </motion.svg>
              ) : (
                <motion.svg
                  key="dots"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.12 }}
                  width="16" height="4" viewBox="0 0 16 4" fill="currentColor"
                >
                  <circle cx="2" cy="2" r="1.5" />
                  <circle cx="8" cy="2" r="1.5" />
                  <circle cx="14" cy="2" r="1.5" />
                </motion.svg>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
