import Logo from "@/components/shared/logo";
import HeaderAuth from "./header-auth";
import MobileNav from "./mobile-nav";
import NavLinks from "./nav-links";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4">
        <div className="flex items-center gap-1">
          <MobileNav />
          <Logo />
        </div>
        <NavLinks className="hidden md:flex" />
        <HeaderAuth />
      </div>
    </header>
  );
}
