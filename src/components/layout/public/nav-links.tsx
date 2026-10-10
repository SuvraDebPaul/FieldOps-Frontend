"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { publicNavLinks } from "@/routes";
import { isActivePath } from "@/utils";

interface NavLinksProps {
  className?: string;
  onNavigate?: () => void;
}

export default function NavLinks({ className, onNavigate }: NavLinksProps) {
  const pathname = usePathname();

  return (
    <nav aria-label="Main" className={cn("flex gap-1", className)}>
      {publicNavLinks.map((link) => {
        const active = isActivePath(pathname, link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-foreground",
              active ? "text-foreground" : "text-muted-foreground",
            )}
          >
            {link.title}
          </Link>
        );
      })}
    </nav>
  );
}
