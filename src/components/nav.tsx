"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Dashboard" },
  { href: "/problems", label: "Problems" },
  { href: "/review", label: "Review" },
];

export function Nav() {
  const pathname = usePathname();

  if (pathname === "/login") return null;

  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="font-mono text-sm font-semibold tracking-tight text-foreground">
          dsa<span className="text-accent">.journal</span>
        </Link>
        <nav className="flex items-center gap-1">
          {links.map((link) => {
            const isActive =
              link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                  isActive
                    ? "bg-accent/15 text-accent-foreground"
                    : "text-muted hover:bg-white/5 hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            href="/problems/new"
            className="ml-2 rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-accent-foreground hover:bg-accent/90"
          >
            + New
          </Link>
        </nav>
      </div>
    </header>
  );
}
