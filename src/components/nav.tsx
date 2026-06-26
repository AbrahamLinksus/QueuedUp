"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";

const links = [
  { href: "/", label: "Dashboard" },
  { href: "/review", label: "Review" },
  { href: "/problems", label: "Log" },
];

export function Nav() {
  const pathname = usePathname();

  if (pathname === "/login") return null;

  return (
    <motion.div
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 28 }}
      className="fixed inset-x-0 bottom-6 z-50 flex justify-center px-4"
    >
      <div className="flex items-center gap-1 rounded-full bg-[#111] p-1.5 shadow-[0_3px_14px_rgba(0,0,0,0.28)]">
        <Link
          href="/"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F5F1E8] font-display text-[15px] tracking-[0.5px] text-[#111]"
        >
          Q.
        </Link>

        {links.map((link) => {
          const isActive =
            link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-full px-3.5 py-[7px] text-[12px] font-medium transition-colors whitespace-nowrap ${
                isActive
                  ? "bg-white font-bold text-[#111]"
                  : "text-white/60 hover:text-white/80"
              }`}
            >
              {link.label}
            </Link>
          );
        })}

        <div className="flex-1" />

        <Link
          href="/problems/new"
          className="rounded-full border-[1.5px] border-white/40 px-3.5 py-[6px] text-[12px] font-bold text-white whitespace-nowrap"
        >
          + New
        </Link>
      </div>
    </motion.div>
  );
}
