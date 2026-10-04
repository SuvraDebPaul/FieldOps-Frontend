import { SidebarItems } from "@/types";

export function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function getActiveUrl(pathname: string, groups: SidebarItems) {
  return groups
    .flatMap((group) => group.items.map((item) => item.url))
    .filter((url) => pathname === url || pathname.startsWith(`${url}/`))
    .sort((a, b) => b.length - a.length)[0];
}
