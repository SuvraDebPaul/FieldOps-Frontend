import Link from "next/link";
import Logo from "@/components/shared/logo";

const footerColumns = [
  {
    title: "Platform",
    links: [
      { title: "Services", href: "/services" },
      { title: "Technicians", href: "/technicians" },
    ],
  },
  {
    title: "Company",
    links: [
      { title: "About", href: "/about" },
      { title: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Account",
    links: [
      { title: "Log in", href: "/login" },
      { title: "Register", href: "/register" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-3">
          <Logo />
          <p className="max-w-xs text-sm text-muted-foreground">
            On-site calibration, repair, installation and preventive maintenance
            for industrial instruments, from request to paid invoice.
          </p>
        </div>

        {footerColumns.map((column) => (
          <div key={column.title} className="space-y-3">
            <h2 className="text-sm font-semibold">{column.title}</h2>
            <ul className="space-y-2">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} FieldOps. All rights reserved.
      </div>
    </footer>
  );
}
