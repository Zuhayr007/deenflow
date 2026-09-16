import { Link, useLocation } from "@tanstack/react-router";
import { BookOpen, Clock, Heart, LayoutGrid } from "lucide-react";
const items = [
  { to: "/" as const, label: "Prayer", Icon: Clock },
  { to: "/quran" as const, label: "Quran", Icon: BookOpen },
  { to: "/duas" as const, label: "Duas", Icon: Heart },
  { to: "/tools" as const, label: "Tools", Icon: LayoutGrid },
];
export default function BottomNav() {
  const { pathname } = useLocation();
  return (
    <nav
      aria-label="Main navigation"
      className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-border/50"
    >
      <div className="max-w-lg mx-auto flex justify-around pb-[env(safe-area-inset-bottom)]">
        {items.map(({ to, label, Icon }) => {
          const active =
            to === "/" ? pathname === "/" : pathname.startsWith(to);
          return (
            <Link
              key={to}
              to={to}
              aria-current={active ? "page" : undefined}
              className={
                "flex flex-col items-center gap-1 py-3 px-4 border-t-2 " +
                (active
                  ? "text-primary border-primary"
                  : "text-muted-foreground border-transparent")
              }
            >
              <Icon aria-hidden="true" className="h-5 w-5" />
              <span className="text-xs font-semibold">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
