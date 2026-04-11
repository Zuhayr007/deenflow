import { Link, useLocation } from "@tanstack/react-router";
import { motion } from "framer-motion";

const navItems = [
  {
    to: "/",
    label: "Prayer",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
        <path d="M12 2C8 2 4 6 4 10c0 3 2 5 4 6v4h8v-4c2-1 4-3 4-6 0-4-4-8-8-8z" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9 22h6" strokeLinecap="round"/>
        <path d="M12 2v3" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    to: "/quran",
    label: "Quran",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 6v7" strokeLinecap="round"/>
        <path d="M9 9l3-3 3 3" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    to: "/duas",
    label: "Duas",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
        <path d="M7 11c-1.5 0-3-1-3-3s1.5-3 3-3c0-1.5 1.5-3 3-3s3 1.5 3 3" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M17 11c1.5 0 3-1 3-3s-1.5-3-3-3c0-1.5-1.5-3-3-3s-3 1.5-3 3" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M7 11l-1 9h12l-1-9" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 11v4" strokeLinecap="round"/>
      </svg>
    ),
  },
];

export default function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-lg items-center justify-around px-2 pb-[env(safe-area-inset-bottom)]">
        {navItems.map((item) => {
          const isActive =
            item.to === "/" ? location.pathname === "/" : location.pathname.startsWith(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              className="relative flex flex-col items-center gap-0.5 py-2.5 px-4 transition-colors"
            >
              <span className={isActive ? "text-primary" : "text-muted-foreground"}>
                {item.icon}
              </span>
              <span
                className={`text-[10px] font-medium ${isActive ? "text-primary" : "text-muted-foreground"}`}
              >
                {item.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute -top-px left-2 right-2 h-0.5 rounded-full bg-primary"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
