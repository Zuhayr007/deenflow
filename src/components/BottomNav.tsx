import { Link, useLocation } from "@tanstack/react-router";
import { motion } from "framer-motion";

const navItems = [
  {
    to: "/",
    label: "Prayer",
    icon: (active: boolean) => (
      <svg viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth={active ? "0" : "1.8"} className="w-[22px] h-[22px]">
        <path d="M12 2C8 2 4 6 4 10c0 3 2 5 4 6v4h8v-4c2-1 4-3 4-6 0-4-4-8-8-8z" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9 22h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    to: "/quran",
    label: "Quran",
    icon: (active: boolean) => (
      <svg viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth={active ? "0" : "1.8"} className="w-[22px] h-[22px]">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" strokeWidth="1.8"/>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" strokeWidth="1.8"/>
      </svg>
    ),
  },
  {
    to: "/duas",
    label: "Duas",
    icon: (active: boolean) => (
      <svg viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth={active ? "0" : "1.8"} className="w-[22px] h-[22px]">
        <path d="M7 11c-1.5 0-3-1-3-3s1.5-3 3-3c0-1.5 1.5-3 3-3s3 1.5 3 3" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" strokeWidth="1.8"/>
        <path d="M17 11c1.5 0 3-1 3-3s-1.5-3-3-3c0-1.5-1.5-3-3-3s-3 1.5-3 3" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" strokeWidth="1.8"/>
        <path d="M7 11l-1 9h12l-1-9" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" strokeWidth="1.8"/>
      </svg>
    ),
  },
];

export default function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-border/50">
      <div className="mx-auto flex max-w-lg items-center justify-around px-2 pb-[env(safe-area-inset-bottom)]">
        {navItems.map((item) => {
          const isActive =
            item.to === "/" ? location.pathname === "/" : location.pathname.startsWith(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              className="relative flex flex-col items-center gap-1 py-3 px-5 transition-all duration-200"
            >
              <motion.span
                className={isActive ? "text-primary" : "text-muted-foreground"}
                animate={{ scale: isActive ? 1.1 : 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                {item.icon(isActive)}
              </motion.span>
              <span
                className={`text-[10px] font-semibold tracking-wide ${isActive ? "text-primary" : "text-muted-foreground"}`}
                style={{ fontFamily: 'var(--font-body)' }}
              >
                {item.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute -top-px left-3 right-3 h-[3px] rounded-full bg-primary"
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
